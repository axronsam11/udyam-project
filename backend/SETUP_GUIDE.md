# Udyam Registration Backend - Setup Guide

## Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **Cloudinary Account** (for file uploads)

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

**Required Environment Variables:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/udyam_registration
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/udyam_registration

# JWT Configuration (for future authentication)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# File Upload Configuration (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Database will be created automatically

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`

### 4. Cloudinary Setup (for File Uploads)
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from dashboard
3. Update environment variables

### 5. Start the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## API Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected Response:
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

### Test Database Connection
```bash
curl http://localhost:5000/api/health/database
```

### Create Sample Registration
```bash
curl -X POST http://localhost:5000/api/registration \
  -H "Content-Type: application/json" \
  -d '{
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
      "commencementDate": "2023-01-01"
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
  }'
```

## Production Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Manual Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

### Environment-Specific Configurations

#### Development
- Detailed logging to console
- CORS enabled for localhost:3000
- Hot reloading with nodemon

#### Production
- File-based logging only
- Restricted CORS origins
- Optimized build
- Health checks enabled
- Rate limiting enforced

## Monitoring and Logging

### Log Files
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

### Health Checks
- Server health: `GET /api/health`
- Database health: `GET /api/health/database`

### Metrics to Monitor
- Response times
- Error rates
- Database connection status
- File upload success rates
- Memory and CPU usage

## Security Considerations

### Implemented Security Features
- **CORS** protection
- **Helmet** security headers
- **Rate limiting** (100 requests/15min)
- **Input validation** on all endpoints
- **File upload restrictions** (type and size)
- **Error handling** without sensitive data exposure

### Additional Security Recommendations
- Implement JWT authentication for admin operations
- Use HTTPS in production
- Regular security updates
- Database access restrictions
- API key rotation
- Request logging and monitoring

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string
- Check network connectivity
- Ensure database user has proper permissions

#### File Upload Errors
- Verify Cloudinary credentials
- Check file size limits (5MB max)
- Ensure allowed file types (JPEG, PNG, PDF)

#### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <process_id> /F
```

#### TypeScript Compilation Errors
```bash
# Clean build
rm -rf dist/
npm run build
```

### Debug Mode
Set `LOG_LEVEL=debug` in environment variables for detailed logging.

## API Integration with Frontend

### CORS Configuration
The backend is configured to accept requests from `http://localhost:3000` by default. Update `FRONTEND_URL` in `.env` for different origins.

### Error Handling
All API responses follow a consistent format. Handle errors appropriately in your frontend:

```javascript
try {
  const response = await fetch('/api/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    // Handle validation errors
    console.error('API Error:', result.message, result.errors);
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

## Support

For issues and questions:
1. Check the logs in `logs/` directory
2. Verify environment configuration
3. Test API endpoints individually
4. Check database connectivity

## Next Steps

1. **Authentication**: Implement JWT-based authentication for admin operations
2. **Email Notifications**: Add email notifications for registration status changes
3. **Analytics**: Implement registration analytics and reporting
4. **Backup**: Set up automated database backups
5. **Monitoring**: Implement application performance monitoring (APM)
