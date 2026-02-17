import { AuthService } from "./authService";
import { RedisBase } from "./redisBase";
export const redisBase = new RedisBase();
export const authService = new AuthService();
