import * as Auth from "../controllers/Auth";
import { Express, Request, Response, NextFunction } from "express-serve-static-core"
import { ServerResponse, IncomingMessage, Server } from 'http'
import { Router } from "express"

const UnprotectedRoute = (app: Express, server: Server<typeof IncomingMessage, typeof ServerResponse>) => {   
    const router = Router()

    // Login Admin
    router.options('/login-admin', Auth.LoginAdmin)
    router.post('/login-admin', Auth.LoginAdmin)
    // Login User
    router.post('/login', Auth.LoginUser)

    app.use('/api', router)
}

export default UnprotectedRoute