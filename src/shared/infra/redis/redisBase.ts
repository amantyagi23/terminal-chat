import Redis from "ioredis";
import { appLogger } from "../../utils/logger";

export class RedisBase {
  protected client: Redis;

  constructor(protected url: string = "redis://localhost:6379") {
    this.client = new Redis(this.url);
    this.setupEvents();
  }

  private setupEvents(): void {
    this.client.on("connect", () =>
      appLogger.info(`[${this.constructor.name}] ✅ Redis Connected`)
    );

    this.client.on("ready", () => appLogger.info(`[${this.constructor.name}] ✅ Redis Ready`));

    this.client.on("reconnecting", () =>
      appLogger.warn(`[${this.constructor.name}] 🔄 Redis Reconnecting...`)
    );

    this.client.on("end", () =>
      appLogger.warn(`[${this.constructor.name}] 🛑 Redis Connection Closed`)
    );

    this.client.on("error", err =>
      appLogger.error(`[${this.constructor.name}] ❌ Redis Error:`, err)
    );
  }

  public async connect(): Promise<void> {
    // ioredis connects automatically, but to ensure readiness:
    try {
      await this.client.ping();
    } catch (err) {
      appLogger.error(`[${this.constructor.name}] ❌ Redis connection failed:`, err);
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
    appLogger.info(`[${this.constructor.name}] 👋 Disconnected from Redis`);
  }

  public getInstance(): Redis {
    return this.client;
  }
}
