export const REGISTRATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const ENTERPRISE_TYPES = {
  PROPRIETORSHIP: 'Proprietorship',
  PARTNERSHIP: 'Partnership',
  LLP: 'LLP',
  PRIVATE_LIMITED: 'Private Limited',
  PUBLIC_LIMITED: 'Public Limited',
  OTHERS: 'Others'
} as const;

export const GENDER_TYPES = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
} as const;

export const CATEGORY_TYPES = {
  GENERAL: 'General',
  SC: 'SC',
  ST: 'ST',
  OBC: 'OBC'
} as const;

export const DOCUMENT_TYPES = {
  AADHAAR_CARD: 'aadhaarCard',
  PAN_CARD: 'panCard',
  BANK_STATEMENT: 'bankStatement',
  BUSINESS_PROOF: 'businessProof',
  OTHERS: 'others'
} as const;

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const MSME_CLASSIFICATION = {
  MICRO: {
    MANUFACTURING: {
      INVESTMENT_LIMIT: 10000000, // 1 Crore
      TURNOVER_LIMIT: 50000000   // 5 Crore
    },
    SERVICE: {
      INVESTMENT_LIMIT: 10000000, // 1 Crore
      TURNOVER_LIMIT: 50000000   // 5 Crore
    }
  },
  SMALL: {
    MANUFACTURING: {
      INVESTMENT_LIMIT: 100000000, // 10 Crore
      TURNOVER_LIMIT: 500000000   // 50 Crore
    },
    SERVICE: {
      INVESTMENT_LIMIT: 100000000, // 10 Crore
      TURNOVER_LIMIT: 500000000   // 50 Crore
    }
  },
  MEDIUM: {
    MANUFACTURING: {
      INVESTMENT_LIMIT: 500000000, // 50 Crore
      TURNOVER_LIMIT: 2500000000  // 250 Crore
    },
    SERVICE: {
      INVESTMENT_LIMIT: 500000000, // 50 Crore
      TURNOVER_LIMIT: 2500000000  // 250 Crore
    }
  }
};
