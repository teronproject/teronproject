import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary client configuration.
 * Used for server-side signed upload generation — never expose credentials to the client.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generate a signed upload signature for Cloudinary.
 * The client uses this signature to upload directly to Cloudinary
 * without exposing API secrets.
 *
 * @param {object} options
 * @param {string} options.folder - Target folder in Cloudinary
 * @param {string[]} [options.allowedFormats] - Allowed file formats
 * @param {number} [options.maxFileSize] - Max file size in bytes
 * @returns {{ signature: string, timestamp: number, apiKey: string, cloudName: string }}
 */
export function generateUploadSignature({
  folder,
  allowedFormats = ["jpg", "jpeg", "png", "webp", "svg"],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}) {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder: `teron/${folder}`,
    allowed_formats: allowedFormats.join(","),
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: `teron/${folder}`,
    maxFileSize,
  };
}

export default cloudinary;
