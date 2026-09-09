import express from "express";
import { updateUserValidation, idParamSchema } from "../validators/user.validation.js";

import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";

import { updateUser, deleteUser } from "../controllers/user.controller.js";
import validate from "../middleware/validateHandler.middleware.js";
const router = express.Router();
router.patch(
    '/:id',
    authMiddleware,
    validate(idParamSchema, 'params'),
    validate(updateUserValidation, 'body'),
   
    asyncHandler(updateUser)
);

router.delete(
    '/:id',
    authMiddleware,
    checkRole('admin'),
    validate(idParamSchema, 'params'),
   
    asyncHandler(deleteUser)
);
export default router;