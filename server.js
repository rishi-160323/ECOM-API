import './env.js';

import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';

import bodyParser from 'body-parser';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
// import basicAuthrizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
import apiDocs from './swagger.json' assert {type: 'json'};
import logMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import { connectToMongoDB, getDB } from './src/config/mongodb.js';
import dotenv from 'dotenv';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
// import logger from './src/middlewares/logger.middleware.js'


const server = express();
// load all the environment variable.
// dotenv.config();

// CORS policy configuration.(Search more on google)
var corsOptions = {
    origin: 'http://localhost:5500'
}

server.use(cors(corsOptions));

// server.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin','http://localhost:5500');
//     res.header('Access-Control-Allow-Headers','*');
//     res.header('Access-Control-Allow-Methods','*');
//     // return OK for preflight request.
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

// Middleware to parse URL-encoded form data
server.use(express.urlencoded({ extended: true }));

server.use(bodyParser.json());
// For API Documentation. swagger.serve creates UI.
server.use("/api-docs",
    swagger.serve,
    swagger.setup(apiDocs))

server.use(logMiddleware);
server.use('/api/orders', jwtAuth, orderRouter);
server.use('/api/cart', jwtAuth, cartRouter);
server.use('/api/products', jwtAuth, productRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
    res.send("Welcome to Ecommarce APIs")
});

// error handler middleware at application level.
server.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
    }
    // trying to log the error using logger.
    // logger.info(err)
    res.status(500).send('Something went wrong, please try again later.');
})

// middleware to handle 404 requests, will always execute if no path matched.
server.use((req, res) => {
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3200/api-docs")
})


server.listen(3200, () => {
    console.log("Server is listening on port number 3200");
    // connectToMongoDB();
    connectUsingMongoose();
});