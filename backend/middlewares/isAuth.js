import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
        if(!token){return res.status(400).json({massage: "token not found"})};
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodeToken){return res.status(400).json({massage: "token not verifid"})}
        req.userId = decodeToken.userId;
        next();
    } catch (error) {
        return res.status(500).json({massage: "isAuth error"})
    }
}

export default isAuth;