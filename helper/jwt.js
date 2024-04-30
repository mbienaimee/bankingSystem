import { expressjwt } from "express-jwt";
import dotenv from "dotenv"
dotenv.config()

const authjwt = ()=>{
    
    return expressjwt({
        secret: process.env.SECRET,
        algorithms: ["HS256"],
        // isRevoked: (req, payload, done)=>{
        //     done(null, true)
        // }
    }).unless({
        path: [
            "/api/v1/register",
            "/api/v1/login",
            "/api/v1/forgot-password",
            "/api/v1/reset-password",
            "/api/v1/verify",
            "/api/v1/auth/resend-verification-email",
            "/api/v1/auth/logout",
            "/api/addacc"
        ]
     

    })
}
export default authjwt
