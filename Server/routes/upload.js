import express from 'express';
import multer from 'multer';
import  uploadImageToCloudinary  from '../cloudinary/uploadImage.js';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const result = await uploadImageToCloudinary(req.file.path);

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;