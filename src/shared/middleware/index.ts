import { adminPermissionRepo, adminSessionRepo, permissionRepo } from "../../modules/admin/repos";
import { Middleware } from "./middleware";

const middleware = new Middleware(adminSessionRepo, adminPermissionRepo, permissionRepo);

export { middleware };
