import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";
import HttpResponse from "@Shared/models/http.response";
import Environment from "@Config/environment";
import JwtPayload from "@Shared/models/jwt.payload";
import Users from "@Database/models/users.model";

const env: Environment = new Environment();
// @ts-ignore
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const rawToken = req.headers.authorization as string | undefined;
    if (!rawToken) return res.status(StatusCode.Forbidden).json(new HttpResponse({ message: "No token provided", statusCode: StatusCode.Forbidden }));

    try {
        const token = rawToken?.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as JwtPayload;
        (req as any).user = decoded;
        const user = await Users.query().findById((req as any).user.id);
        if (!user) return res.status(StatusCode.NotFound).json(new HttpResponse({ message: "User not found", statusCode: StatusCode.NotFound }));
        next();
    } catch (error) {
        return res.status(StatusCode.Unauthorized).json(new HttpResponse({ message: "Unauthorized, Please sign in to continue!", statusCode: StatusCode.Unauthorized }))
    }
}