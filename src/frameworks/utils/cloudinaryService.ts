import * as cloudinary from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();


// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});


export class CloudinaryService {
  async uploadImage(image: string): Promise<string> {
    try {
      const result: UploadApiResponse = await cloudinary.v2.uploader.upload(image, {folder: 'travello', });
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }
}
