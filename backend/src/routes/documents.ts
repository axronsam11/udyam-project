import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';
import Registration from '../models/Registration';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  },
});

// POST /api/documents/upload/:registrationId - Upload document
router.post('/upload/:registrationId', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { registrationId } = req.params;
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      });
    }

    // Check if registration exists
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `udyam-registration/${registrationId}`,
          public_id: `${documentType}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    const result = uploadResult as any;

    // Update registration with document URL
    const updateField = `documents.${documentType}`;
    await Registration.findByIdAndUpdate(
      registrationId,
      { [updateField]: result.secure_url },
      { new: true }
    );

    logger.info(`Document uploaded for registration ${registrationId}: ${documentType}`);

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentType,
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    logger.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    });
  }
});

// POST /api/documents/upload-multiple/:registrationId - Upload multiple documents
router.post('/upload-multiple/:registrationId', upload.array('documents', 5), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { registrationId } = req.params;
    const { documentTypes } = req.body;

    if (!documentTypes || !Array.isArray(documentTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Document types array is required'
      });
    }

    if (req.files.length !== documentTypes.length) {
      return res.status(400).json({
        success: false,
        message: 'Number of files must match number of document types'
      });
    }

    // Check if registration exists
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const uploadPromises = req.files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: `udyam-registration/${registrationId}`,
            public_id: `${documentTypes[index]}_${Date.now()}_${index}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({ documentType: documentTypes[index], result });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    
    // Update registration with document URLs
    const updateFields: any = {};
    const responseData: any[] = [];

    uploadResults.forEach((upload: any) => {
      const { documentType, result } = upload;
      updateFields[`documents.${documentType}`] = result.secure_url;
      responseData.push({
        documentType,
        url: result.secure_url,
        publicId: result.public_id
      });
    });

    await Registration.findByIdAndUpdate(registrationId, updateFields, { new: true });

    logger.info(`Multiple documents uploaded for registration ${registrationId}`);

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: responseData
    });
  } catch (error) {
    logger.error('Error uploading multiple documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents'
    });
  }
});

// GET /api/documents/:registrationId - Get all documents for a registration
router.get('/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await Registration.findById(registrationId).select('documents');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration.documents
    });
  } catch (error) {
    logger.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
});

// DELETE /api/documents/:registrationId/:documentType - Delete a specific document
router.delete('/:registrationId/:documentType', async (req, res) => {
  try {
    const { registrationId, documentType } = req.params;

    const registration = await Registration.findById(registrationId);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Get the document URL to extract public_id for Cloudinary deletion
    const documentUrl = (registration.documents as any)[documentType];
    
    if (!documentUrl) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Extract public_id from Cloudinary URL
    const publicId = documentUrl.split('/').slice(-2).join('/').split('.')[0];

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      logger.warn('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with database update even if Cloudinary deletion fails
    }

    // Remove document reference from database
    const updateField = `documents.${documentType}`;
    await Registration.findByIdAndUpdate(
      registrationId,
      { $unset: { [updateField]: 1 } },
      { new: true }
    );

    logger.info(`Document deleted for registration ${registrationId}: ${documentType}`);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
});

// GET /api/documents/download/:registrationId/:documentType - Get document download URL
router.get('/download/:registrationId/:documentType', async (req, res) => {
  try {
    const { registrationId, documentType } = req.params;

    const registration = await Registration.findById(registrationId).select('documents');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const documentUrl = (registration.documents as any)[documentType];
    
    if (!documentUrl) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: {
        documentType,
        downloadUrl: documentUrl
      }
    });
  } catch (error) {
    logger.error('Error getting document download URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get document download URL'
    });
  }
});

export default router;
