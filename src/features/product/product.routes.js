import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileupload.middleware.js';
import ProductRepository from './product.repository.js';

const productRouter = express.Router();
const productController = new ProductController();

// The request which will come here, will have /api/products by default.
// localhost:3200/api/products
productRouter.get('/', (req, res) => {
    productController.getAllProduct(req, res)
});
productRouter.post('/', upload.single('imageUrl'), (req, res) => {
    productController.addProduct(req, res)
});
productRouter.post('/rate', (req, res, next) => {
    productController.rateProduct(req, res, next)
});
// localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1(query parameters)
productRouter.get('/filter', (req, res) => {
    productController.filterProducts(req, res)
});
productRouter.get('/averagePrice', (req, res, next) => {
    productController.averagePrice(req, res, next)
});
productRouter.get('/:id', (req, res) => {
    productController.getOneProduct(req, res);
});



export default productRouter;