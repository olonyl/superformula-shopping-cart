import { Request, Response } from "express";

import CategoryRepository from "@Repositories/category.repository";
import ICategoriesRequestDto from "@Shared/models/dtos/requests/categories.dto";
import HttpResponse from "@Shared/models/http.response";
import { HttpStatusCodes as StatusCode } from "@Shared/types/status.codes";

export default class CategoriesController {
    private readonly categoryRepository: CategoryRepository;
    constructor() {
        this.categoryRepository = new CategoryRepository();
        this.create = this.create.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getCategoryById = this.getCategoryById.bind(this);
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as ICategoriesRequestDto;
            const result = await this.categoryRepository.create(data);
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
            const data = req.body as ICategoriesRequestDto;
            const categoryId = (req.params as any).id;
            const result = await this.categoryRepository.Update(categoryId, data);
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

    async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.categoryRepository.list();
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
            const result = await this.categoryRepository.delete(detailId);
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

    async getCategoryById(req: Request, res: Response): Promise<Response> {
        try {
            const detailId = (req.params as any).id;
            const result = await this.categoryRepository.getById(detailId);
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