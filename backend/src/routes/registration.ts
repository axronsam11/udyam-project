import express from 'express';
import { body, validationResult } from 'express-validator';
import Registration from '../models/Registration';
import { logger } from '../utils/logger';
import { generateUdyamNumber } from '../utils/udyamGenerator';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('entrepreneur.name').notEmpty().trim().withMessage('Entrepreneur name is required'),
  body('entrepreneur.gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('entrepreneur.category').isIn(['General', 'SC', 'ST', 'OBC']).withMessage('Invalid category'),
  body('entrepreneur.aadhaarNumber').matches(/^\d{12}$/).withMessage('Aadhaar number must be 12 digits'),
  body('entrepreneur.panNumber').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN number format'),
  body('enterprise.name').notEmpty().trim().withMessage('Enterprise name is required'),
  body('enterprise.type').isIn(['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Others']).withMessage('Invalid enterprise type'),
  body('enterprise.commencementDate').isISO8601().withMessage('Invalid commencement date'),
  body('location.plantAddress.roadStreet').notEmpty().withMessage('Plant address road/street is required'),
  body('location.plantAddress.state').notEmpty().withMessage('Plant address state is required'),
  body('location.plantAddress.district').notEmpty().withMessage('Plant address district is required'),
  body('location.plantAddress.pinCode').matches(/^\d{6}$/).withMessage('PIN code must be 6 digits'),
  body('bankDetails.accountNumber').notEmpty().withMessage('Bank account number is required'),
  body('bankDetails.ifscCode').matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage('Invalid IFSC code format'),
  body('bankDetails.bankName').notEmpty().withMessage('Bank name is required'),
  body('bankDetails.branchName').notEmpty().withMessage('Branch name is required'),
  body('investment.plantMachinery').isNumeric().isFloat({ min: 0 }).withMessage('Plant machinery investment must be a positive number'),
  body('investment.landBuilding').isNumeric().isFloat({ min: 0 }).withMessage('Land building investment must be a positive number'),
  body('turnover.currentYear').isNumeric().isFloat({ min: 0 }).withMessage('Current year turnover must be a positive number'),
  body('employment.male').isInt({ min: 0 }).withMessage('Male employment must be a non-negative integer'),
  body('employment.female').isInt({ min: 0 }).withMessage('Female employment must be a non-negative integer'),
  body('employment.others').isInt({ min: 0 }).withMessage('Others employment must be a non-negative integer'),
];

// GET /api/registration - Get all registrations (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .select('-documents') // Exclude document URLs for list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/registration/:id - Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    logger.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/registration - Create new registration
router.post('/', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if Aadhaar number already exists
    const existingAadhaar = await Registration.findOne({
      'entrepreneur.aadhaarNumber': req.body.entrepreneur.aadhaarNumber
    });

    if (existingAadhaar) {
      return res.status(400).json({
        success: false,
        message: 'Registration with this Aadhaar number already exists'
      });
    }

    // Check if PAN number already exists
    const existingPAN = await Registration.findOne({
      'entrepreneur.panNumber': req.body.entrepreneur.panNumber
    });

    if (existingPAN) {
      return res.status(400).json({
        success: false,
        message: 'Registration with this PAN number already exists'
      });
    }

    const registration = new Registration(req.body);
    await registration.save();

    logger.info(`New registration created: ${registration._id}`);

    res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      data: registration
    });
  } catch (error) {
    logger.error('Error creating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/registration/:id - Update registration
router.put('/:id', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Don't allow updates if already submitted
    if (registration.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update registration that has been submitted'
      });
    }

    Object.assign(registration, req.body);
    await registration.save();

    logger.info(`Registration updated: ${registration._id}`);

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: registration
    });
  } catch (error) {
    logger.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/registration/:id/submit - Submit registration for review
router.post('/:id/submit', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Registration has already been submitted'
      });
    }

    registration.status = 'submitted';
    registration.submittedAt = new Date();
    await registration.save();

    logger.info(`Registration submitted: ${registration._id}`);

    res.json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    logger.error('Error submitting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/registration/:id/approve - Approve registration (admin only)
router.post('/:id/approve', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'submitted' && registration.status !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: 'Registration cannot be approved in current status'
      });
    }

    registration.status = 'approved';
    registration.approvedAt = new Date();
    registration.udyamNumber = generateUdyamNumber();
    registration.reviewedBy = req.body.reviewedBy || 'System';
    await registration.save();

    logger.info(`Registration approved: ${registration._id}, Udyam Number: ${registration.udyamNumber}`);

    res.json({
      success: true,
      message: 'Registration approved successfully',
      data: registration
    });
  } catch (error) {
    logger.error('Error approving registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/registration/:id/reject - Reject registration (admin only)
router.post('/:id/reject', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'submitted' && registration.status !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: 'Registration cannot be rejected in current status'
      });
    }

    registration.status = 'rejected';
    registration.rejectedAt = new Date();
    registration.remarks = req.body.remarks || 'Registration rejected';
    registration.reviewedBy = req.body.reviewedBy || 'System';
    await registration.save();

    logger.info(`Registration rejected: ${registration._id}`);

    res.json({
      success: true,
      message: 'Registration rejected successfully',
      data: registration
    });
  } catch (error) {
    logger.error('Error rejecting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/registration/udyam/:udyamNumber - Get registration by Udyam number
router.get('/udyam/:udyamNumber', async (req, res) => {
  try {
    const registration = await Registration.findOne({
      udyamNumber: req.params.udyamNumber
    });
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    logger.error('Error fetching registration by Udyam number:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/registration/:id - Delete registration (only drafts)
router.delete('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete registration that has been submitted'
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    logger.info(`Registration deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
