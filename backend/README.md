# Udyam Registration Backend

A production-ready Express.js backend for the Udyam Registration system with MongoDB integration.

## Features

- **RESTful API** for Udyam registration management
- **MongoDB** integration with Mongoose ODM
- **File Upload** support with Cloudinary integration
- **Input Validation** using express-validator
- **Security** features (CORS, Helmet, Rate Limiting)
- **Logging** with Winston
- **Error Handling** with custom error middleware
- **Health Checks** for monitoring
- **TypeScript** support for type safety

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/udyam_registration
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/database` - Database connectivity check

### Registration Management
- `GET /api/registration` - Get all registrations (with pagination)
- `GET /api/registration/:id` - Get registration by ID
- `POST /api/registration` - Create new registration
- `PUT /api/registration/:id` - Update registration (draft only)
- `DELETE /api/registration/:id` - Delete registration (draft only)
- `POST /api/registration/:id/submit` - Submit registration for review
- `POST /api/registration/:id/approve` - Approve registration (admin)
- `POST /api/registration/:id/reject` - Reject registration (admin)
- `GET /api/registration/udyam/:udyamNumber` - Get registration by Udyam number

### Document Management
- `POST /api/documents/upload/:registrationId` - Upload single document
- `POST /api/documents/upload-multiple/:registrationId` - Upload multiple documents
- `GET /api/documents/:registrationId` - Get all documents for registration
- `GET /api/documents/download/:registrationId/:documentType` - Get document download URL
- `DELETE /api/documents/:registrationId/:documentType` - Delete document

## Data Models

### Registration Schema
The registration model includes:
- **Entrepreneur Details**: Name, gender, category, Aadhaar, PAN
- **Enterprise Details**: Name, type, commencement date, GST, etc.
- **Location Details**: Plant and office addresses
- **Bank Details**: Account number, IFSC, bank name
- **Business Activities**: NIC codes and descriptions
- **Investment Details**: Plant machinery, land building investments
- **Turnover Details**: Current and previous year turnover
- **Employment Details**: Male, female, others count
- **Documents**: File URLs for various document types
- **Status Tracking**: Draft, submitted, approved, rejected states

## Security Features

- **CORS** protection with configurable origins
- **Helmet** for security headers
- **Rate Limiting** to prevent abuse
- **Input Validation** for all endpoints
- **File Upload** restrictions (type and size limits)
- **Error Handling** without exposing sensitive information

## File Upload

Documents are uploaded to Cloudinary with:
- **File Type Validation**: Only JPEG, PNG, PDF allowed
- **Size Limits**: Maximum 5MB per file
- **Organized Storage**: Files stored in registration-specific folders
- **Secure URLs**: Direct access to uploaded documents

## Logging

Winston logger configured with:
- **File Logging**: Separate error and combined logs
- **Console Logging**: Development environment
- **Log Levels**: Configurable via environment variables
- **Structured Logging**: JSON format for production

## Error Handling

Comprehensive error handling for:
- **Mongoose Errors**: Validation, cast, duplicate key errors
- **JWT Errors**: Invalid token, expired token
- **Multer Errors**: File upload errors
- **Custom Errors**: Application-specific error handling

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up proper logging directory permissions
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificates
6. Configure monitoring and alerting

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/udyam_registration |
| `JWT_SECRET` | JWT signing secret | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOG_LEVEL` | Logging level | info |

## Testing

Run tests:
```bash
npm test
```

## License

MIT License
