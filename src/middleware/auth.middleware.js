import JWT from "jsonwebtoken";

export default (req, res, next) => {
    const token = req.cookies.token;
    if(!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorized access. You must login first"
        });

    try{
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err){
        return res.status(401).json({
            success: false,
            message: "Expired or invalid token",
            error: err,
        });
    }
}