import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import { Express } from "express-serve-static-core"
import cors from "cors"
import http, { ServerResponse, IncomingMessage, Server } from 'http'
import db, {connectDB} from './config/database'
import ProtectedRoute from './routes/ProtectedRoute'
import bodyParser from "body-parser"
import UnprotectedRoute from './routes/UnprotectedRoute'
import cookieParser from 'cookie-parser';
import multer from 'multer'
import path from 'path'
import { response } from './utils/response'


const app: Express = express();
const server: Server<typeof IncomingMessage, typeof ServerResponse> = new http.Server(app)


let port = (process.env.PORT || 8080)

app.use(cors({
    credentials: true,
    origin: true
}));

app.use(cookieParser());

app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/images'); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload-image', upload.single('image'), (req, res, file) => {
    if (!req.file) {
    //   return res.status(400).send('No file uploaded.');
        return response(400, res, "Tidak ada file yang diupload")
    }
    return response(200, res, "Gambar berhasil diupload", {
        filename: req.file.filename
    })
});

// Mount all route for the API endpoint
UnprotectedRoute(app, server)
ProtectedRoute(app, server)

// serve static image
app.use(express.static('assets'));

server.listen(port, () => console.log(`API Listening on Port: ${port}`))

connectDB()

export { server }
export default app