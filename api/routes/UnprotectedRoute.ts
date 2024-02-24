import * as Auth from "../controllers/Auth";
import { Express, Request, Response, NextFunction } from "express-serve-static-core"
import { ServerResponse, IncomingMessage, Server } from 'http'
import { Router } from "express"

const UnprotectedRoute = (app: Express, server: Server<typeof IncomingMessage, typeof ServerResponse>) => {   
    const router = Router()

    // Login Route
    router.post('/login', Auth.Login)

    app.use('/api', router)
}

export default UnprotectedRoute