import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appLogger } from "../../utils/logger";
import { redisBase } from "./index";
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    username: string;
    createdAt: string;
  };
  message?: string;
}
export interface User {
  username: string;
  passwordHash?: string;
  createdAt: string;
  lastLogin?: string;
}
export class AuthService {
  private redis = redisBase.getInstance();
  private readonly SALT_ROUNDS = 10;
  private readonly SESSION_TTL = 86400; // 24 hours

  // User signup
  async signup(username: string, password: string): Promise<AuthResponse> {
    try {
      // Check if username already exists
      const existingUser = await this.redis.hgetall(`user:${username}`);
      if (existingUser && Object.keys(existingUser).length > 0) {
        return {
          success: false,
          message: "Username already taken",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

      // Create user object
      const user: User = {
        username,
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store user in Redis
      await this.redis.hset(`user:${username}`, {
        username: user.username,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      });

      // Add to username index for quick lookup
      await this.redis.sadd("usernames", username);

      // Create session token
      const token = this.createSession(username);

      appLogger.info(`User signed up: ${username}`);

      return {
        success: true,
        token,
        user: {
          username,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      appLogger.error("Signup error:", error);
      return {
        success: false,
        message: "Error during signup",
      };
    }
  }

  // User login
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Get user from Redis
      const userData = await this.redis.hgetall(`user:${username}`);

      if (!userData || Object.keys(userData).length === 0) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.passwordHash);

      if (!isValidPassword) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      // Update last login
      await this.redis.hset(`user:${username}`, "lastLogin", new Date().toISOString());

      // Create session token
      const token = this.createSession(username);

      appLogger.info(`User logged in: ${username}`);

      return {
        success: true,
        token,
        user: {
          username,
          createdAt: userData.createdAt,
        },
      };
    } catch (error) {
      appLogger.error("Login error:", error);
      return {
        success: false,
        message: "Error during login",
      };
    }
  }

  // Verify token
  async verifyToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(token, process.env["JWT_SECRET"] || "your-secret-key") as {
        username: string;
      };

      // Check if session exists in Redis
      const sessionExists = await this.redis.get(`session:${token}`);

      if (sessionExists) {
        return decoded.username;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Create session
  private createSession(username: string): string {
    const token = jwt.sign({ username }, process.env["JWT_SECRET"] || "your-secret-key", {
      expiresIn: "24h",
    });

    // Store session in Redis
    this.redis.setex(`session:${token}`, this.SESSION_TTL, username);

    return token;
  }

  // Logout
  async logout(token: string): Promise<void> {
    await this.redis.del(`session:${token}`);
  }

  // Get user info
  async getUserInfo(username: string): Promise<User | null> {
    const userData = await this.redis.hgetall(`user:${username}`);

    if (!userData || Object.keys(userData).length === 0) {
      return null;
    }

    return {
      username: userData.username,
      passwordHash: userData.passwordHash,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin,
    };
  }
}
