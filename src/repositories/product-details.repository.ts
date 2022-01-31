import ProductDetails from "@Database/models/product-details.model";
import IProductDetailsRequestDto from "@Shared/models/dtos/requests/product-details.dto";
import IProductDetailsResponseDto from "@Shared/models/dtos/responses/product-details.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ProductDetailsRepository {
    async create(data: IProductDetailsRequestDto): Promise<TransactionResponse> {
        await ProductDetails.query().insert({
            product_id: data.productId,
            category_id: data.categoryId,
            description: data.description,
            price: data.price,
            stock: data.stock,
            regular_price: data.regularPrice,
            attributes: data.attributes,
            tax_rate: data.taxRate
        });

        return { success: true, message: "Product detail created successfully!" }
    }

    async Update(id: number, data: IProductDetailsRequestDto): Promise<TransactionResponse> {
        const product = await ProductDetails.query().findById(id)
        if(!product) return { success: false, message: "The product doesn't exists!" };

        await product.$query().update({
            product_id: data.productId,
            category_id: data.categoryId,
            description: data.description,
            price: data.price,
            regular_price: data.regularPrice,
            tax_rate: data.taxRate,
            stock: data.stock,
            attributes: data.attributes,
            updated_at: new Date()
        });

        return { success: true, message: "Product detail updated successfully!" };
    }

    async delete(id: number): Promise<TransactionResponse> {
        const product = await ProductDetails.query().findById(id)
        if(!product) return { success: false, message: "The product doesn't exists!" };
        
        await product.$query().update({ deleted: true, updated_at: new Date() });
        return { success: true, message: "Product deleted successfully!" };
    }

    async list(): Promise<IProductDetailsResponseDto[]> {
        const products = await ProductDetails.query()
        .select("pdt.id", "pdt.category_id as categoryId", "c.name as categoryName", "p.id as productId",
                "p.name as productName", "pdt.description", "pdt.price", "pdt.tax_rate as taxRate",
                "pdt.stock", "pdt.attributes", "pdt.created_at as createdAt", "pdt.updated_at as updatedAt")
        .from("product_details as pdt")
        .join("categories as c", "pdt.category_id", "c.id")
        .join("products as p", "pdt.product_id", "p.id")
        .where("pdt.deleted", "<>", true);

        //@ts-ignore
        return products as IProductDetailsResponseDto[];
    }

    async getById(id: number): Promise<TransactionResponse> {
        const products = await ProductDetails.query()
        .select("pdt.id", "pdt.category_id as categoryId", "c.name as categoryName", "p.id as productId",
                "p.name as productName", "pdt.description", "pdt.price", "pdt.tax_rate as taxRate",
                "pdt.stock", "pdt.attributes", "pdt.created_at as createdAt", "pdt.updated_at as updatedAt")
        .from("product_details as pdt")
        .join("categories as c", "pdt.category_id", "c.id")
        .join("products as p", "pdt.product_id", "p.id")
        .where("pdt.deleted", "<>", true)
        .where("pdt.id", "=", id).first();

        if(!products) return { success: false, message: "The product doesn't exists!" }

        //@ts-ignore
        return { success: true, data: products as IProductDetailsResponseDto }
    }
}