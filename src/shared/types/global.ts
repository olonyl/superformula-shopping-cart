import JwtPayload from "@Shared/models/jwt.payload";

declare namespace Express {
    export interface Request {
       user?: JwtPayload;
    }
 }