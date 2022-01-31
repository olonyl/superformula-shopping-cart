import CartDetails from "@Database/models/cart-details.model";
import ShoppingCart from "@Database/models/shopping-cart.model";
import { ICartDetailsDto } from "@Shared/models/dtos/requests/cart-details.dto";
import IShoppingCartRequestDto from "@Shared/models/dtos/requests/shopping-cart.dto";
import { IShoppingCartDto as IShoppingCartResponseDto, IRawShoppingCartDto } from "@Shared/models/dtos/responses/shopping-cart.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ShoppingCartRepository {
    async create(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
        const userHas = await this.userHasCart(userId);
        if (userHas.cart) return { success: false, message: "The user already has an active cart" };

        const cart = await ShoppingCart.query().insert({
            user_id: userId,
            quantity: 0,
            total: 0,
        });

        await Promise.all(data.cartDetails.map(async (dt) => {
            await this.createCartDetail(dt, cart.id);
        }));

        await this.calculateUserCartTotals(userId);
        return { success: true, message: "Product added succesfully in the cart!" }
    }

    async updateCart(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
            .select("id")
            .where("id", "=", data.cartId)
            .where("user_id", "=", userId)
            .where("deleted", "=", false)
            .first();
        if (!cart) return { success: false, message: "The cart doesn't exists" };

        if (data.cartDetails.length > 0)
            await Promise.all(data.cartDetails.map(async (dt) => {
                const exists = await this.cartDetailExists(dt.product_detail_id, cart.id);
                if (!exists)
                    await this.createCartDetail(dt, cart.id);
                else
                    await this.updateCartDetail(dt, cart.id);
            }));

        await this.calculateUserCartTotals(userId);

        return { success: true, message: "Cart updated successfully!" }
    }

    private async updateCartDetail(cartDetail: ICartDetailsDto, cartId: number) {
        await CartDetails.query().update({ product_detail_id: cartDetail.product_detail_id, quantity: cartDetail.quantity })
            .where("cart_id", "=", cartId)
            .where("product_detail_id", "=", cartDetail.product_detail_id);
    }

    private async calculateUserCartTotals(userId: number): Promise<void> {
        const cart = await ShoppingCart.getByUserId(userId);
        if(!cart) throw new Error("The user doesn't have a cart");
        
        const data = await CartDetails.query()
            .select("total")
            .where("cart_id", "=", cart.id);

        const quantity = data.length;
        const total = quantity > 0
            ? (data.map(x => Number(x.total))).reduce((prev, act) => (prev + act), 0)
            : 0;

        await cart.$query().update({ quantity, total, updated_at: new Date() })
    }

    private async createCartDetail(cartDetail: ICartDetailsDto, cartId: number) {
        const dt = await CartDetails.query().insert({
            cart_id: cartId,
            product_detail_id: cartDetail.product_detail_id,
            quantity: cartDetail.quantity
        });

        return dt;
    }

    private async cartDetailExists(product_detail_id: number, cartId: number): Promise<boolean> {
        const cart = await CartDetails.query().select("id")
            .where("product_detail_id", "=", product_detail_id)
            .where("cart_id", "=", cartId)
            .first();
        return cart ? true : false;
    }

    private async userHasCart(userId: number): Promise<{ cart: boolean, cartId: number | undefined }> {
        const cart = await ShoppingCart.getByUserId(userId, ["id"]);
        return { cart: cart ? true : false, cartId: cart?.id }
    }

    async list(userId: number): Promise<IShoppingCartResponseDto | null> {
        const cart = await ShoppingCart.query()
            .select("sc.id as cart_id",
                "sc.user_id", "u.username",
                "cd.product_detail_id",
                "c.name", "pd.name",
                "pdt.price", "pdt.description",
                "pdt.regular_price",
                "pdt.tax_rate", "sc.quantity as product_quantity",
                "pdt.attributes", "cd.quantity", "sc.total as total_to_pay",
                "cd.sub_total", "cd.total", "sc.created_at", "sc.updated_at")
            .from("shopping_cart as sc")
            .join("users as u", "sc.user_id", "u.id")
            .leftJoin("cart_details as cd", "sc.id", "cd.cart_id")
            .leftJoin("product_details as pdt", "cd.product_detail_id", "pdt.id")
            .leftJoin("categories as c", "pdt.category_id", "c.id")
            .leftJoin("products as pd", "pdt.product_id", "pd.id")
            .where("sc.user_id", "=", userId)
            .where("sc.deleted", "<>", true);
        //@ts-ignore
        const data = this.mapCartList(cart as IRawShoppingCartDto[]);
        return this.checkProductListTotals(data);
    }

    private async checkProductListTotals(data: IShoppingCartResponseDto | null) {
        if(!data) return null;
        
        const { cart_id, products, total_to_pay } = data;
        const result = await Promise.all(
            products.map(async dt => {
                const { price, quantity, tax_rate, product_detail_id } = dt;
                const summary = CartDetails.getTotals(price, quantity, tax_rate ?? 0);
                if (Math.trunc(summary.total) !== Math.trunc(dt.total)) {
                    await this.updateCartDetail({ product_detail_id, quantity }, cart_id);
                    dt.sub_total = summary.subtotal;
                    dt.tax_rate = summary.totalTaxRate;
                    dt.total = summary.total;
                    return dt;
                } else { return dt }
            }));

        const totalToPay = result.map(x => Number(x.total)).reduce((prev, act) => (prev + act), 0);
        if(Math.trunc(total_to_pay) === Math.trunc(totalToPay)){
            data.products.forEach(x => {
                const empty = this.checkNullProperties(x)
                data.products = empty ? [] : data.products;
            })
            return data;
        }

        data.total_to_pay = totalToPay;
        data.product_quantity = result.length;
        await ShoppingCart.query().update({ total: totalToPay, quantity: result.length });
        data.products.forEach(x => {
            const empty = this.checkNullProperties(x)
            data.products = empty ? [] : data.products;
        })
        return data;
    }

    async deleteProduct(product_detail_id: number, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.getByUserId(userId, ["id"]);
        if (!cart) return { success: false, message: "The user doesn't have a cart" };
        const detail = await CartDetails.query()
            .select("id")
            .where("product_detail_id", "=", Number(product_detail_id))
            .where("cart_id", "=", cart.id)
            .first();

        if (!detail) return { success: false, message: "The product doesn't exists!" };

        await detail.$query().delete();
        await this.calculateUserCartTotals(userId);
        return { success: true, message: "Product deleted successfully!" };
    }

    async deleteCart(userId: number, cartId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
            .select("id")
            .where("id", "=", cartId)
            .where("user_id", "=", userId)
            .where("deleted", "=", false)
            .first();

        if (!cart) return { success: false, message: "User doesn't have a cart!" };

        await cart.$query().update({ deleted: true });
        return { success: true, message: "Cart deleted successfully!" };
    }

    async emptyShoopingCart(userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.getByUserId(userId, ["id"]);
        if(!cart) throw new Error("Ups there was an error!");
        
        await CartDetails.query().delete().where({ cart_id: cart.id });
        await this.calculateUserCartTotals(userId);

        return { success: true, message: "The cart was cleaned successfully!" }
    }

    private mapCartList(data: IRawShoppingCartDto[]): IShoppingCartResponseDto | null {
        if (data.length === 0) return null;

        const products = data.map(dt => {
            return {
                product_detail_id: dt.product_detail_id,
                name: dt.name,
                price: dt.price,
                description: dt.description,
                regular_price: dt.regular_price,
                tax_rate: dt.tax_rate,
                attributes: dt.attributes,
                quantity: dt.quantity,
                sub_total: dt.sub_total,
                total: dt.total
            }
        });

        const cart = data[0];

        return {
            cart_id: cart.cart_id,
            user_id: cart.user_id,
            username: cart.username,
            products: products,
            product_quantity: cart.product_quantity,
            total_to_pay: cart.total_to_pay,
            created_at: cart.created_at,
            updated_at: cart.updated_at
        }
    }

    //@ts-ignore
    private checkNullProperties(object: any) {
        const cloned = Object.assign({}, object);
        Object.keys(cloned).forEach((k) => cloned[k] == null && delete cloned[k]);
        return Object.keys(cloned).length === 0 ? true : false;
    }
}