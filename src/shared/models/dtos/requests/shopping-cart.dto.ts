import { ICartDetailsDto } from "./cart-details.dto";

export default interface IShoppingCartDto {
    cartId: number;
    cartDetails: ICartDetailsDto[];
}