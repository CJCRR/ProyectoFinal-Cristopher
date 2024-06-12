import { Router } from "express";
import { isAuthenticated, isAdmin } from "../public/js/authMiddleware.js";
import { 
    viewsUserRegisterController,
    viewsUserLoginController,
    viewsUserProfileController,
    viewsUserLogoutController,
    viewsUserForgetPasswordController,
    viewUserStateController 
} from "../controllers/viewsUser.controller.js";

const router = Router();

// Ruta para el formulario de registro 
router.get('/register', viewsUserRegisterController);

// Ruta para el formulario de inicio de sesión 
router.get('/login', viewsUserLoginController);

// Ruta para el perfil del usuario 
router.get('/profile', isAuthenticated, viewsUserProfileController);

// Ruta para cerrar sesión 
router.get('/logout', isAuthenticated, viewsUserLogoutController);

// Ruta para cambiar la contraseña
router.get('/forget-password', viewsUserForgetPasswordController);

//Ruta para ver todos los usuarios
router.get('/users', isAdmin, viewUserStateController) 
export default router;