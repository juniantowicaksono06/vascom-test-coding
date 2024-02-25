import { Request, Response, NextFunction } from "express-serve-static-core";
import Joi, {ValidationResult} from "@hapi/joi";
import { response } from "../utils/response";
import Users from "../models/Users";
import Products from "../models/Products";
import { encryptString, sha256 } from "../utils/helper";
import jwt from 'jsonwebtoken';
import { UsersType } from "../type";
import { Op } from "sequelize";

const Get =  async (req: Request, res: Response, next: NextFunction) => {
    const totalUser = await Users.count({})
    const totalUserActive = await Users.count({
        where: {
            user_status: "ACTIVE"
        }
    })

    const totalProduct = await Products.count({})
    const totalProductActive = await Products.count({
        where: {
            product_status: "ACTIVE"
        }
    })
    return response(200, res, "", {
        "total_user": totalUser,
        "total_user_active": totalUserActive,
        "total_product": totalProduct,
        "total_product_active": totalProductActive
    })
}


export {Get}