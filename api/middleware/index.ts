import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express-serve-static-core";
import { Router } from 'express';
import { response } from '../utils/response';
import { decryptString } from '../utils/helper';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any; // Define the 'user' property
    }
}

const verifyToken = (fn: Router) => async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies.auth_token || null;
    if(authToken == null) {
        return response(401, res, "Unauthorized Access")
    }
    try {
       const decryptedToken = decryptString(authToken)
       const decodedToken = jwt.verify(decryptedToken, process.env.JWT_SECRET_KEY as string)
       req.user = decodedToken
    }
    catch(error) {
        return response(401, res, "Unauthorized Access")
    }
    return Promise.resolve(fn(req, res, next))
};


export { verifyToken }