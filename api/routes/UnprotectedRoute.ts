import * as Auth from "../controllers/Auth";
import { Express, Request, Response, NextFunction } from "express-serve-static-core"
import { ServerResponse, IncomingMessage, Server } from 'http'
import { Router } from "express"
import * as Product from '../controllers/Product'
import * as User from '../controllers/User'

const UnprotectedRoute = (app: Express, server: Server<typeof IncomingMessage, typeof ServerResponse>) => {   
    const router = Router()

    // Login Admin
    router.options('/login-admin', Auth.LoginAdmin)
    router.post('/login-admin', Auth.LoginAdmin)
    // Login User
    router.post('/login', Auth.LoginUser)

    // Produk
    router.get('/product', Product.Read)
    
    // Customer
    router.post('/customer', User.Create)

    app.use('/api', router)
}

export default UnprotectedRoute