import mongoose from 'mongoose';

const studentApplicationSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  category: { type: String, required: true, enum: ['general', 'obc', 'sc', 'st', 'ews'] },
  religion: { type: String, trim: true },
  
  // Contact Information
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  alternatePhone: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  
  // Educational Background
  tenthBoard: { type: String, required: true, trim: true },
  tenthYear: { type: Number, required: true },
  tenthPercentage: { type: Number, required: true },
  twelfthBoard: { type: String, required: true, trim: true },
  twelfthYear: { type: Number, required: true },
  twelfthPercentage: { type: Number, required: true },
  twelfthSubjects: { type: String, required: true, trim: true },
  previousNEETAttempts: { type: String, trim: true },
  previousNEETScore: { type: Number },
  
  // Family & Economic Background
  fatherOccupation: { type: String, required: true, trim: true },
  motherOccupation: { type: String, trim: true },
  familyIncome: { type: String, required: true, enum: ['below-1-lakh', '1-2-lakh', '2-3-lakh', 'above-3-lakh'] },
  numberOfSiblings: { type: Number, default: 0 },
  economicCategory: { type: String, required: true, enum: ['bpl', 'ews', 'tribal', 'minority', 'other'] },
  
  // Motivation & Goals
  whyNEET: { type: String, required: true, trim: true },
  careerGoals: { type: String, required: true, trim: true },
  challenges: { type: String, trim: true },
  howDidYouKnow: { type: String, trim: true, enum: ['social-media', 'friend-family', 'school', 'newspaper', 'website', 'community', 'other'] },
  
  // Documents (Cloudinary URLs)
  documents: {
    profilePhoto: { type: String, required: true },
    tenthMarksheet: { type: String, required: true },
    twelfthMarksheet: { type: String, required: true },
    incomeProof: { type: String, required: true },
    casteProof: { type: String },
    aadhaarCard: { type: String, required: true }
  },
  
  // Application Status
  applicationId: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'under-review', 'shortlisted', 'interview-scheduled', 'selected', 'rejected'], 
    default: 'pending' 
  },
  submissionDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  
  // Review Information
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewDate: { type: Date },
  reviewNotes: { type: String },
  interviewDate: { type: Date },
  finalScore: { type: Number },
  
  // Additional Information
  isEligible: { type: Boolean },
  priorityScore: { type: Number, default: 0 }, // Based on economic need, academic merit, etc.
  centerPreference: { type: String }, // Preferred center location
  batchAssigned: { type: String }, // If selected, which batch
  
}, {
  timestamps: true
});

// Generate application ID before saving
studentApplicationSchema.pre('save', function(next) {
  if (!this.applicationId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.applicationId = `LFU${year}${month}${randomNum}`;
  }
  this.lastUpdated = new Date();
  next();
});

// Calculate priority score based on various factors
studentApplicationSchema.methods.calculatePriorityScore = function() {
  let score = 0;
  
  // Economic need (40 points max)
  if (this.familyIncome === 'below-1-lakh') score += 40;
  else if (this.familyIncome === '1-2-lakh') score += 30;
  else if (this.familyIncome === '2-3-lakh') score += 20;
  else score += 10;
  
  // Category consideration (20 points max)
  if (this.category === 'st') score += 20;
  else if (this.category === 'sc') score += 18;
  else if (this.category === 'obc') score += 15;
  else if (this.category === 'ews') score += 12;
  else score += 10;
  
  // Academic merit (25 points max)
  const avgPercentage = (this.tenthPercentage + this.twelfthPercentage) / 2;
  if (avgPercentage >= 90) score += 25;
  else if (avgPercentage >= 80) score += 20;
  else if (avgPercentage >= 70) score += 15;
  else if (avgPercentage >= 60) score += 10;
  else score += 5;
  
  // Economic category bonus (15 points max)
  if (this.economicCategory === 'bpl') score += 15;
  else if (this.economicCategory === 'tribal') score += 12;
  else if (this.economicCategory === 'ews') score += 10;
  else score += 5;
  
  this.priorityScore = score;
  return score;
};

// Check eligibility based on criteria
studentApplicationSchema.methods.checkEligibility = function() {
  const currentYear = new Date().getFullYear();
  const age = currentYear - new Date(this.dateOfBirth).getFullYear();
  
  // Eligibility criteria
  const isAgeEligible = age >= 17 && age <= 25;
  const isAcademicEligible = this.twelfthPercentage >= 50; // Minimum 50% in 12th
  const isIncomeEligible = this.familyIncome !== 'above-3-lakh' || this.economicCategory === 'tribal';
  
  this.isEligible = isAgeEligible && isAcademicEligible && isIncomeEligible;
  return this.isEligible;
};

// Index for efficient querying
studentApplicationSchema.index({ applicationId: 1 });
studentApplicationSchema.index({ email: 1 });
studentApplicationSchema.index({ status: 1 });
studentApplicationSchema.index({ priorityScore: -1 });
studentApplicationSchema.index({ submissionDate: -1 });

const StudentApplication = mongoose.model('StudentApplication', studentApplicationSchema);

export default StudentApplication;
