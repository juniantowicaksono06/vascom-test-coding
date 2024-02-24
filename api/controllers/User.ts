import { Request, Response, NextFunction } from "express-serve-static-core";
import Joi, {ValidationResult} from "@hapi/joi";
import { response } from "../utils/response";
import db from "../config/database";
import Users from "../models/Users";
import { generateRandomString, sendEmail, sha256 } from "../utils/helper";
import { UsersType } from "../type";
import { FindOptions } from "sequelize";
const { Op } = require('sequelize');

// Register User Customer dan User Admin
const Create = async (req: Request, res: Response, next: NextFunction) => {
    // Validasi Input
    const schema = Joi.object({
        email: Joi.string().email().max(200).required(),
        fullname: Joi.string().max(200).required(),
        telpon: Joi.string().max(13).required(),
        role: Joi.string().valid("ADMIN", "USER").required()
    })
    let data = req.body
    const {error, value} = schema.validate(data) as ValidationResult
    if(error) {
        return response(400, res, error.details.map(i => i.message).join(','))
    }
    // Begin Transaction
    const transaction = await db.transaction()
    try {
        const users = await Users.findOne({
            where: {
                [Op.or]: [
                    {
                        email: data['email']
                    },
                    {
                        telpon: data['telpon']
                    }
                ]
            }
        })

        // Cek apakah email atau nomor telepon sudah digunakan
        if(users) {
            const user = users.get() as UsersType
            let message = "Email sudah digunakan"
            if(user['telpon'] == data['telpon']) {
                message = "Nomor Telepon sudah digunakan"
            }
            return response(409, res, message)
        }
        // Generate random password
        const password = generateRandomString(10)
        // Hashing password
        const hashedPassword = sha256(password)


        const userData: UsersType = {
            password: hashedPassword,
            fullname: data['fullname'],
            email: data['email'],
            telpon: data['telpon'],
            role: ((data['role'] as string).toUpperCase() as 'ADMIN' | 'USER'),
            user_status: (data['role'] as string).toUpperCase() == 'ADMIN' ? "ACTIVE" : "PENDING"
        }
        // Insert Data ke table users
        await Users.create({
            ...userData
        }, {
            transaction: transaction
        })

        // Commit transaksi
        await transaction.commit()

        // Send email ke email user beserta passwordnya
        sendEmail(data['email'], "Registrasi User Berhasil", `Halo ${data['fullname']},\n\nRegistrasi user anda telah berhasil dan berikut adalah password anda\n\n${password}`, `<h5><b>Halo ${data['fullname']},</b></h5><br/><p>Registrasi user anda telah berhasil dan berikut adalah password anda\n\n<b>${password}</b></p>`)

        return response(201, res, "User behasil ditambahkan")
    }
    catch(error) {
        // Rollback jika ketemu error
        await transaction.rollback()
        return response(500, res, "Internal server error")
    }
}

// Read User Customer dan User Admin
const Read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Take dan Skip
        const limit = parseInt((req.query.take as string)) || 10
        const offset = parseInt((req.query.skip as string)) || 1
        const searchBy = req.query.search_by as string || ""
        const searchValue = req.query.search_value as string || ""
        
        // Offset halaman
        const pageOffset = offset <= 0 ? 0 : (offset - 1) * limit
        
        // Kolom yang diijinkan untuk mencari
        const searchColumn = ["fullname", "telpon", "email", "role", "user_status"]

        let sequelizeParameter: FindOptions = {
            raw: true,
            attributes: [
                'user_id',
                'fullname',
                'telpon',
                'email',
                'role',
                'user_status'
            ],
            limit: limit,
            offset: pageOffset
        }
        // Cek apa ada parameter search kalo ada tambahin key object ke Parameter Sequelize
        if(searchColumn.includes(searchBy)) {
            if(searchValue != "") {
                // Khusus untuk column role dan user status wherenya menggunakan sama dengan
                if(searchBy == "role" || searchBy == "user_status") {
                    sequelizeParameter['where'] = {
                        [searchBy]: searchValue
                    }
                }
                // Untuk yang lainnya menggunakan where like
                else {
                    sequelizeParameter['where'] = {
                        [searchBy]: {
                            [Op.like]: `%${searchValue}%`
                        }
                    }
                }
            }
        }
        // Ambil semua data
        const users = await Users.findAll(sequelizeParameter)
        let responseData: object[] = []
        if(users) {
           responseData = users
        }
        return response(200, res, "", responseData)
    }
    catch(error) {
        return response(500, res, "Internal server error")
    }
}
// Update User Customer dan User Admin
const Update = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = parseInt(req.params.userId)
    // Cek user id exist atau tidak jika tidak maka user tidak ada dan proses tidak perlu dilanjutkan
    if(isNaN(userId)) {
        return response(404, res, "User tidak ditemukan")
    }
    // Validasi Input
    const schema = Joi.object({
        email: Joi.string().email().max(200).required(),
        password: Joi.string().max(100).required(),
        fullname: Joi.string().max(200).required(),
        telpon: Joi.string().max(13).required()
    })

    let data = req.body
    const {error, value} = schema.validate(data) as ValidationResult

    // Validating input
    if(error) {
        return response(400, res, error.details.map(i => i.message).join(','))
    }
    // Begin Transaction
    const transaction = await db.transaction()
    try {
        const users = await Users.findOne({
            where: {
                [Op.or]: [
                    {
                        email: data['email']
                    },
                    {
                        telpon: data['telpon']
                    }
                ]
            }
        })
    
        if(users) {
            const user = users.get() as UsersType
            if(user['user_id'] != userId) {
                let message = "Email sudah digunakan"
                if(data['telpon'] == user['telpon']) {
                    message = "Nomor telepon sudah digunakan"
                }
                return response(409, res, message)
            }
        }

        const hashedPassword = sha256(data['password'])
        data['password'] = hashedPassword
    
        await Users.update({
            ...data
        }, {
            where:  {
                user_id: userId
            },
            transaction: transaction
        })
        // Commit Transaction
        transaction.commit() 
        return response(200, res, "User berhasil diupdate")   
    } catch (error) {
        // Rollback Transaction
        await transaction.rollback()
        return response(500, res, "Internal server error")
    }
}

// Delete User Customer dan User Admin
const Delete = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = parseInt(req.params.userId)
    // Cek user id exist atau tidak jika tidak maka user tidak ada dan proses tidak perlu dilanjutkan
    if(isNaN(userId)) {
        return response(404, res, "User tidak ditemukan")
    }
    // Begin Transaction
    const transaction = await db.transaction()
    try {
        const user = await Users.findOne({
            where: {
                user_id: userId
            }
        })
        if(user == null) {
            return response(404, res, "User tidak ditemukan")
        }
        // Soft delete user dengan ubah statusnya menjadi tidak aktif
        await Users.update({
            user_status: "NOT_ACTIVE"
        }, {
            where:  {
                user_id: userId
            },
            transaction: transaction
        })
        // Commit Transaction
        await transaction.commit()
        return response(200, res, "User berhasil dihapus")
    }
    catch(error: any) {
        // Rollback Transaction
        await transaction.rollback()
        return response(500, res, "Internal server error")
    }
}


export {Create, Read, Update, Delete}