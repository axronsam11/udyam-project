import { z } from "zod";

// Validation patterns
const patterns = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  aadhaar: /^[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}$/, // More flexible Aadhaar pattern
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  phone: /^[6-9][0-9]{9}$/,
  pincode: /^[1-9][0-9]{5}$/
};

const errorMessages = {
  pan: "PAN must be in format ABCDE1234F (5 letters, 4 digits, 1 letter)",
  aadhaar: "Aadhaar must be 12 digits (with or without dashes/spaces)",
  gstin: "GST number must be in correct 15-character format",
  ifsc: "IFSC must be in format BANK0123456 (4 letters, 1 zero, 6 alphanumeric)",
  phone: "Mobile number must be 10 digits starting with 6, 7, 8, or 9",
  pincode: "PIN code must be 6 digits and cannot start with 0"
};

export function generateZodSchema(step: any): z.ZodSchema {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  step.fields.forEach((field: any) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "string":
        fieldSchema = z.string();
        
        if (field.format && patterns[field.format as keyof typeof patterns]) {
          const pattern = patterns[field.format as keyof typeof patterns];
          const message = errorMessages[field.format as keyof typeof errorMessages];
          
          // Special handling for Aadhaar to clean input before validation
          if (field.format === "aadhaar") {
            fieldSchema = fieldSchema.refine((val) => {
              if (typeof val !== 'string') return false;
              const cleaned = val.replace(/[-\s]/g, '');
              return /^[0-9]{12}$/.test(cleaned);
            }, message);
          } else {
            fieldSchema = (fieldSchema as any).regex(pattern, message);
          }
        }
        
        if (field.format === "email") {
          fieldSchema = z.string().email("Please enter a valid email address");
        }
        
        if (field.minLength) {
          fieldSchema = (fieldSchema as any).min(field.minLength, `Minimum ${field.minLength} characters required`);
        }
        
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as any).min(field.min);
        }
        
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as any).max(field.max);
        }
        
        break;

      case "number":
        fieldSchema = z.number();
        
        if (field.min !== undefined) {
          fieldSchema = (fieldSchema as any).min(field.min);
        }
        
        if (field.max !== undefined) {
          fieldSchema = (fieldSchema as any).max(field.max);
        }
        break;

      case "boolean":
        fieldSchema = z.boolean();
        break;

      case "array":
        fieldSchema = z.array(z.string()).min(1, "Please select at least one option");
        break;

      case "date":
        fieldSchema = z.string().refine((val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        }, "Please select a valid date");
        
        // Past date validation for DOB
        if (field.name === "dateOfBirth") {
          fieldSchema = fieldSchema.refine((val) => {
            const date = new Date(val as string);
            return date < new Date();
          }, "Date of birth must be in the past");
        }
        
        break;

      case "file":
        fieldSchema = z.any(); // File validation handled by FileInput component
        break;

      default:
        fieldSchema = z.string();
    }

    // Make field optional if not required
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    } else {
      // Add required message for strings
      if (field.type === "string") {
        fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
      }
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
}