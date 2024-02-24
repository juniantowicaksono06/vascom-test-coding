import { Response } from "express-serve-static-core";
import { ApiResponseType, CookieResponseType } from "../type";

const response = (responseCode: number = 200, res: Response, responseMessage: string = "Success", data: object | Array<object> | null = null, cookie: CookieResponseType | null = null) => {
    let result: ApiResponseType = {
        code: responseCode
    };
    if(data) {
        result['data'] = data
    }

    if(responseMessage != "") {
        result['message'] = responseMessage
    }

    if(cookie) {
        return res.status(responseCode).cookie(cookie['cookie_name'], cookie['cookie_value'], cookie['cookie_options']).send(result)
    }

    return res.status(responseCode).send(result);
}

export { response }