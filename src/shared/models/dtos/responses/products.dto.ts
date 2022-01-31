export default interface IProductsDto {
    id: number,
    productName: string;
    description?: string
    createdAt: Date;
    updatedAt: Date;
}