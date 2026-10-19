import multer from 'multer'

const MAX_MB = Number(process.env.MAX_UPLOAD_MB) || 2
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

// memoryStorage: el archivo queda en req.file.buffer (no se escribe en disco)
// y desde ahí se sube directo a Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true)
    req.invalidFileType = true
    cb(null, false)
  },
})

// Recibe un archivo en el campo "cover" y responde 400 con un mensaje claro si algo está mal.
export const uploadCoverFile = (req, res, next) => {
  upload.single('cover')(req, res, (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? `La imagen supera los ${MAX_MB} MB` : 'No se pudo leer el archivo'
      return res.status(400).json({ message, success: false })
    }
    if (req.invalidFileType) {
      return res.status(400).json({ message: 'Formato no permitido. Usá JPG, PNG, WebP o AVIF.', success: false })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Elegí una imagen para subir', success: false })
    }
    next()
  })
}
