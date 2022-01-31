export default interface JwtPayload {
    id: number;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}