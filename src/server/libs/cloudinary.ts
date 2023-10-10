import cloudinary from "cloudinary";
import crypto from "crypto";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (imageSource: string, userId: string) => {
  const uploadResult = await cloudinary.v2.uploader.upload(imageSource, {
    public_id: crypto.randomBytes(20).toString("hex"),
    folder: `/foodmate-${process.env.NODE_ENV}/${userId}`,
  });

  return uploadResult;
};

export default cloudinary;
