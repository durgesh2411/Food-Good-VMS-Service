import express from 'express';
import multer from 'multer';
import {
  submitStudentApplication,
  getApplicationStatus,
  getAllApplications,
  updateApplicationStatus,
  getApplicationAnalytics
} from '../Controllers/studentApplication.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import StudentApplication from '../models/studentApplication.model.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed'));
    }
  }
});

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Public routes
// Submit student application
router.post('/apply', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'tenthMarksheet', maxCount: 1 },
  { name: 'twelfthMarksheet', maxCount: 1 },
  { name: 'incomeProof', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 }, // Optional
  { name: 'previousNEETScorecard', maxCount: 1 } // Optional
]), submitStudentApplication);

// Get application status by application ID (public with application ID)
router.get('/status/:applicationId', getApplicationStatus);

// Protected admin routes
// Get all applications (admin only)
router.get('/admin/all', verifyJWT, adminOnly, getAllApplications);

// Update application status (admin only)
router.put('/admin/:applicationId/status', verifyJWT, adminOnly, updateApplicationStatus);

// Get application analytics (admin only)
router.get('/admin/analytics', verifyJWT, adminOnly, getApplicationAnalytics);

// Get single application details (admin only)
router.get('/admin/:applicationId', verifyJWT, adminOnly, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await StudentApplication.findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application details.'
    });
  }
});

// Bulk operations (admin only)
// Update multiple applications status
router.put('/admin/bulk-update', verifyJWT, adminOnly, async (req, res) => {
  try {
    const { applicationIds, status, reviewNotes } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application IDs array is required.'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }

    const result = await StudentApplication.updateMany(
      { applicationId: { $in: applicationIds } },
      { 
        status, 
        reviewNotes,
        reviewedBy: req.user._id,
        reviewDate: new Date()
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} applications updated successfully.`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update applications.'
    });
  }
});

// Export applications data (admin only)
router.get('/admin/export', verifyJWT, adminOnly, async (req, res) => {
  try {
    const { format = 'json', status, category } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const applications = await StudentApplication.find(filter)
      .select('-documents') // Exclude document URLs for export
      .sort({ priorityScore: -1 });

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(applications);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=student_applications.csv');
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: applications,
        exportDate: new Date().toISOString(),
        totalRecords: applications.length
      });
    }

  } catch (error) {
    console.error('Export applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export applications.'
    });
  }
});

// Helper function to convert applications to CSV
function convertToCSV(applications) {
  if (applications.length === 0) return '';

  const headers = [
    'Application ID', 'Full Name', 'Email', 'Phone', 'Category', 'Gender',
    'State', 'City', '10th Percentage', '12th Percentage', 'Economic Category',
    'Father Occupation', 'Family Income', 'Priority Score', 'Status', 'Submission Date'
  ];

  const csvRows = [headers.join(',')];

  applications.forEach(app => {
    const row = [
      app.applicationId,
      `"${app.fullName}"`,
      app.email,
      app.phone,
      app.category,
      app.gender,
      `"${app.state}"`,
      `"${app.city}"`,
      app.tenthPercentage,
      app.twelfthPercentage,
      app.economicCategory,
      `"${app.fatherOccupation}"`,
      app.familyIncome,
      app.priorityScore,
      app.status,
      app.submissionDate.toISOString().split('T')[0]
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum file size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${error.message}`
    });
  }
  
  if (error.message.includes('Only JPEG, JPG, PNG, and PDF files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.'
    });
  }

  next(error);
});

export default router;
