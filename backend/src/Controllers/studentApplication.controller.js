import StudentApplication from '../models/studentApplication.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import nodemailer from 'nodemailer';

// Create email transporter (using existing email config if available)
const createEmailTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

// Submit student application
export const submitStudentApplication = async (req, res) => {
  try {
    const {
      fullName, fatherName, motherName, dateOfBirth, gender, category, religion,
      email, phone, alternatePhone, address, city, state, pincode,
      tenthBoard, tenthYear, tenthPercentage, twelfthBoard, twelfthYear, 
      twelfthPercentage, twelfthSubjects, previousNEETAttempts, previousNEETScore,
      fatherOccupation, motherOccupation, familyIncome, numberOfSiblings, economicCategory,
      whyNEET, careerGoals, challenges, howDidYouKnow
    } = req.body;

    // Check if application already exists with same email
    const existingApplication = await StudentApplication.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists. Each student can apply only once.'
      });
    }

    // Validate required fields
    const requiredFields = [
      'fullName', 'fatherName', 'dateOfBirth', 'gender', 'category',
      'email', 'phone', 'address', 'city', 'state', 'pincode',
      'tenthBoard', 'tenthYear', 'tenthPercentage', 'twelfthBoard', 
      'twelfthYear', 'twelfthPercentage', 'twelfthSubjects',
      'fatherOccupation', 'familyIncome', 'economicCategory',
      'whyNEET', 'careerGoals'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate file uploads
    const requiredDocuments = ['profilePhoto', 'tenthMarksheet', 'twelfthMarksheet', 'incomeProof', 'aadhaarCard'];
    const missingDocuments = requiredDocuments.filter(doc => !req.files || !req.files[doc]);
    
    if (missingDocuments.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required documents: ${missingDocuments.join(', ')}`
      });
    }

    // Upload documents to Cloudinary
    const documentUrls = {};
    try {
      for (const docType of Object.keys(req.files)) {
        if (req.files[docType] && req.files[docType][0]) {
          const file = req.files[docType][0];
          const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname);
          documentUrls[docType] = cloudinaryResult.secure_url;
        }
      }
    } catch (uploadError) {
      console.error('Document upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload documents. Please try again.'
      });
    }

    // Create student application
    const studentApplication = new StudentApplication({
      fullName, fatherName, motherName, dateOfBirth, gender, category, religion,
      email, phone, alternatePhone, address, city, state, pincode,
      tenthBoard, tenthYear: parseInt(tenthYear), tenthPercentage: parseFloat(tenthPercentage),
      twelfthBoard, twelfthYear: parseInt(twelfthYear), twelfthPercentage: parseFloat(twelfthPercentage),
      twelfthSubjects, previousNEETAttempts, previousNEETScore: previousNEETScore ? parseInt(previousNEETScore) : undefined,
      fatherOccupation, motherOccupation, familyIncome, 
      numberOfSiblings: numberOfSiblings ? parseInt(numberOfSiblings) : 0, 
      economicCategory, whyNEET, careerGoals, challenges, howDidYouKnow,
      documents: documentUrls
    });

    // Calculate priority score and check eligibility
    studentApplication.calculatePriorityScore();
    studentApplication.checkEligibility();

    // Save application
    await studentApplication.save();

    // Send confirmation email to student
    try {
      const transporter = createEmailTransporter();
      if (transporter) {
        const mailOptions = {
          from: process.env.EMAIL_USER || 'noreply@liftforupliftment.org',
          to: email,
          subject: 'Application Received - Lift for Upliftment NEET Preparation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                <h1>Lift for Upliftment</h1>
                <p>NEET Preparation Program</p>
              </div>
              
              <div style="padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Dear ${fullName},</h2>
                
                <p style="color: #666; line-height: 1.6;">
                  Thank you for submitting your application for our Free NEET Preparation Program. 
                  We have successfully received your application with the following details:
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #667eea; margin-top: 0;">Application Details:</h3>
                  <p><strong>Application ID:</strong> ${studentApplication.applicationId}</p>
                  <p><strong>Name:</strong> ${fullName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Current Status:</strong> Pending Review</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #1976d2; margin-top: 0;">What's Next?</h4>
                  <ul style="color: #666; line-height: 1.6;">
                    <li>Our admission team will review your application within 7 working days</li>
                    <li>Eligible candidates will be contacted for document verification</li>
                    <li>Shortlisted students will be invited for a personal interview</li>
                    <li>Final selection results will be communicated via email and phone</li>
                  </ul>
                </div>
                
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #f57c00; margin-top: 0;">Important Notes:</h4>
                  <ul style="color: #666; line-height: 1.6;">
                    <li>Keep your application ID safe for future reference</li>
                    <li>Ensure your phone is reachable during the review period</li>
                    <li>Keep original documents ready for verification</li>
                    <li>Any false information may lead to disqualification</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <h3 style="color: #333;">Contact Information</h3>
                  <p style="color: #666;">
                    📞 Phone: +91-20-2612-XXXX<br>
                    📧 Email: admissions@liftforupliftment.org<br>
                    📍 Address: Camp Area, Opposite SBI Treasury Branch, Pune - 411001
                  </p>
                </div>
                
                <div style="text-align: center; background: #667eea; color: white; padding: 20px; border-radius: 8px;">
                  <h3 style="margin-top: 0;">Your Dream Awaits!</h3>
                  <p style="margin-bottom: 0;">
                    "Success in NEET comes from consistent preparation and having the right support. 
                    We're here to guide you on your journey to becoming a doctor!"
                  </p>
                </div>
              </div>
              
              <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                <p>© 2024 Lift for Upliftment. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this email.</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the application if email fails
    }

    // Send notification to admin (if admin email is configured)
    try {
      const transporter = createEmailTransporter();
      if (transporter && process.env.ADMIN_EMAIL) {
        const adminMailOptions = {
          from: process.env.EMAIL_USER || 'noreply@liftforupliftment.org',
          to: process.env.ADMIN_EMAIL,
          subject: 'New Student Application Received - Lift for Upliftment',
          html: `
            <h2>New Student Application Received</h2>
            <p><strong>Application ID:</strong> ${studentApplication.applicationId}</p>
            <p><strong>Student Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Economic Category:</strong> ${economicCategory}</p>
            <p><strong>12th Percentage:</strong> ${twelfthPercentage}%</p>
            <p><strong>Priority Score:</strong> ${studentApplication.priorityScore}</p>
            <p><strong>Eligible:</strong> ${studentApplication.isEligible ? 'Yes' : 'No'}</p>
            <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
            <p>Please review the application in the admin dashboard.</p>
          `
        };

        await transporter.sendMail(adminMailOptions);
      }
    } catch (adminEmailError) {
      console.error('Admin email error:', adminEmailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! You will receive a confirmation email shortly.',
      data: {
        applicationId: studentApplication.applicationId,
        status: studentApplication.status,
        submissionDate: studentApplication.submissionDate,
        isEligible: studentApplication.isEligible,
        priorityScore: studentApplication.priorityScore
      }
    });

  } catch (error) {
    console.error('Student application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get application status by application ID
export const getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await StudentApplication.findOne({ applicationId })
      .select('applicationId fullName email status submissionDate lastUpdated reviewNotes interviewDate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found. Please check your application ID.'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application status.'
    });
  }
};

// Get all applications (Admin only - will be protected by auth middleware)
export const getAllApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      economicCategory, 
      sortBy = 'priorityScore',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (economicCategory) filter.economicCategory = economicCategory;

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const applications = await StudentApplication.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-documents'); // Exclude documents for list view

    const total = await StudentApplication.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications.'
    });
  }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNotes, interviewDate } = req.body;

    const application = await StudentApplication.findOneAndUpdate(
      { applicationId },
      { 
        status, 
        reviewNotes, 
        interviewDate,
        reviewedBy: req.user._id, // Assuming user is set by auth middleware
        reviewDate: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.'
      });
    }

    // Send status update email to student
    try {
      const transporter = createEmailTransporter();
      if (transporter) {
        let emailContent = '';
        
        switch (status) {
          case 'under-review':
            emailContent = 'Your application is currently under review by our admission team.';
            break;
          case 'shortlisted':
            emailContent = 'Congratulations! Your application has been shortlisted. Our team will contact you soon for the next steps.';
            break;
          case 'interview-scheduled':
            emailContent = `Your interview has been scheduled for ${new Date(interviewDate).toLocaleDateString()}. Please be prepared with all original documents.`;
            break;
          case 'selected':
            emailContent = 'Congratulations! You have been selected for our NEET Preparation Program. Welcome to Lift for Upliftment family!';
            break;
          case 'rejected':
            emailContent = 'Thank you for your interest. Unfortunately, your application was not selected this time. We encourage you to apply again next year.';
            break;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER || 'noreply@liftforupliftment.org',
          to: application.email,
          subject: `Application Status Update - ${application.applicationId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Application Status Update</h2>
              <p>Dear ${application.fullName},</p>
              <p><strong>Application ID:</strong> ${application.applicationId}</p>
              <p><strong>Status:</strong> ${status.toUpperCase()}</p>
              <p>${emailContent}</p>
              ${reviewNotes ? `<p><strong>Additional Notes:</strong> ${reviewNotes}</p>` : ''}
              <p>For any queries, contact us at admissions@liftforupliftment.org</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Status update email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Application status updated successfully.',
      data: application
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status.'
    });
  }
};

// Get application analytics (Admin only)
export const getApplicationAnalytics = async (req, res) => {
  try {
    const totalApplications = await StudentApplication.countDocuments();
    const pendingApplications = await StudentApplication.countDocuments({ status: 'pending' });
    const selectedApplications = await StudentApplication.countDocuments({ status: 'selected' });
    const rejectedApplications = await StudentApplication.countDocuments({ status: 'rejected' });

    const categoryStats = await StudentApplication.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const economicCategoryStats = await StudentApplication.aggregate([
      { $group: { _id: '$economicCategory', count: { $sum: 1 } } }
    ]);

    const stateStats = await StudentApplication.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const avgScores = await StudentApplication.aggregate([
      {
        $group: {
          _id: null,
          avgTenthPercentage: { $avg: '$tenthPercentage' },
          avgTwelfthPercentage: { $avg: '$twelfthPercentage' },
          avgPriorityScore: { $avg: '$priorityScore' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total: totalApplications,
          pending: pendingApplications,
          selected: selectedApplications,
          rejected: rejectedApplications,
          selectionRate: totalApplications > 0 ? ((selectedApplications / totalApplications) * 100).toFixed(2) : 0
        },
        categoryStats,
        economicCategoryStats,
        stateStats,
        averageScores: avgScores[0] || {}
      }
    });

  } catch (error) {
    console.error('Get application analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application analytics.'
    });
  }
};
