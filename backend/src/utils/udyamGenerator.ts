/**
 * Generate a unique Udyam Registration Number
 * Format: UDYAM-XX-00-0000000
 * Where:
 * - XX: State code (2 digits)
 * - 00: District code (2 digits) 
 * - 0000000: Sequential number (7 digits)
 */
export const generateUdyamNumber = (): string => {
  // For demo purposes, using random state and district codes
  const stateCode = Math.floor(Math.random() * 36) + 1; // 1-36 (Indian states/UTs)
  const districtCode = Math.floor(Math.random() * 99) + 1; // 1-99
  const sequentialNumber = Math.floor(Math.random() * 9999999) + 1; // 1-9999999

  const formattedStateCode = stateCode.toString().padStart(2, '0');
  const formattedDistrictCode = districtCode.toString().padStart(2, '0');
  const formattedSequentialNumber = sequentialNumber.toString().padStart(7, '0');

  return `UDYAM-${formattedStateCode}-${formattedDistrictCode}-${formattedSequentialNumber}`;
};

/**
 * Validate Udyam Registration Number format
 */
export const validateUdyamNumber = (udyamNumber: string): boolean => {
  const udyamRegex = /^UDYAM-\d{2}-\d{2}-\d{7}$/;
  return udyamRegex.test(udyamNumber);
};

/**
 * Extract components from Udyam Registration Number
 */
export const parseUdyamNumber = (udyamNumber: string) => {
  if (!validateUdyamNumber(udyamNumber)) {
    throw new Error('Invalid Udyam Registration Number format');
  }

  const parts = udyamNumber.split('-');
  return {
    prefix: parts[0], // UDYAM
    stateCode: parts[1],
    districtCode: parts[2],
    sequentialNumber: parts[3]
  };
};
