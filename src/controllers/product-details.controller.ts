import { Request, Response } from "express";

import ProductDetailsRepository from "@Repositories/product-details.repository";
import IProductDetailsRequestDto from "@Shared/models/dtos/requests/product-details.dto";
import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";

export default class ProductDetailsController {
    private readonly productDetailRepository: ProductDetailsRepository;
    constructor() {
        this.productDetailRepository = new ProductDetailsRepository();
        this.create = this.create.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getProductById = this.getProductById.bind(this);
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IProductDetailsRequestDto;
            const result = await this.productDetailRepository.create(data);
            if (!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Created)
                .json(new HttpResponse({
                    message: result.message as string,
                    success: true,
                    statusCode: StatusCode.Created
                }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }


    async update(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IProductDetailsRequestDto;
            const detailId = (req.params as any).id;
            const result = await this.productDetailRepository.Update(detailId, data);
            if (!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Ok)
                .json(new HttpResponse({
                    message: result.message as string,
                    success: true,
                    statusCode: StatusCode.Ok
                }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    async getProducts(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.productDetailRepository.list();
            return res.status(StatusCode.Ok)
                .json(result);
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const detailId = (req.params as any).id;
            const result = await this.productDetailRepository.delete(detailId);
            if (!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Ok)
                .json(new HttpResponse({
                    message: result.message as string,
                    success: true,
                    statusCode: StatusCode.Ok
                }));
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }

    async getProductById(req: Request, res: Response): Promise<Response> {
        try {
            const detailId = (req.params as any).id;
            const result = await this.productDetailRepository.getById(detailId);
            if (!result.success) return res.status(StatusCode.BadRequest).json(new HttpResponse({ message: result.message as string }));

            return res.status(StatusCode.Ok)
                .json(result.data);
        } catch (error: any) {
            return res.status(StatusCode.InternalServerError).json(new HttpResponse({
                message: error.message,
                statusCode: StatusCode.InternalServerError
            }));
        }
    }
}