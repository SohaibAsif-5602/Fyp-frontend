const cloudinary = require('./cloudinary'); // Import the configured Cloudinary instance

/**
 * Upload image to Cloudinary
 * @param {string} imagePath - The path of the image to upload
 * @param {string} folder - The folder in Cloudinary where the image will be stored
 * @returns {Promise<object>} - Returns a promise that resolves with Cloudinary response
 */
const uploadImageToCloudinary = async (imagePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: Machiro, // Specify the folder in Cloudinary
    });

    return {
      success: true,
      url: result.secure_url, // The URL of the uploaded image
      public_id: result.public_id, // The unique public ID of the uploaded image
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = uploadImageToCloudinary;
