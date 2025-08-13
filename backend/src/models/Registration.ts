import mongoose, { Document, Schema } from 'mongoose';

export interface IEntrepreneur {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'SC' | 'ST' | 'OBC';
  physicallyHandicapped: boolean;
  aadhaarNumber: string;
  panNumber: string;
}

export interface IEnterprise {
  name: string;
  type: 'Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited' | 'Public Limited' | 'Others';
  commencementDate: Date;
  panNumber?: string;
  gstNumber?: string;
  previousRegistrationNumber?: string;
}

export interface ILocation {
  plantAddress: {
    flatNo?: string;
    buildingName?: string;
    roadStreet: string;
    block?: string;
    state: string;
    district: string;
    pinCode: string;
  };
  officeAddress: {
    flatNo?: string;
    buildingName?: string;
    roadStreet: string;
    block?: string;
    state: string;
    district: string;
    pinCode: string;
  };
  sameAsPlant: boolean;
}

export interface IBankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface IActivity {
  nicCode: string;
  description: string;
  isPrimary: boolean;
}

export interface IInvestment {
  plantMachinery: number;
  landBuilding: number;
  totalInvestment: number;
  previousYear?: {
    plantMachinery: number;
    landBuilding: number;
    totalInvestment: number;
  };
}

export interface ITurnover {
  currentYear: number;
  previousYear?: number;
}

export interface IEmployment {
  male: number;
  female: number;
  others: number;
  total: number;
}

export interface IRegistration extends Document {
  // Basic Information
  entrepreneur: IEntrepreneur;
  enterprise: IEnterprise;
  
  // Location Details
  location: ILocation;
  
  // Bank Details
  bankDetails: IBankDetails;
  
  // Business Activities
  activities: IActivity[];
  
  // Investment Details
  investment: IInvestment;
  
  // Turnover Details
  turnover: ITurnover;
  
  // Employment Details
  employment: IEmployment;
  
  // Documents
  documents: {
    aadhaarCard?: string;
    panCard?: string;
    bankStatement?: string;
    businessProof?: string;
    others?: string[];
  };
  
  // Registration Status
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  udyamNumber?: string;
  
  // Timestamps
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  
  // Additional fields
  remarks?: string;
  reviewedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  entrepreneur: {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    category: { type: String, enum: ['General', 'SC', 'ST', 'OBC'], required: true },
    physicallyHandicapped: { type: Boolean, default: false },
    aadhaarNumber: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(v: string) {
          return /^\d{12}$/.test(v);
        },
        message: 'Aadhaar number must be 12 digits'
      }
    },
    panNumber: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: 'Invalid PAN number format'
      }
    }
  },
  
  enterprise: {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Others'], 
      required: true 
    },
    commencementDate: { type: Date, required: true },
    panNumber: { 
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: 'Invalid PAN number format'
      }
    },
    gstNumber: { 
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: 'Invalid GST number format'
      }
    },
    previousRegistrationNumber: String
  },
  
  location: {
    plantAddress: {
      flatNo: String,
      buildingName: String,
      roadStreet: { type: String, required: true },
      block: String,
      state: { type: String, required: true },
      district: { type: String, required: true },
      pinCode: { 
        type: String, 
        required: true,
        validate: {
          validator: function(v: string) {
            return /^\d{6}$/.test(v);
          },
          message: 'PIN code must be 6 digits'
        }
      }
    },
    officeAddress: {
      flatNo: String,
      buildingName: String,
      roadStreet: { type: String, required: true },
      block: String,
      state: { type: String, required: true },
      district: { type: String, required: true },
      pinCode: { 
        type: String, 
        required: true,
        validate: {
          validator: function(v: string) {
            return /^\d{6}$/.test(v);
          },
          message: 'PIN code must be 6 digits'
        }
      }
    },
    sameAsPlant: { type: Boolean, default: false }
  },
  
  bankDetails: {
    accountNumber: { type: String, required: true },
    ifscCode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string) {
          return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
        },
        message: 'Invalid IFSC code format'
      }
    },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true }
  },
  
  activities: [{
    nicCode: { type: String, required: true },
    description: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  
  investment: {
    plantMachinery: { type: Number, required: true, min: 0 },
    landBuilding: { type: Number, required: true, min: 0 },
    totalInvestment: { type: Number, required: true, min: 0 },
    previousYear: {
      plantMachinery: { type: Number, min: 0 },
      landBuilding: { type: Number, min: 0 },
      totalInvestment: { type: Number, min: 0 }
    }
  },
  
  turnover: {
    currentYear: { type: Number, required: true, min: 0 },
    previousYear: { type: Number, min: 0 }
  },
  
  employment: {
    male: { type: Number, required: true, min: 0 },
    female: { type: Number, required: true, min: 0 },
    others: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  
  documents: {
    aadhaarCard: String,
    panCard: String,
    bankStatement: String,
    businessProof: String,
    others: [String]
  },
  
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'], 
    default: 'draft' 
  },
  udyamNumber: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  
  submittedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  
  remarks: String,
  reviewedBy: String
}, {
  timestamps: true
});

// Indexes for better performance
RegistrationSchema.index({ 'entrepreneur.aadhaarNumber': 1 });
RegistrationSchema.index({ 'entrepreneur.panNumber': 1 });
RegistrationSchema.index({ udyamNumber: 1 });
RegistrationSchema.index({ status: 1 });
RegistrationSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total employment
RegistrationSchema.pre('save', function(next) {
  if (this.employment && typeof this.employment === 'object') {
    const employment = this.employment as IEmployment;
    employment.total = employment.male + employment.female + employment.others;
  }
  next();
});

// Pre-save middleware to calculate total investment
RegistrationSchema.pre('save', function(next) {
  if (this.investment && typeof this.investment === 'object') {
    const investment = this.investment as IInvestment;
    investment.totalInvestment = investment.plantMachinery + investment.landBuilding;
  }
  next();
});

export default mongoose.model<IRegistration>('Registration', RegistrationSchema);
