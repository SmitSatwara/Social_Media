import express  from "express";
import authMiddleWare from "../MiddleWare/AuthMiddleWare.js";
import {getAllUser, deleteUser, followUser, getUser, unfollowUser, updateUser } from "../Controllers/UserController.js";

const router = express.Router();

router.get('/',getAllUser)

router.get('/:id',getUser); 

router.put('/:id',authMiddleWare,updateUser) // put is user for update

router.delete('/:id',authMiddleWare,deleteUser)

router.put('/:id/follow',authMiddleWare,followUser)

router.put('/:id/unfollow',authMiddleWare,unfollowUser)

export default router;
