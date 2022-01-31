export default interface IProductDetailsDto {
    id: number;
    productId: number;
    categoryId: number;
    categoryName: string;
    productName: string;
    description: string;
    price: number;
    taxRate?: number;
    stock: number;
    attributes: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

