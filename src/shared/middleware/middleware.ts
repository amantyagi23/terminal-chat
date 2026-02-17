import type { FastifyReply, FastifyRequest } from "fastify";
import { appLogger } from "../utils/logger";
import { JWTUtils } from "../utils/JWTUtils";
import type { IAdminSessionRepo } from "../../modules/admin/repos/IAdminSessionRepo";
import type DecodedFastifyRequest from "../../modules/admin/infra/http/decodedRequest";
import type { IAdminPermissionRepo } from "../../modules/admin/repos/IAdminPermissionRepo";
import type { IPermissionRepo } from "../../modules/admin/repos/IPermissionRepo";

export class Middleware {
  private readonly adminSessionRepo: IAdminSessionRepo;
  private readonly adminPermissionRepo: IAdminPermissionRepo;
  private readonly permissionRepo: IPermissionRepo;

  constructor(
    adminSessionRepo: IAdminSessionRepo,
    adminPermissionRepo: IAdminPermissionRepo,
    permissionRepo: IPermissionRepo,
  ) {
    this.adminSessionRepo = adminSessionRepo;
    this.adminPermissionRepo = adminPermissionRepo;
    this.permissionRepo = permissionRepo;
  }

  /** Send standardized error responses */
  private endRequest(status: 400 | 401 | 403, message: string, res: FastifyReply): void {
    res.status(status).send({ message });
  }

  /** Ensures the user is authenticated via JWT token */
  public ensureAuthenticated() {
    return async (req: FastifyRequest, res: FastifyReply) => {
      const token = req.cookies["accessToken"];

      if (!token) {
        return this.endRequest(401, "Missing or invalid Authorization header", res);
      }

      // const token = authHeader.split(" ")[1];

      try {
        const decoded = await JWTUtils.decodeJWT(token);
        const { adminId } = decoded;

        // Check if the admin session exists
        await this.adminSessionRepo.getAdminSessionByAdminId(adminId);

        // Attach decoded token to the request
        (req as any).decoded = decoded;
        return;
      } catch (err) {
        if (err instanceof Error && err.message === "jwt expired") {
          return this.endRequest(401, "Token signature expired.", res);
        }

        return this.endRequest(403, "Auth token not found or invalid. Please login again.", res);
      }
    };
  }

  /**  Ensures the admin has permission for a given key */
  public ensureAuthorization(permissionKey: string) {
    return async (req: DecodedFastifyRequest, res: FastifyReply) => {
      const { adminId } = req.decoded;

      try {
        const permission = await this.permissionRepo.getPermissionByPermissionKey(permissionKey);
        if (!permission) {
          return this.endRequest(403, "Invalid permission key provided.", res);
        }

        const hasAccess = await this.adminPermissionRepo.hasPermission(
          adminId,
          permission.permissionId,
        );

        if (!hasAccess) {
          return this.endRequest(403, "You do not have permission to access this resource.", res);
        }

        // Allow request to continue
        return;
      } catch (error) {
        appLogger.error(error);
        return this.endRequest(500 as any, "Internal authorization error.", res);
      }
    };
  }

  /** Optionally attaches decoded token if it exists (does not block) */
  public includeDecodedTokenIfExists() {
    return async (req: FastifyRequest, res: FastifyReply) => {
      let token = req.headers["authorization"];

      if (token?.startsWith("Bearer ")) {
        token = token.slice(7);
      }

      if (!token) return;

      try {
        const decoded = await JWTUtils.decodeJWT(token);
        if (!decoded) {
          return this.endRequest(401, "Invalid or expired token.", res);
        }

        const { adminId } = decoded;

        await this.adminSessionRepo.getAdminSessionByAdminId(adminId);

        // Attach the decoded token for further use
        (req as any).decoded = decoded;
      } catch (err) {
        appLogger.error(err);
        return this.endRequest(
          403,
          "Auth token invalid or session not found. Please login again.",
          res,
        );
      }
    };
  }
}
