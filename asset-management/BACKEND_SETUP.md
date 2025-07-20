# Backend Connection Setup Guide

## Express.js Backend Requirements

To connect your React frontend with your existing Node.js Express backend, ensure your backend has the following configuration:

### 1. CORS Configuration

```javascript
// backend/app.js or backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',  // React dev server
    'http://localhost:5173',  // Vite dev server
    'https://your-frontend-domain.com'  // Production frontend
  ],
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
```

### 2. Required API Endpoints

Your backend should have these endpoints for the frontend to work properly:

#### Health Check Endpoint
```javascript
// Health check endpoint for connection testing
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Asset Manager API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    },
    message: 'Server is running'
  });
});
```

#### Authentication Endpoints
```javascript
// POST /api/auth/login
// POST /api/auth/register  
// POST /api/auth/logout
// GET  /api/auth/verify
```

#### Asset Management Endpoints
```javascript
// GET    /api/assets
// POST   /api/assets
// GET    /api/assets/:id
// PUT    /api/assets/:id
// DELETE /api/assets/:id
// POST   /api/assets/:id/assign
// POST   /api/assets/:id/unassign
```

#### User Management Endpoints
```javascript
// GET    /api/users
// GET    /api/users/profile
// PUT    /api/users/profile
// POST   /api/users/change-password
```

### 3. Response Format Standard

All API responses should follow this format:

```javascript
// Success Response
{
  success: true,
  data: {
    // Your data here
  },
  message: "Operation successful"
}

// Error Response  
{
  success: false,
  error: "Error message",
  message: "Operation failed"
}

// Paginated Response
{
  success: true,
  data: [
    // Array of items
  ],
  meta: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
}
```

### 4. Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Use middleware on protected routes
app.use('/api/assets', authenticateToken);
app.use('/api/users', authenticateToken);
```

### 5. Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/asset_manager
# or
DATABASE_URL=postgresql://user:password@localhost:5432/asset_manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS Origins
FRONTEND_URL=http://localhost:3000

# File Upload Configuration  
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 6. Package.json Dependencies

Ensure your backend has these dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.0",
    "mongoose": "^7.0.0",
    "multer": "^1.4.5"
  }
}
```

### 7. Start Your Backend Server

Make sure your backend is running on the correct port:

```bash
cd your-backend-directory
npm install
npm start  # or node server.js
```

The server should be accessible at: http://localhost:5000

### 8. Test the Connection

Once your backend is running:

1. Start your React frontend: `npm run dev`
2. Open the developer tools in your browser
3. Check the console for connection logs
4. The frontend will automatically test the connection to `/api/health`

### Common Issues and Solutions

1. **CORS Error**: Ensure your backend has proper CORS configuration
2. **404 on /api/health**: Create the health endpoint in your backend
3. **Port Conflicts**: Make sure backend runs on port 5000 and frontend on port 3000
4. **Authentication Issues**: Check JWT token format and secret key
5. **Network Error**: Verify backend server is running and accessible

### Database Schema Examples

If you need to create database schemas, here are examples for MongoDB/Mongoose:

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  department: String,
  createdAt: { type: Date, default: Date.now }
});

// Asset Schema
const assetSchema = new mongoose.Schema({
  name: String,
  assetTag: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: { type: String, enum: ['available', 'assigned', 'maintenance'], default: 'available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: Date,
  purchasePrice: Number,
  location: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
```
