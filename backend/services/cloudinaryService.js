import { v2 as cloudinary } from 'cloudinary'

// El SDK lee CLOUDINARY_URL del .env automáticamente.
if (!process.env.CLOUDINARY_URL) {
  throw new Error('Falta CLOUDINARY_URL en backend/.env')
}
cloudinary.config({ secure: true })

const FOLDER = 'portfolio/covers' // creacion de la carpeta en cloudinary para guardar las covers


// URL optimizada: 16:9, 1200px de ancho, recorte inteligente,
// formato y calidad automáticos (WebP/AVIF si el navegador los soporta).
export function coverUrl(publicId) {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 1200, aspect_ratio: '16:9', crop: 'fill', gravity: 'auto' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
  })
}

// Sube la imagen que multer dejó en memoria (req.file.buffer).
// Devuelve { url, publicId }.
export function uploadCover(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: coverUrl(result.public_id), publicId: result.public_id })
      },
    )
    stream.end(buffer)
  })
}

// Borra una imagen de Cloudinary. Si falla, solo lo registra:
// no queremos que un proyecto no se pueda borrar por un problema con la imagen.
export async function deleteCover(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error('No se pudo borrar la imagen en Cloudinary:', err)
  }
}
