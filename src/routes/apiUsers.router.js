import { Router } from "express";
import { isAdmin } from '../public/js/authMiddleware.js';
import { apiUsersGetUsers, apiUsersChangeRole, apiUsersUploadDocuments, apiUsersDeleteInactiveUsers, apiUsersDeleteUser } from '../controllers/apiUser.controller.js'


const router = Router();

//Ruta para traer todos los usuarios
router.get('/', isAdmin, apiUsersGetUsers);

//Ruta para cambiar el rol de user a premium
router.put('/premium/:uid', isAdmin, apiUsersChangeRole);

//Ruta para subir documentos
router.post('/:uid/documents', apiUsersUploadDocuments);

//Ruta para borrar usuarios inactivos
router.delete('/', isAdmin, apiUsersDeleteInactiveUsers);

//Ruta para borrar un usuario especifico 
router.delete('/:uid', isAdmin, apiUsersDeleteUser);

export default router;