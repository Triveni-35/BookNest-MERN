import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//   res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })

//UPDATE Only the user themselves or an admin can update the user's information.
router.put("/:id", verifyUser, updateUser);

//DELETE Only the authenticated user or an admin can delete the account.
router.delete("/:id", verifyUser, deleteUser);

//GET The authenticated user or admin can fetch the details.
router.get("/:id", verifyUser, getUser);

//GET ALL Only an admin can access this route.
router.get("/", verifyAdmin, getUsers);

export default router;
