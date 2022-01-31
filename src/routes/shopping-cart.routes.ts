import { Router } from "express";
import ShoppingCartController from "@Controllers/shopping-cart.controller";
import { verifyToken } from "@Middlewares/auth.jwt";

const cartCtrl: ShoppingCartController = new ShoppingCartController();
const router: Router = Router();

router.post('/', verifyToken, cartCtrl.create);
router.patch('/', verifyToken, cartCtrl.update);
router.delete('/product/:id', verifyToken, cartCtrl.deleteProduct);
router.delete('/product', verifyToken, cartCtrl.cleanCart);
router.get('/', verifyToken, cartCtrl.getCart);
router.delete('/:id', verifyToken, cartCtrl.delete);

export default router;