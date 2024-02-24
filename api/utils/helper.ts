import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import nodemailer from 'nodemailer'


export function sha256(text: string) {
    return createHash('sha256').update(text).digest('hex')
}

export async function sendEmail(to: string, subject: string, text: string, html: string) {
    const transporter = nodemailer.createTransport({
        host: (process.env.MAIL_HOST as string),
        port: ((process.env.MAIL_PORT as unknown) as number),
        auth: {
            user: (process.env.MAIL_USER as string),
            pass: (process.env.MAIL_PASS as string)
        }
    })
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    })
}

export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function sha1(input: Buffer) {
    return createHash('sha1').update(input).digest();
}

export function password_derive_bytes(password: string, salt: string, iterations: number, len: number) {
    var key = Buffer.from(password + salt);
    for (var i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        var hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (var counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}

export function encryptString(text: string) {
    var key = password_derive_bytes(process.env.SECRET_KEY as string, '', 100, 32);
    var cipher = createCipheriv('aes-256-cbc', key, Buffer.from(process.env.IV as string));
    var part1 = cipher.update(text, 'utf8');
    var part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
}
  
export function decryptString(encryptedData: string) {
    var key = password_derive_bytes(process.env.SECRET_KEY as string, '', 100, 32);
    var decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(process.env.IV as string));
    var decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
}