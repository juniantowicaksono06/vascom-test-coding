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


const app: Express = express();
const server: Server<typeof IncomingMessage, typeof ServerResponse> = new http.Server(app)


let port = (process.env.PORT || 8080)

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json())

// Mount all route for the API endpoint
UnprotectedRoute(app, server)
ProtectedRoute(app, server)

server.listen(port, () => console.log(`API Listening on Port: ${port}`))

connectDB()

export { server }
export default app