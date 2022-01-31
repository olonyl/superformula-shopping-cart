import { email } from "./regex";

export const validateEmail = (_email: string) => email.test(_email);