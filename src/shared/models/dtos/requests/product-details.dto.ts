export default interface IProductDetailsDto {
    productId: number;
    categoryId: number;
    description?: string;
    price: number;
    regularPrice?: number;
    taxRate?: number;
    stock: number;
    attributes: Record<string, any>;
}