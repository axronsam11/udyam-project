import { INDIAN_STATES } from '../constants';

export const validateAadhaar = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar);
};

export const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

export const validateGST = (gst: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
};

export const validateIFSC = (ifsc: string): boolean => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

export const validatePinCode = (pinCode: string): boolean => {
  return /^\d{6}$/.test(pinCode);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateState = (state: string): boolean => {
  return INDIAN_STATES.includes(state);
};

export const validateUdyamNumber = (udyamNumber: string): boolean => {
  return /^UDYAM-\d{2}-\d{2}-\d{7}$/.test(udyamNumber);
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const validateNICCode = (nicCode: string): boolean => {
  // NIC codes are typically 4-5 digit numbers
  return /^\d{4,5}$/.test(nicCode);
};

export const validateAmount = (amount: number): boolean => {
  return amount >= 0 && Number.isFinite(amount);
};

export const validateEmploymentCount = (count: number): boolean => {
  return Number.isInteger(count) && count >= 0;
};
