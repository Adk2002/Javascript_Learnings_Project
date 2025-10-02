import { Router } from "express";
import { uploadProfilePic, uploadImages, uploadMixed } from "../middleware/multer.middleware.js";

import { updatedProfilePic, uploadGallery, uploadMixedContent } from "../controller/multer.controller.js";

export const router = Router();

router.post('/upload/profile-pic', uploadProfilePic, updatedProfilePic);
router.post('/upload/images', uploadGallery, uploadImages);
router.post('/upload/mixed', uploadMixed, uploadMixedContent);

export default router;