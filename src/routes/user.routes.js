import express from "express";
import { updateUserValidation } from "../validators/user.validation.js";

import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import userController from "../controllers/user.controller.js";
import validate from "../middleware/validateHandler.middleware.js";
const router = express.Router();
router.patch(
    '/:id',
    authMiddleware,
    validate(updateUserValidation, 'body'),
    asyncHandler(userController.updateUser)
);

router.delete(
    '/:id',
    authMiddleware,
    checkRole('admin'),
    asyncHandler(userController.deleteUser)
);
export default router;