import { ICategory } from "./models/categories.model";
import { IProduct } from "./models/products.model";
import { IProductDetail } from "./models/product-details.model";
import { IUser } from "./models/users.model";
import { IShoppingCart } from "./models/shopping-cart.model";

export interface ITables {
    products: IProduct;
    categories: ICategory;
    users: IUser;
    product_details: IProductDetail;
    shopping_cart: IShoppingCart;
}