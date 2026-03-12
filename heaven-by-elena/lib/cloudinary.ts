/**
 * Upload d'images vers Cloudinary (côté serveur).
 * Variables d'environnement : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
import { v2 as cloudinary } from 'cloudinary';

const FOLDER = 'heaven-products';

function getConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Cloudinary: définir CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.local'
    );
  }
  return { cloud_name, api_key, api_secret };
}

/**
 * Upload une image (buffer) vers Cloudinary.
 * @param buffer - Contenu binaire de l'image
 * @param mimeType - Ex: image/jpeg, image/png
 * @returns { url, public_id }
 */
export async function uploadImage(
  buffer: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<{ url: string; public_id: string }> {
  const config = getConfig();
  cloudinary.config(config);

  return new Promise((resolve, reject) => {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder: FOLDER,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result || !result.secure_url || !result.public_id) {
          reject(new Error('Cloudinary: réponse invalide'));
          return;
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
  });
}
