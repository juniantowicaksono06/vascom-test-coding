import { Express, Request, Response, NextFunction } from "express-serve-static-core"
import { ServerResponse, IncomingMessage, Server } from 'http'
import { Router } from "express"
import * as UserController from "../controllers/User"
import * as ProductController from "../controllers/Product"
import { verifyToken } from "../middleware";

const ProtectedRoute = (app: Express, server: Server<typeof IncomingMessage, typeof ServerResponse>) => {   
    const router = Router()

    // User Section
    // Create User Route
    router.post('/user', UserController.Create)

    // Read User Route
    router.get('/user', UserController.Read)

    // Update User Route
    router.put('/user/:userId', UserController.Update)

    // Delete User Route
    router.delete('/user/:userId', UserController.Delete)


    // Produk Section
    
    // Create Produk Route
    router.post('/product', ProductController.Create)

    // Read Produk Route
    router.get('/product', ProductController.Read)

    // Update Produk Route
    router.put('/product/:productId', ProductController.Update)

    // Delete Produk Route
    router.delete('/product/:productId', ProductController.Delete)
    
    // Add prefix API to endpoint
    app.use('/api', verifyToken(router))

    // Default error handler
    app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
        return res.status(err.output.statusCode).send(err.output.payload);
    });
}

export default ProtectedRoute