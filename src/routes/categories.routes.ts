import { Router } from "express";
import { verifyToken } from "@Middlewares/auth.jwt";
import CategoriesController from "@Controllers/categories.controller";

const categoryCtrl: CategoriesController = new CategoriesController();
const router: Router = Router();

router.post('/', verifyToken, categoryCtrl.create);
router.put('/:id', verifyToken, categoryCtrl.update);
router.delete('/:id', verifyToken, categoryCtrl.delete);
router.get('/', verifyToken, categoryCtrl.getCategories);
router.get('/:id', verifyToken, categoryCtrl.getCategoryById);

export default router;