import crypto from "crypto";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export const uploadImage = (imageSource: string, userId: string) => {
  return cloudinary.v2.uploader.upload(imageSource, {
    public_id: crypto.randomBytes(20).toString("hex"),
    folder: `/foodmate-${process.env.NODE_ENV}/${userId}`,
  });
};

export default cloudinary;
