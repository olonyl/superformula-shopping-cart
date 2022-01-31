import Products from "@Database/models/products.model";
import IProductsRequestDto from "@Shared/models/dtos/requests/products.dto";
import IProductsResponseDto from "@Shared/models/dtos/responses/products.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ProductRepository {
    async create(data: IProductsRequestDto): Promise<TransactionResponse> {
        await Products.query().insert({
            name: data.productName,
            description: data.description,
        });

        return { success: true, message: "Product created successfully!" }
    }

    async Update(id: number, data: IProductsRequestDto): Promise<TransactionResponse> {
        const product = await Products.query().findById(id)
        if(!product) return { success: false, message: "The product doesn't exists!" };

        await product.$query().update({
            name: data.productName,
            description: data.description,
            updated_at: new Date()
        });

        return { success: true, message: "Product updated successfully!" };
    }

    async delete(id: number): Promise<TransactionResponse> {
        const product = await Products.query().findById(id)
        if(!product) return { success: false, message: "The product doesn't exists!" };
        
        await product.$query().update({ deleted: true, updated_at: new Date() });
        return { success: true, message: "Product deleted successfully!" };
    }

    async list(): Promise<IProductsResponseDto[]> {
        const products = await Products.query().select("*").where({ deleted: false });
        const _products = products.map(x => this.mapProducts(x));
        return _products;
    }

    async getById(id: number): Promise<TransactionResponse> {
        const product = await Products.query().select("*").where({ deleted: false, id }).first();
        if(!product) return { success: false, message: "The product doesn't exists!" };

        return { success: true, data: this.mapProducts(product) }
    }

    private mapProducts(product: Products): IProductsResponseDto {
        const { id, name, description, created_at, updated_at } = product;
        return ({
            id,
            productName: name,
            description,
            createdAt: created_at,
            updatedAt: updated_at
        }) as IProductsResponseDto;
    }
}