import Users, { IUser } from "@Models/users.model";
import { knexQuery } from "@Database/connection";
import { validateEmail } from "@Shared/constants/validations";

export default class UserRepository {

    public async create(email: string, username: string, password: string) {

        const response = await this.verifyIfUserExists(email, username);
        if (response.error) return { error: response.error, message: response.message };

        await Users.query().insert({
            email,
            username,
            password
        });

        return { error: false, message: "user created successfully!" };
    }

    private async verifyIfUserExists(email: string, username: string): Promise<{ error: boolean, message: string }> {
        const _email = await knexQuery<IUser>("users")
            .select("id")
            .where("normalized_email", "=", email.toUpperCase().trim())
            .first();
        if (_email) return { error: true, message: "email already exists" };

        const _username = await knexQuery<IUser>("users")
            .select("id")
            .where("normalized_username", "=", username.toUpperCase().trim())
            .first();
        if (_username) return { error: true, message: "username already exists" };

        return { error: false, message: "" };
    }

    public async list(): Promise<IUser[]> {
        const users = await knexQuery<IUser>("users").select("*").where("deleted", "<>", true);
        return users;
    }

    public async getByEmailOrUsername(emailOrUsername: string): Promise<Partial<IUser> | null> {
        const isEmail = validateEmail(emailOrUsername);
        const column: string = isEmail ? "normalized_email" : "normalized_username";
        const usermodel = await Users.query().select("*").where(column, "=", emailOrUsername.toUpperCase().trim()).first();

        if (!usermodel) return null;

        const user = this.mapUser(usermodel);
        return user;
    }

    public async validateCredentials(emailOrUsername: string, password: string): Promise<{ error: boolean, message: string, data: Partial<IUser> | null }> {
        const isEmail = validateEmail(emailOrUsername);
        const column: string = isEmail ? "normalized_email" : "normalized_username";
        const usermodel = await Users.query().select("*").where(column, "=", emailOrUsername.toUpperCase().trim()).first();
        if (!usermodel) return { error: true, message: `The ${isEmail ? "email" : "username"} doesn't exists!`, data: null }

        const match = await usermodel.matchPassword(password);
        const user = this.mapUser(usermodel);
        return (match
            ? { error: false, message: "", data: user }
            : { error: true, message: "The password is wrong!", data: null })
    }

    public mapUser(model: Users): Partial<IUser> {
        const { id, username, email, normalized_email, normalized_username, created_at, updated_at } = model;
        return {
            id,
            username,
            email,
            normalized_email,
            normalized_username,
            created_at,
            updated_at
        }
    }
}