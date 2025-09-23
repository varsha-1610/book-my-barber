import express from "express";
const router = express.Router();
import { 
  registerUser, 
  submitOtp, 
  clientLogin, 
  gClientLogin, 
  clientResendOtp 
} from '../Controllers/clientController.js';

// Client routes
router.post("/register", registerUser);
router.post("/submit-otp", submitOtp);
router.post("/login", clientLogin);
router.post("/googleLogin", gClientLogin);
router.post("/resend-otp", clientResendOtp);

export default router;
