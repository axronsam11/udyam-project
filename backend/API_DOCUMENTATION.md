# Udyam Registration Backend API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication
Currently, the API does not require authentication. In production, you should implement JWT-based authentication for admin operations.

## Response Format
All API responses follow this standard format:

```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": object | array (optional),
  "errors": array (optional)
}
```

## Health Check Endpoints

### GET /api/health
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "data": {
    "uptime": 123.456,
    "message": "OK",
    "timestamp": "2025-08-13T08:56:27.000Z",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

### GET /api/health/database
Check database connectivity.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected",
    "host": "localhost",
    "name": "udyam_registration",
    "timestamp": "2025-08-13T08:56:27.000Z"
  }
}
```

## Registration Management

### GET /api/registration
Get all registrations with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (draft, submitted, under_review, approved, rejected)

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /api/registration/:id
Get a specific registration by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "registration_id",
    "entrepreneur": {...},
    "enterprise": {...},
    "location": {...},
    "bankDetails": {...},
    "activities": [...],
    "investment": {...},
    "turnover": {...},
    "employment": {...},
    "documents": {...},
    "status": "draft",
    "createdAt": "2025-08-13T08:56:27.000Z",
    "updatedAt": "2025-08-13T08:56:27.000Z"
  }
}
```

### POST /api/registration
Create a new registration.

**Request Body:**
```json
{
  "entrepreneur": {
    "name": "John Doe",
    "gender": "Male",
    "category": "General",
    "physicallyHandicapped": false,
    "aadhaarNumber": "123456789012",
    "panNumber": "ABCDE1234F"
  },
  "enterprise": {
    "name": "ABC Enterprises",
    "type": "Proprietorship",
    "commencementDate": "2023-01-01",
    "panNumber": "ABCDE1234F",
    "gstNumber": "12ABCDE1234F1Z5"
  },
  "location": {
    "plantAddress": {
      "roadStreet": "123 Main Street",
      "state": "Maharashtra",
      "district": "Mumbai",
      "pinCode": "400001"
    },
    "officeAddress": {
      "roadStreet": "123 Main Street",
      "state": "Maharashtra",
      "district": "Mumbai",
      "pinCode": "400001"
    },
    "sameAsPlant": true
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0000123",
    "bankName": "State Bank of India",
    "branchName": "Main Branch"
  },
  "activities": [
    {
      "nicCode": "12345",
      "description": "Manufacturing of textiles",
      "isPrimary": true
    }
  ],
  "investment": {
    "plantMachinery": 500000,
    "landBuilding": 300000
  },
  "turnover": {
    "currentYear": 1000000
  },
  "employment": {
    "male": 5,
    "female": 3,
    "others": 0
  }
}
```

### PUT /api/registration/:id
Update an existing registration (only drafts can be updated).

**Request Body:** Same as POST request

### POST /api/registration/:id/submit
Submit a registration for review.

**Response:**
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {...}
}
```

### POST /api/registration/:id/approve
Approve a registration (admin only).

**Request Body:**
```json
{
  "reviewedBy": "Admin Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "data": {
    "udyamNumber": "UDYAM-12-34-1234567",
    ...
  }
}
```

### POST /api/registration/:id/reject
Reject a registration (admin only).

**Request Body:**
```json
{
  "remarks": "Reason for rejection",
  "reviewedBy": "Admin Name"
}
```

### GET /api/registration/udyam/:udyamNumber
Get registration by Udyam number.

### DELETE /api/registration/:id
Delete a registration (only drafts can be deleted).

## Document Management

### POST /api/documents/upload/:registrationId
Upload a single document.

**Form Data:**
- `document`: File (JPEG, PNG, PDF, max 5MB)
- `documentType`: String (aadhaarCard, panCard, bankStatement, businessProof, others)

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentType": "aadhaarCard",
    "url": "https://cloudinary-url.com/image.jpg",
    "publicId": "udyam-registration/registration_id/aadhaarCard_timestamp"
  }
}
```

### POST /api/documents/upload-multiple/:registrationId
Upload multiple documents.

**Form Data:**
- `documents`: Array of files
- `documentTypes`: Array of document type strings

### GET /api/documents/:registrationId
Get all documents for a registration.

**Response:**
```json
{
  "success": true,
  "data": {
    "aadhaarCard": "https://cloudinary-url.com/aadhaar.jpg",
    "panCard": "https://cloudinary-url.com/pan.jpg",
    "bankStatement": "https://cloudinary-url.com/bank.pdf"
  }
}
```

### GET /api/documents/download/:registrationId/:documentType
Get document download URL.

### DELETE /api/documents/:registrationId/:documentType
Delete a specific document.

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "entrepreneur.name",
      "message": "Entrepreneur name is required",
      "value": ""
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Registration not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

## File Upload Restrictions
- **Allowed Types:** JPEG, PNG, PDF
- **Maximum Size:** 5MB per file
- **Storage:** Cloudinary (configurable)

## Environment Configuration
See `.env.example` for all available configuration options.

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
