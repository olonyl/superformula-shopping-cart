import { Request, Response } from "express";

import ProductRepository from "@Repositories/product.repository";
import IProductsRequestDto from "@Shared/models/dtos/requests/products.dto";
import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";

export default class ProductsController {
    private readonly productRepository: ProductRepository;
    constructor() {
        this.productRepository = new ProductRepository();
        this.create = this.create.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getProductById = this.getProductById.bind(this);
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as IProductsRequestDto;
            const result = await this.productRepository.create(data);
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
            const data = req.body as IProductsRequestDto;
            const productId = (req.params as any).id;
            const result = await this.productRepository.Update(productId, data);
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
            const result = await this.productRepository.list();
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
            const result = await this.productRepository.delete(detailId);
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
            const result = await this.productRepository.getById(detailId);
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