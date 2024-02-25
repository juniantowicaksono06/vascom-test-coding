import { Request, Response, NextFunction } from "express-serve-static-core";
import Joi, {ValidationResult} from "@hapi/joi";
import { response } from "../utils/response";
import db from "../config/database";
import Products from "../models/Products";
import { ProductsType } from "../type";
import { FindOptions } from "sequelize";
import { Op } from "sequelize";

// Create Produk
const Create = async (req: Request, res: Response, next: NextFunction) => {
    // Validasi Input
    const schema = Joi.object({
        nama: Joi.string().max(200).required(),
        harga: Joi.number().required(),
        gambar: Joi.string().required()
    })
    let data = req.body
    const {error, value} = schema.validate(data) as ValidationResult
    if(error) {
        return response(400, res, error.details.map(i => i.message).join(','))
    }
    // Begin Transaction
    const transaction = await db.transaction()
    try {
        const productData: ProductsType = {
            nama: data['nama'],
            harga: data['harga'],
            product_status: "ACTIVE",
            gambar: data['gambar']
        }
        // Insert Data ke table users
        await Products.create({
            ...productData
        }, {
            transaction: transaction
        })
        // Commit transaksi
        await transaction.commit()

        return response(201, res, "Produk berhasil ditambahkan")
    } catch (error) {
        transaction.rollback()
        return response(500, res, "Internal Server Error")
    }
}

// Read Produk
const Read = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Take dan Skip
        const limit = parseInt((req.query.take as string)) || 10
        const offset = parseInt((req.query.skip as string)) || 1
        const searchBy = req.query.search_by as string || ""
        const searchValue = req.query.search_value as string || ""
        const latest = req.query.latest as string || null // Mencari product yang aktif saja

        
        // Offset halaman
        const pageOffset = offset <= 0 ? 0 : (offset - 1) * limit
        
        // Kolom yang diijinkan untuk mencari
        const searchColumn = ["nama", "product_status"]

        let sequelizeParameter: FindOptions = {
            raw: true,
            attributes: [
                'product_id',
                'nama',
                'harga',
                'gambar',
                'product_status',
                'created_at'
            ],
            limit: limit,
            offset: pageOffset
        }
        // Cek apa ada parameter search kalo ada tambahin key object ke Parameter Sequelize
        if(latest == "TRUE") {
            sequelizeParameter['where'] = {
                product_status: 'ACTIVE'
            }
            sequelizeParameter['order'] = [
                ['created_at', "DESC"]
            ]
        }
        else if(searchColumn.includes(searchBy)) {
            if(searchValue != "") {
                // Khusus untuk column role dan user status wherenya menggunakan sama dengan
                if(searchBy == "product_status") {
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
        const products = await Products.findAll(sequelizeParameter)
        let responseData: object[] = []
        if(products) {
           responseData = products
        }
        return response(200, res, "", responseData)
    }
    catch(error) {
        return response(500, res, "Internal server error")
    }
}

// Update Produk
const Update = async (req: Request, res: Response, next: NextFunction) => {
    const productId: number = parseInt(req.params.productId)
    // Cek user id exist atau tidak jika tidak maka user tidak ada dan proses tidak perlu dilanjutkan
    if(isNaN(productId)) {
        return response(404, res, "Produk tidak ditemukan")
    }
    // Validasi Input
    const schema = Joi.object({
        nama: Joi.string().max(200).required(),
        harga: Joi.number().required(),
        gambar: Joi.string().required()
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
        await Products.update({
            ...data
        }, {
            where:  {
                product_id: productId
            },
            transaction: transaction
            
        })
        // Commit Transaction
        transaction.commit() 
        return response(200, res, "Produk berhasil diupdate")   
    } catch (error) {
        // Rollback Transaction
        await transaction.rollback()
        return response(500, res, "Internal server error")
    }
}

// Delete Produk
const Delete = async (req: Request, res: Response, next: NextFunction) => {
    const productId: number = parseInt(req.params.productId)
    // Cek user id exist atau tidak jika tidak maka user tidak ada dan proses tidak perlu dilanjutkan
    if(isNaN(productId)) {
        return response(404, res, "Produk tidak ditemukan")
    }
    // Begin Transaction
    const transaction = await db.transaction()
    try {
        const user = await Products.findOne({
            where: {
                product_id: productId
            }
        })
        if(user == null) {
            return response(404, res, "Produk tidak ditemukan")
        }
        // Soft delete user dengan ubah statusnya menjadi tidak aktif
        await Products.update({
            product_status: "NOT_ACTIVE"
        }, {
            where:  {
                product_id: productId
            },
            transaction: transaction
        })
        // Commit Transaction
        await transaction.commit()
        return response(200, res, "Produk berhasil dihapus")
    }
    catch(error: any) {
        // Rollback Transaction
        await transaction.rollback()
        return response(500, res, "Internal server error")
    }
}

export { Create, Read, Update, Delete }