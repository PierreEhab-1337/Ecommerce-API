import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/checkRole.middleware.js";
import validate from "../middleware/validateHandler.middleware.js";
import { 
  updateUserValidation, 
  idParamSchema, 
  createUserSchema 
} from "../validators/user.validation.js";
import { 
  AddUser,
  GetAllUser,
  GetUserById,
  updateUser, 
  deleteUser 
} from "../controllers/user.controller.js";


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
router.post(
  '/add', 
  authMiddleware, 
  checkRole('admin'), 
  validate(createUserSchema, 'body'), 
  asyncHandler(AddUser)
);
router.get(
  '/all', 
  authMiddleware, 
  checkRole('admin'), 
  asyncHandler(GetAllUser)
);
router.get(
  '/:id', 
  authMiddleware, 
  checkRole('admin'), 
  validate(idParamSchema, 'params'), 
  asyncHandler(GetUserById)
);

export default router;