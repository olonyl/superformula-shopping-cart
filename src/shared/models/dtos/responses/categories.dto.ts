export default interface ICategoriesDto {
    id: number,
    categoryName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}