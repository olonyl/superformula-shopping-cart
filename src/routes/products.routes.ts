import { Router } from "express";
import { verifyToken } from "@Middlewares/auth.jwt";
import ProductsController from "@Controllers/products.controller";

const productCtrl: ProductsController = new ProductsController();
const router: Router = Router();

router.post('/', verifyToken, productCtrl.create);
router.put('/:id', verifyToken, productCtrl.update);
router.delete('/:id', verifyToken, productCtrl.delete);
router.get('/', verifyToken, productCtrl.getProducts);
router.get('/:id', verifyToken, productCtrl.getProductById);

export default router;