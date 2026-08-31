import { createError } from "../utils/asyncHandler.js"

export const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(createError(`not authorized to access this route`,403 )
            )
        }
        next()
    }
}