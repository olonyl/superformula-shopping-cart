import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";
import UserRepository from "@Repositories/user.repository";
import UserDTO from "@Shared/models/dtos/user.dto";
import Environment from "@Config/environment";
import { IUser } from "@Database/models/users.model";
import JwtPayload from "@Shared/models/jwt.payload";

export default class AuthController {
    private readonly userRepository: UserRepository;
    private readonly env: Environment;
    constructor() {
        this.userRepository = new UserRepository();
        this.SignUp = this.SignUp.bind(this);
        this.SignIn = this.SignIn.bind(this);
        this.env = new Environment();
    }

    public async SignUp(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body as Pick<UserDTO, "email" | "username" | "password">;
            const data = await this.userRepository.create(user.email, user.username, user.password);
            if (data.error) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: data.message }));

            return res.status(StatusCode.Created).json(new HttpResponse({ message: data.message, statusCode: StatusCode.Created, success: true }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    public async SignIn(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.body as { user: string, password: string };
            const data = await this.userRepository.validateCredentials(user.user, user.password);
            if (data.error) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: data.message }));
            const _user = data.data as IUser;
            const payload: JwtPayload = {
                id: _user.id,
                email: _user.email,
                username: _user.username,
                created_at: _user.created_at,
                updated_at: _user.updated_at
            }
            const token = jwt.sign(payload as Partial<IUser>, this.env.JWT_SECRET_KEY, {
                expiresIn: this.env.JWT_EXPIRES_IN
            });
            return res.status(StatusCode.Ok).json(new HttpResponse({
                message: "You're logged in successfully!", statusCode: StatusCode.Ok, data: {
                    jwt: token,
                    expiresIn: this.env.JWT_EXPIRES_IN,
                    user: {
                        username: data.data?.username,
                        email: data.data?.email
                    }
                }, success: true
            }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }
}