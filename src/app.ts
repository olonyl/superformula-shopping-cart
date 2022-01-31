import express, { Express, urlencoded, json, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import Environment from "@Config/environment";
import pkg from "../package.json";
import authRoutes from "@Routes/auth.routes";
import cartRoutes from "@Routes/shopping-cart.routes";
import prodDetailRoutes from "@Routes/product-details.routes";
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./documentation/swagger.json');
import productsRoutes from "@Routes/products.routes";
import categoriesRoutes from "@Routes/categories.routes";

const environment = new Environment();

const app: Express = express();
// settings
app.set("pkg", pkg);
app.set('port', environment.PORT);

// middlewares
app.use(morgan("dev"))
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static('public'));

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to shopping cart API",
        name: app.get("pkg").name,
        version: app.get("pkg").version,
        description: app.get("pkg").description,
        author: app.get("pkg").author,
        dcocumentation: "/docs",
    })
});

app.use("/api/auth", authRoutes);
app.use("/api/shopping_cart", cartRoutes);
app.use("/api/product_details", prodDetailRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);

export default app;