import { HttpStatusCodes } from "@Shared/types/status.codes";

export default class HttpResponse<T = any> {
    constructor(value: HttpResponse) {
        Object.assign(this, value)
    }

    public statusCode?: HttpStatusCodes = HttpStatusCodes.BadRequest;
    public message!: string;
    public success?: boolean = false;
    public data?: T;
}