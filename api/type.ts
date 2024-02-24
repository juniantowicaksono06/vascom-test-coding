import { CookieOptions } from "express"

interface ApiResponseType {
    code: number,
    message?: string,
    data?: Object
}

interface UsersType {
    user_id?: number,
    password: string,
    fullname: string,
    email: string,
    telpon: string,
    role: "ADMIN" | "USER"
    user_status: "ACTIVE" | "NOT_ACTIVE" | "PENDING",
    created_at?: Date,
    updated_at?: Date
}

interface ProductsType {
    product_id?: number,
    nama: string,
    gambar?: string,
    harga: number,
    product_status: "ACTIVE" | "NOT_ACTIVE",
    created_at?: Date,
    updated_at?: Date
}

interface CookieResponseType {
    cookie_name: string,
    cookie_value: string,
    cookie_options: CookieOptions
}

export {ApiResponseType, UsersType, CookieResponseType, ProductsType}