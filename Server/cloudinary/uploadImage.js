import cloudinary from './cloudinaryConfig.js';

const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Machiro', // Optional: Specify folder in Cloudinary
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};
export default uploadImageToCloudinary;
