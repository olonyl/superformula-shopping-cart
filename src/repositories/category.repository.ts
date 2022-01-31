import Categories from "@Database/models/categories.model";
import ICategoriesRequestDto from "@Shared/models/dtos/requests/categories.dto";
import ICategoriesResponseDto from "@Shared/models/dtos/responses/categories.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class CatergoryRepository {
    async create(data: ICategoriesRequestDto): Promise<TransactionResponse> {
        await Categories.query().insert({
            name: data.categoryName,
            description: data.description,
        });

        return { success: true, message: "Category created successfully!" }
    }

    async Update(id: number, data: ICategoriesRequestDto): Promise<TransactionResponse> {
        const category = await Categories.query().findById(id)
        if(!category) return { success: false, message: "The category doesn't exists!" };

        await category.$query().update({
            name: data.categoryName,
            description: data.description,
            updated_at: new Date()
        });

        return { success: true, message: "Category updated successfully!" };
    }

    async delete(id: number): Promise<TransactionResponse> {
        const category = await Categories.query().findById(id)
        if(!category) return { success: false, message: "The category doesn't exists!" };
        
        await category.$query().update({ deleted: true, updated_at: new Date() });
        return { success: true, message: "Category deleted successfully!" };
    }

    async list(): Promise<ICategoriesResponseDto[]> {
        const categories = await Categories.query().select("*").where({ deleted: false });
        const _categories = categories.map(x => this.mapCategory(x));
        return _categories;
    }

    async getById(id: number): Promise<TransactionResponse> {
        const category = await Categories.query().select("*").where({ deleted: false, id }).first();
        if(!category) return { success: false, message: "The category doesn't exists!" };

        return { success: true, data: this.mapCategory(category) }
    }

    private mapCategory(category: Categories): ICategoriesResponseDto {
        const { id, name, description, created_at, updated_at } = category;
        return ({
            id,
            categoryName: name,
            description,
            createdAt: created_at,
            updatedAt: updated_at
        }) as ICategoriesResponseDto;
    }
}