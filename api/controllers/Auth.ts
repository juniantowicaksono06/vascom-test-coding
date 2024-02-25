import { Request, Response, NextFunction } from "express-serve-static-core";
import Joi, {ValidationResult} from "@hapi/joi";
import { response } from "../utils/response";
import Users from "../models/Users";
import { encryptString, sha256 } from "../utils/helper";
import jwt from 'jsonwebtoken';
import { UsersType } from "../type";
import { Op } from "sequelize";

const Login =  async (req: Request, res: Response, next: NextFunction, role: 'ADMIN' | 'USER') => {
    try {
        // Membuat schema untuk validasi
        const schema = Joi.object({
            searchBy: Joi.string().max(200),
            password: Joi.string().max(200).required(),
        })
        let data = req.body
        const {error, value} = schema.validate(data) as ValidationResult
        if(error) {
            return response(400, res, error.details.map(i => i.message).join(','))
        }

        const users = await Users.findOne({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {
                                email: data['searchBy']
                            },
                            {
                                telpon: data['searchBy']
                            }
                        ]
                    }, 
                    {
                        role: role
                    }
                ]
            }
        })
        // Cek apakah email atau nomor telepon ada atau tidak jika tidak ada berarti login gagal
        if(!users) {
           return response(404, res, "User tidak ditemukan")
        }

        const user = users.get() as UsersType

        if(user['user_status'] == "NOT_ACTIVE") {
            return response(404, res, "User tidak aktif")
        }

        // Cek password sama atau tidak jika tidak login gagal
        if(user['password'] != sha256(data['password'])) {
           return response(403, res, "Username atau password salah")
        }

        // Membuat JWT Token
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            user_id: user['user_id'],
            fullname: user['fullname'],
            role: user['role'],
            email: user['email'],
            user_status: user['user_status']
        }, (process.env.JWT_SECRET_KEY as string));

        // Return token ke client beserta cookie
        return response(200, res, "Berhasil login", {
            token: token
        }, {
            cookie_name: role == "ADMIN" ? "auth_token" : "user_token",
            cookie_value: encryptString(token),
            cookie_options: {
                httpOnly: true
            }
        })
    }
    catch (error: any) {
        return response(500, res, 'Internal Server Error')
    }
}

const LoginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    return await Login(req, res, next, 'ADMIN')
}

const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    return await Login(req, res, next, 'USER')
}

export {Login, LoginAdmin, LoginUser}