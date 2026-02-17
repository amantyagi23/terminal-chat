import { appLogger } from "../utils/logger";
import { createServer, Socket } from "net";
import { authService, redisBase } from "./redis";

type UserStatus = "online" | "away" | "busy" | "offline";
export interface ChatClient {
  socket: any; // net.Socket
  username: string;
  token: string;
  status: UserStatus;
  currentRoom?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "message" | "system" | "private";
  recipient?: string;
}

const clients = new Map();
const messageHistory: Message[] = [];
const MAX_HISTORY = 100;
const server = createServer((socket) => {
  let client: ChatClient | null = null;
  let authStep: "waiting" | "login" | "signup" | "authenticated" = "waiting";
  let tempUsername = "";
  const clientAddress = socket.remoteAddress;
  const clientPort = socket.remotePort;
  const clientFamily = socket.remoteFamily;

  appLogger.info(`New connection from ${clientAddress}:${clientPort} (${clientFamily})`);

  // Store connection info even before authentication
  const connectionId = `${clientAddress}:${clientPort}`;
  console.log(connectionId);
  socket.write("\x1b[36m╔══════════════════════════════════════╗\x1b[0m\n");
  socket.write("\x1b[36m║     LAN CHAT - TERMINAL CLIENT       ║\x1b[0m\n");
  socket.write("\x1b[36m╚══════════════════════════════════════╝\x1b[0m\n\n");
  socket.write("1. Login\n");
  socket.write("2. Signup\n");
  socket.write("Choose option (1/2): ");

  socket.on("data", async (data) => {
    const msg = data.toString().trim();

    if (authStep === "waiting") {
      // Handle initial auth menu
      if (msg === "1") {
        socket.write("Enter username: ");
        authStep = "login";
      } else if (msg === "2") {
        socket.write("Choose username: ");
        authStep = "signup";
      } else {
        socket.write("Invalid option. Choose 1 or 2: ");
      }
      return;
    }

    if (!client) {
      // Handle authentication
      if (!tempUsername) {
        tempUsername = msg;
        socket.write("Enter password: ");
        return;
      }

      // Process login/signup
      let result;
      if (authStep === "login") {
        result = await authService.login(tempUsername, msg);
      } else {
        result = await authService.signup(tempUsername, msg);
      }

      if (result.success && result.token && result.user) {
        // Authentication successful
        client = {
          socket,
          username: result.user.username,
          token: result.token,
          status: "online",
        };

        clients.set(result.user.username, client);

        // Send welcome message
        socket.write(`\n\x1b[32m✓ Successfully logged in as ${result.user.username}\x1b[0m\n`);
        socket.write("\x1b[33mCommands: /users, /quit, /help\x1b[0m\n\n");

        // Send recent message history
        sendMessageHistory(socket);

        // Broadcast user joined
        broadcastSystemMessage(`🔵 ${result.user.username} joined the chat`);

        // Update user presence in Redis
        await redisBase.getInstance().hset(`presence:${result.user.username}`, {
          status: "online",
          lastSeen: new Date().toISOString(),
        });

        // Show chat interface
        showChatInterface(socket);
      } else {
        socket.write(`\n\x1b[31m✗ ${result.message}\x1b[0m\n\n`);
        socket.write("1. Login\n");
        socket.write("2. Signup\n");
        socket.write("Choose option (1/2): ");
        tempUsername = "";
        authStep = "waiting";
      }
      return;
    }

    // Handle commands for authenticated users
    if (msg === "/quit") {
      socket.end("Goodbye!\n");
      return;
    }

    if (msg === "/users") {
      const onlineUsers = Array.from(clients.keys()).join(", ");
      socket.write(`\n👥 Online users: ${onlineUsers}\n\n`);
      return;
    }

    if (msg === "/help") {
      socket.write("\n📋 Available commands:\n");
      socket.write("  /users - Show online users\n");
      socket.write("  /quit  - Exit chat\n");
      socket.write("  /help  - Show this help\n\n");
      return;
    }

    // Broadcast message to all clients
    if (msg.length > 0) {
      const message: Message = {
        id: Date.now().toString(),
        sender: client.username,
        content: msg,
        timestamp: new Date().toISOString(),
        type: "message",
      };

      // // Store in history
      messageHistory.push(message);
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }

      // Store in Redis
      await redisBase.getInstance().lpush("message:history", JSON.stringify(message));
      await redisBase.getInstance().ltrim("message:history", 0, MAX_HISTORY - 1);

      // Broadcast to all clients
      broadcastMessage(message);
    }
  });

  socket.on("end", () => {
    if (client) {
      clients.delete(client.username);
      redisBase.getInstance().del(`presence:${client.username}`);
      broadcastSystemMessage(`🔴 ${client.username} left the chat`);
      appLogger.info(`Client disconnected: ${client.username}`);
    }
  });

  socket.on("error", (err) => {
    appLogger.error("Socket error:", err);
  });
});

function broadcastMessage(message: Message) {
  const formattedMessage = `\x1b[36m[${new Date(message.timestamp).toLocaleTimeString()}]\x1b[0m \x1b[32m${message.sender}:\x1b[0m ${message.content}\n`;

  for (const client of clients.values()) {
    client.socket.write(formattedMessage);
  }
}

function broadcastSystemMessage(content: string) {
  const message: Message = {
    id: Date.now().toString(),
    sender: "System",
    content,
    timestamp: new Date().toISOString(),
    type: "system",
  };
  broadcastMessage(message);
}

function sendMessageHistory(socket: Socket) {
  if (messageHistory.length > 0) {
    socket.write("\n📜 Recent messages:\n");
    messageHistory.slice(-10).forEach((msg) => {
      if (msg.type === "system") {
        socket.write(`  ${msg.content}\n`);
      } else {
        socket.write(
          `  [${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.sender}: ${msg.content}\n`,
        );
      }
    });
    socket.write("\n");
  }
}

function showChatInterface(socket: Socket) {
  socket.write("\x1b[2J\x1b[H"); // Clear screen
  socket.write("\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m\n");
  socket.write("                    Welcome to LAN Chat\n");
  socket.write(
    "\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m\n\n",
  );
}
async function initializeServer() {
  try {
    await redisBase.connect();
    server.listen(process.env["PORT"], () => {
      appLogger.info(`LAN Chat Server running on port ${process.env["PORT"]}`);
    });
  } catch (error) {
    appLogger.error(error, "Error starting server:");
    process.exit(1);
  }
}

async function cleanup() {
  try {
    appLogger.info("Starting cleanup...");
  } catch (error) {
    appLogger.error(error, "Error during cleanup");
  }
}

async function shutdown(signal: string) {
  appLogger.info(`${signal} received. Shutting down gracefully...`);

  try {
    await cleanup();
    appLogger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    appLogger.error(error, "Error during shutdown");
    process.exit(1);
  }
}

// Graceful shutdown handlers
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", async (err) => {
  appLogger.error(err, "Uncaught Exception");
  await cleanup();
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  appLogger.error(reason, "Unhandled Rejection");
  await cleanup();
  process.exit(1);
});

// Start the server
initializeServer();
