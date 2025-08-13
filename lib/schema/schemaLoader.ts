export async function loadFormSchema() {
  // In a real application, this would fetch from an API
  // For demo, we'll return a comprehensive mock schema
  return {
    title: "Udyam Registration Form",
    version: "1.0",
    steps: [
      {
        id: "applicant-details",
        title: "Applicant Details", 
        description: "Enter entrepreneur and business owner information",
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "string",
            required: true,
            placeholder: "Enter full name as per Aadhaar",
            example: "Rajesh Kumar Sharma",
            description: "Enter your full name exactly as it appears on your Aadhaar card",
            defaultValue: "Rajesh Kumar Sharma"
          },
          {
            name: "panNumber",
            label: "PAN Number",
            type: "string",
            format: "pan",
            required: true,
            placeholder: "ABCDE1234F",
            example: "ABCDE1234F",
            description: "Enter your 10-digit PAN (Permanent Account Number)",
            defaultValue: "ABCDE1234F"
          },
          {
            name: "aadhaarNumber",
            label: "Aadhaar Number",
            type: "string",
            format: "aadhaar",
            required: true,
            placeholder: "1234-5678-9012",
            example: "1234-5678-9012",
            description: "Enter your 12-digit Aadhaar number",
            defaultValue: "1234-5678-9012"
          },
          {
            name: "email",
            label: "Email Address",
            type: "string",
            format: "email",
            required: true,
            placeholder: "rajesh@example.com",
            description: "Enter a valid email address for communication",
            defaultValue: "rajesh@example.com"
          },
          {
            name: "mobileNumber", 
            label: "Mobile Number",
            type: "string",
            format: "phone",
            required: true,
            placeholder: "9876543210",
            example: "9876543210",
            description: "Enter your 10-digit mobile number",
            defaultValue: "9876543210"
          },
          {
            name: "dateOfBirth",
            label: "Date of Birth",
            type: "date",
            required: true,
            description: "Enter your date of birth as per Aadhaar",
            defaultValue: "1990-01-01"
          }
        ]
      },
      {
        id: "enterprise-details",
        title: "Enterprise Details",
        description: "Provide information about your business/enterprise",
        fields: [
          {
            name: "enterpriseName",
            label: "Enterprise Name",
            type: "string",
            required: true,
            placeholder: "ABC Manufacturing Pvt Ltd",
            description: "Enter the official name of your enterprise"
          },
          {
            name: "enterpriseType",
            label: "Enterprise Type",
            type: "string",
            required: true,
            enum: [
              { value: "proprietorship", label: "Proprietorship" },
              { value: "partnership", label: "Partnership" },
              { value: "llp", label: "Limited Liability Partnership (LLP)" },
              { value: "pvt_ltd", label: "Private Limited Company" },
              { value: "public_ltd", label: "Public Limited Company" },
              { value: "society", label: "Society" },
              { value: "trust", label: "Trust" },
              { value: "cooperative", label: "Cooperative Society" }
            ],
            description: "Select the legal structure of your enterprise"
          },
          {
            name: "commencementDate",
            label: "Date of Commencement",
            type: "date",
            required: true,
            description: "Enter the date when your business operations started"
          },
          {
            name: "gstNumber",
            label: "GST Number",
            type: "string",
            format: "gstin",
            required: false,
            placeholder: "22ABCDE1234F1Z5",
            example: "22ABCDE1234F1Z5",
            description: "Enter GST number if registered (optional)"
          },
          {
            name: "hasEmployees",
            label: "Do you have employees?",
            type: "boolean",
            widget: "switch",
            required: true,
            description: "Indicate if your enterprise has employees"
          },
          {
            name: "employeeCount",
            label: "Number of Employees",
            type: "number",
            required: false,
            visibleWhen: {
              field: "hasEmployees",
              value: true
            },
            description: "Enter total number of employees including yourself"
          }
        ]
      },
      {
        id: "location-details",
        title: "Location Details",
        description: "Enter address and location information", 
        fields: [
          {
            name: "pinCode",
            label: "PIN Code",
            type: "string",
            format: "pincode",
            required: true,
            placeholder: "110001",
            example: "110001",
            description: "Enter 6-digit PIN code of your business location"
          },
          {
            name: "state",
            label: "State",
            type: "string",
            required: true,
            placeholder: "Will be auto-filled based on PIN",
            description: "State will be automatically populated based on PIN code"
          },
          {
            name: "district",
            label: "District",
            type: "string", 
            required: true,
            placeholder: "Will be auto-filled based on PIN",
            description: "District will be automatically populated based on PIN code"
          },
          {
            name: "address",
            label: "Complete Address",
            type: "string",
            multiline: true,
            required: true,
            fullWidth: true,
            placeholder: "Enter complete address including building/plot number, street, locality",
            description: "Provide complete address of your business location"
          },
          {
            name: "sameAsOwner",
            label: "Business address same as owner's address",
            type: "boolean",
            required: false,
            description: "Check if business address is same as owner's address"
          }
        ]
      },
      {
        id: "bank-investment",
        title: "Bank & Investment Details", 
        description: "Provide banking information and investment details",
        fields: [
          {
            name: "ifscCode",
            label: "Bank IFSC Code",
            type: "string",
            format: "ifsc",
            required: true,
            placeholder: "SBIN0000001",
            example: "SBIN0000001",
            description: "Enter 11-character IFSC code of your bank",
            defaultValue: "SBIN0000001"
          },
          {
            name: "bankName",
            label: "Bank Name",
            type: "string",
            required: true,
            placeholder: "Will be auto-filled based on IFSC",
            description: "Bank name will be automatically populated",
            defaultValue: "State Bank of India"
          },
          {
            name: "branchName", 
            label: "Branch Name",
            type: "string",
            required: true,
            placeholder: "Will be auto-filled based on IFSC",
            description: "Branch name will be automatically populated",
            defaultValue: "Main Branch"
          },
          {
            name: "accountNumber",
            label: "Bank Account Number",
            type: "string",
            required: true,
            placeholder: "Enter bank account number",
            description: "Enter your business bank account number",
            defaultValue: "12345678901234"
          },
          {
            name: "plantMachineryInvestment",
            label: "Investment in Plant & Machinery (₹)",
            type: "number",
            required: true,
            placeholder: "500000",
            description: "Enter investment amount in plant and machinery in rupees",
            defaultValue: 500000
          },
          {
            name: "annualTurnover",
            label: "Annual Turnover (₹)",
            type: "number", 
            required: true,
            placeholder: "2000000",
            description: "Enter annual turnover of previous financial year in rupees",
            defaultValue: 2000000
          }
        ]
      }
    ]
  };
}