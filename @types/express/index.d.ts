import User from "../../src/models";

declare global{
    namespace Express {
        interface Request {
            user?: User,
            isSuperAdmin?: boolean,
        }
        interface Response {
            pagination: any
        }
    }
}
