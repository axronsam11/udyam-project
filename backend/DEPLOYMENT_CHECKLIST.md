# Production Deployment Checklist

## Pre-Deployment Setup

### ✅ Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT secret (32+ characters)
- [ ] Configure Cloudinary credentials
- [ ] Set production frontend URL for CORS
- [ ] Configure SMTP settings for email notifications

### ✅ Security Configuration
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure rate limiting parameters
- [ ] Review CORS origins
- [ ] Enable security headers (Helmet)

### ✅ Database Setup
- [ ] MongoDB Atlas cluster configured
- [ ] Database user with appropriate permissions
- [ ] Network access configured (IP whitelist)
- [ ] Backup strategy implemented
- [ ] Indexes created for performance

### ✅ File Storage
- [ ] Cloudinary account configured
- [ ] Upload folder structure set up
- [ ] File size and type restrictions configured
- [ ] CDN settings optimized

## Deployment Steps

### 1. Build Application
```bash
npm run build
```

### 2. Install Production Dependencies
```bash
npm ci --only=production
```

### 3. Start Application
```bash
npm start
```

### 4. Verify Deployment
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Database connection works: `GET /api/health/database`
- [ ] API endpoints functional
- [ ] File upload working
- [ ] Error handling working
- [ ] Logging operational

## Monitoring Setup

### ✅ Application Monitoring
- [ ] Log files rotation configured
- [ ] Error tracking (Sentry/similar)
- [ ] Performance monitoring (New Relic/similar)
- [ ] Uptime monitoring
- [ ] Database performance monitoring

### ✅ Health Checks
- [ ] Load balancer health checks
- [ ] Container orchestration health checks
- [ ] External monitoring service

## Security Hardening

### ✅ Server Security
- [ ] Regular security updates
- [ ] Non-root user for application
- [ ] Minimal file permissions
- [ ] Disable unnecessary services
- [ ] Configure fail2ban (if applicable)

### ✅ Application Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (MongoDB)
- [ ] XSS protection
- [ ] CSRF protection (if needed)
- [ ] Rate limiting configured
- [ ] File upload security

## Performance Optimization

### ✅ Application Performance
- [ ] Database indexes optimized
- [ ] Connection pooling configured
- [ ] Caching strategy implemented
- [ ] Compression enabled
- [ ] Static file serving optimized

### ✅ Infrastructure
- [ ] Load balancing configured
- [ ] Auto-scaling rules set
- [ ] CDN configured for static assets
- [ ] Database read replicas (if needed)

## Backup and Recovery

### ✅ Data Backup
- [ ] Automated database backups
- [ ] File storage backups
- [ ] Backup restoration tested
- [ ] Backup retention policy

### ✅ Disaster Recovery
- [ ] Recovery procedures documented
- [ ] RTO/RPO defined
- [ ] Failover procedures tested
- [ ] Data replication configured

## Documentation

### ✅ Technical Documentation
- [ ] API documentation updated
- [ ] Deployment procedures documented
- [ ] Configuration management
- [ ] Troubleshooting guide

### ✅ Operational Documentation
- [ ] Monitoring runbooks
- [ ] Incident response procedures
- [ ] Escalation procedures
- [ ] Contact information updated

## Post-Deployment

### ✅ Verification
- [ ] All API endpoints tested
- [ ] File upload/download tested
- [ ] Database operations verified
- [ ] Error scenarios tested
- [ ] Performance benchmarks met

### ✅ Monitoring
- [ ] Alerts configured
- [ ] Dashboards set up
- [ ] Log aggregation working
- [ ] Metrics collection active

## Rollback Plan

### ✅ Rollback Preparation
- [ ] Previous version backup available
- [ ] Database migration rollback scripts
- [ ] Rollback procedures documented
- [ ] Rollback testing completed

## Compliance and Legal

### ✅ Data Protection
- [ ] GDPR compliance (if applicable)
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Privacy policy updated
- [ ] Terms of service updated

## Maintenance

### ✅ Regular Maintenance
- [ ] Security patch schedule
- [ ] Dependency update schedule
- [ ] Performance review schedule
- [ ] Backup verification schedule
- [ ] Log cleanup schedule

---

## Quick Deployment Commands

### Docker Deployment
```bash
# Build and deploy
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Manual Deployment
```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start application
npm start

# Check health
curl http://localhost:5000/api/health
```

### Environment Variables Check
```bash
# Verify all required environment variables are set
node -e "
const required = ['NODE_ENV', 'MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing environment variables:', missing);
  process.exit(1);
} else {
  console.log('All required environment variables are set');
}
"
```
