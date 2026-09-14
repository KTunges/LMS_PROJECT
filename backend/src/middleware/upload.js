const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY;

// Storage configuration (Disk fallback)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Storage configuration (Cloudinary)
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource_type based on mimetype
    let resource_type = 'auto';
    if (file.mimetype.startsWith('video/')) {
      resource_type = 'video';
    } else if (file.mimetype.startsWith('image/')) {
      resource_type = 'image';
    } else {
      resource_type = 'raw'; // for pdfs, docs, zips
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '');

    return {
      folder: 'lms-uploads',
      resource_type: resource_type,
      public_id: `${file.fieldname}-${originalName}-${uniqueSuffix}`,
    };
  },
});

const storage = useCloudinary ? cloudinaryStorage : diskStorage;

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
    'audio/mpeg',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/zip',
    'application/x-rar-compressed',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng file không được hỗ trợ'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 104857600, // 100MB limit for videos
  },
});

module.exports = upload;
