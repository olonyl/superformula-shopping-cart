import { Router } from "express";
import { verifyToken } from "@Middlewares/auth.jwt";
import ProductDetailsController from "@Controllers/product-details.controller";

const prodDetailCtrl: ProductDetailsController = new ProductDetailsController();
const router: Router = Router();

router.post('/', verifyToken, prodDetailCtrl.create);
router.patch('/:id', verifyToken, prodDetailCtrl.update);
router.delete('/:id', verifyToken, prodDetailCtrl.delete);
router.get('/', verifyToken, prodDetailCtrl.getProducts);
router.get('/:id', verifyToken, prodDetailCtrl.getProductById);

export default router;