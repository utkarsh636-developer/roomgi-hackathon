# API Documentation - Frontend Integration Guide

This document provides a comprehensive overview of all API endpoints with their input formats, authentication requirements, and response structures.

## Table of Contents
- [Authentication](#authentication)
- [User Routes](#user-routes)
- [Property Routes](#property-routes)
- [Enquiry Routes](#enquiry-routes)
- [Review Routes](#review-routes)
- [Report Routes](#report-routes)
- [Admin Routes](#admin-routes)

---

## Authentication

Most routes require authentication using JWT tokens. Include the access token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

Tokens are obtained from `/api/users/register` or `/api/users/login` endpoints.

---

## User Routes

Base URL: `/api/users`

### Public Routes (No Authentication Required)

#### Register User
- **POST** `/register`
- **Body (JSON)**:
  ```json
  {
    "username": "string (required)",
    "email": "string (required)",
    "password": "string (required)",
    "phoneNumber": "string (required)",
    "role": "string (optional, default: 'tenant', values: 'tenant' | 'owner')"
  }
  ```
- **Response**: User object with accessToken and refreshToken

#### Login User
- **POST** `/login`
- **Body (JSON)**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response**: User object with accessToken and refreshToken

### Protected Routes (Authentication Required)

#### Logout User
- **POST** `/logout`
- **Headers**: Authorization: Bearer <accessToken>
- **Body**: None
- **Response**: Success message

#### Get Current User
- **GET** `/current-user`
- **Headers**: Authorization: Bearer <accessToken>
- **Response**: User object with all details

#### Update Profile
- **PATCH** `/update-profile`
- **Headers**: Authorization: Bearer <accessToken>
- **Body (multipart/form-data)**:
  ```
  username: string (optional)
  password: string (optional)
  phoneNumber: string (optional)
  profileImage: file (optional, single image file)
  ```
- **Response**: Updated user object

#### Get Owner Properties
- **GET** `/owner/properties`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner
- **Response**: Array of property objects

#### Get Tenant Enquiries
- **GET** `/tenant/enquiries`
- **Headers**: Authorization: Bearer <accessToken>
- **Response**: Array of enquiry objects

#### Get Tenant Favourites
- **GET** `/tenant/favourites`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: tenant
- **Response**: Array of property objects

#### Submit Verification Request
- **POST** `/verify-request`
- **Headers**: Authorization: Bearer <accessToken>
- **Body (multipart/form-data)**:
  ```
  documents: file[] (required, minimum 2 files, maximum 2 files)
  documentTypes: string[] (required, must match number of documents)
  ```
- **Response**: Updated user object with verification status

#### Edit Verification Documents
- **PATCH** `/edit-document`
- **Headers**: Authorization: Bearer <accessToken>
- **Body (multipart/form-data)**:
  ```
  documents: file[] (required, minimum 2 files, maximum 2 files)
  documentTypes: string[] (required, must match number of documents)
  ```
- **Note**: Only when status is pending or rejected
- **Response**: Updated user object with new documents

---

## Property Routes

Base URL: `/api/properties`

### Public Routes (No Authentication Required)

#### Search Properties
- **GET** `/search`
- **Query Parameters (all optional)**:
  ```
  type: string (hostel | pg | flat)
  city: string
  state: string
  pincode: string
  minRent: number
  maxRent: number
  amenities: string or string[] (comma-separated or array)
  minCapacity: number
  maxCapacity: number
  status: string (available | occupied)
  preferences: string
  lat: number (latitude for geo search)
  lng: number (longitude for geo search)
  maxDistance: number (in km, requires lat & lng)
  ```
- **Response**: Array of property objects (with distance if geo search)

#### Get Property by ID
- **GET** `/:propertyId`
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Response**: Property object with all details

#### Get Property Reviews
- **GET** `/:propertyId/reviews`
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Response**: Array of review objects with populated user details

### Protected Routes (Authentication Required)

#### Create Property
- **POST** `/add`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner
- **Body (multipart/form-data)**:
  ```
  type: string (required, values: hostel | pg | flat)
  address: string (required)
  city: string (required)
  state: string (required)
  pincode: string (required)
  coordinates.lng: number (required, longitude)
  coordinates.lat: number (required, latitude)
  rent: number (required)
  securityDeposit: number (required)
  capacity.total: number (required)
  amenities: string[] (optional)
  description: string (optional)
  preferences: string (optional)
  images: file[] (required, minimum 1, maximum 4 image files)
  ```
- **Response**: Created property object

#### Update Property
- **PATCH** `/:propertyId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Body (multipart/form-data)**:
  ```
  type: string (hostel | pg | flat)
  address: string
  city: string
  state: string
  pincode: string
  rent: number
  securityDeposit: number
  amenities: string[]
  capacity: object { total: number }
  description: string
  preferences: string
  coordinates: object { lng: number, lat: number }
  images: file[] (required, minimum 1, maximum 4 image files)
  ```
- **Note**: All old images will be replaced
- **Response**: Updated property object

#### Delete Property
- **DELETE** `/:propertyId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Note**: Deletes property, all reviews, enquiries, and media files
- **Response**: Success message

#### Submit Property Verification
- **POST** `/:propertyId/verify-request`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Body (multipart/form-data)**:
  ```
  documents: file[] (required, minimum 4 files, maximum 4 files)
  documentTypes: string[] (required, must include 'ownership_proof' and 'government_id')
  ```
- **Response**: Updated property object with verification status

#### Edit Property Documents
- **PATCH** `/:propertyId/edit-document`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Body (multipart/form-data)**:
  ```
  documents: file[] (required, minimum 4 files, maximum 4 files)
  documentTypes: string[] (required, must include 'ownership_proof' and 'government_id')
  ```
- **Note**: Can only edit when verification status is pending or rejected
- **Response**: Updated property object with new documents

---

## Enquiry Routes

Base URL: `/api/enquiries`

All enquiry routes require authentication.

#### Create Enquiry
- **POST** `/create`
- **Headers**: Authorization: Bearer <accessToken>
- **Body (JSON)**:
  ```json
  {
    "propertyId": "string (required, MongoDB ObjectId)",
    "message": "string (required)",
    "name": "string (required)",
    "email": "string (required)",
    "phone": "string (required)"
  }
  ```
- **Note**: Cannot enquire about your own property
- **Response**: Created enquiry object

#### Get Tenant Enquiries
- **GET** `/tenant`
- **Headers**: Authorization: Bearer <accessToken>
- **Response**: Array of enquiry objects with populated property details

#### Get Owner Enquiries
- **GET** `/owner`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner
- **Response**: Array of enquiry objects with populated property and user details

#### Get Enquiry by ID
- **GET** `/:enquiryId`
- **Headers**: Authorization: Bearer <accessToken>
- **URL Parameters**: enquiryId (MongoDB ObjectId)
- **Note**: Only accessible by enquiry creator or property owner
- **Response**: Enquiry object with populated details

#### Delete Enquiry
- **DELETE** `/:enquiryId`
- **Headers**: Authorization: Bearer <accessToken>
- **URL Parameters**: enquiryId (MongoDB ObjectId)
- **Note**: Can be deleted by enquiry creator or property owner
- **Response**: Success message

#### Accept Enquiry
- **PATCH** `/:enquiryId/accept`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: enquiryId (MongoDB ObjectId)
- **Body (JSON)**:
  ```json
  {
    "reply": "string (required)"
  }
  ```
- **Note**: Changes enquiry status to 'contacted'
- **Response**: Updated enquiry object

#### Reject Enquiry
- **PATCH** `/:enquiryId/reject`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: owner (must be property owner)
- **URL Parameters**: enquiryId (MongoDB ObjectId)
- **Body**: None
- **Note**: Changes enquiry status to 'rejected'
- **Response**: Updated enquiry object

---

## Review Routes

Base URL: `/api/reviews`

All review routes require authentication.

#### Get User Reviews
- **GET** `/user/:userId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: tenant
- **URL Parameters**: userId (MongoDB ObjectId)
- **Response**: Array of review objects

#### Create Review
- **POST** `/add`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: tenant
- **Body (multipart/form-data)**:
  ```
  propertyId: string (required, MongoDB ObjectId)
  rating: number (required, 1-5)
  comment: string (optional)
  images: file[] (optional, maximum 2 image files)
  ```
- **Note**: Automatically updates property's average rating score
- **Response**: Created review object

#### Delete Review
- **DELETE** `/:reviewId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: tenant (must be review author)
- **URL Parameters**: reviewId (MongoDB ObjectId)
- **Note**: Recalculates property's average rating score
- **Response**: Success message

#### Update Review
- **PATCH** `/:reviewId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: tenant (must be review author)
- **URL Parameters**: reviewId (MongoDB ObjectId)
- **Body (multipart/form-data)**:
  ```
  rating: number (optional, 1-5)
  comment: string (optional)
  images: file[] (optional, maximum 2 image files, replaces old images)
  ```
- **Note**: If rating is changed, property's average rating will be recalculated
- **Response**: Updated review object

---

## Report Routes

Base URL: `/api/reports`

All report routes require authentication.

#### Create Report
- **POST** `/create`
- **Headers**: Authorization: Bearer <accessToken>
- **Body (JSON)**:
  ```json
  {
    "targetModel": "string (required, values: User | Property)",
    "targetId": "string (required, MongoDB ObjectId of user or property)",
    "reason": "string (required)",
    "message": "string (required)"
  }
  ```
- **Response**: Created report object

### Admin Only Routes

#### Get All Reports
- **GET** `/all`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **Query Parameters (optional)**:
  ```
  status: string (pending | resolved | dismissed)
  ```
- **Response**: Array of report objects with populated details

#### Get Report by ID
- **GET** `/:reportId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: reportId (MongoDB ObjectId)
- **Response**: Report object with populated details

#### Delete Report
- **DELETE** `/:reportId`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: reportId (MongoDB ObjectId)
- **Note**: Removes report reference from target user/property
- **Response**: Success message

#### Update Report Status
- **PATCH** `/:reportId/status`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: reportId (MongoDB ObjectId)
- **Body (JSON)**:
  ```json
  {
    "status": "string (required, values: pending | resolved | dismissed)"
  }
  ```
- **Response**: Updated report object

---

## Admin Routes

Base URL: `/api/admin`

All admin routes require authentication and admin role.

#### Toggle Block User
- **PATCH** `/users/:userId/block`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: userId (MongoDB ObjectId)
- **Body**: None
- **Note**: Also blocks/unblocks all properties owned by the user if they are an owner
- **Response**: { isBlocked: boolean }

#### Verify User
- **PATCH** `/users/:userId/verify`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: userId (MongoDB ObjectId)
- **Body (JSON)**:
  ```json
  {
    "status": "string (required, values: pending | approved | rejected)",
    "rejectionReason": "string (required if status is 'rejected')"
  }
  ```
- **Response**: Updated verification object

#### Toggle Block Property
- **PATCH** `/properties/:propertyId/block`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Body**: None
- **Response**: { isBlocked: boolean }

#### Verify Property
- **PATCH** `/properties/:propertyId/verify`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **URL Parameters**: propertyId (MongoDB ObjectId)
- **Body (JSON)**:
  ```json
  {
    "status": "string (required, values: pending | approved | rejected)",
    "rejectionReason": "string (required if status is 'rejected')"
  }
  ```
- **Response**: Updated verification object

#### Get User Report Statistics
- **GET** `/stats/reports/users`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **Response**: Array of user report statistics with user details

#### Get Property Report Statistics
- **GET** `/stats/reports/properties`
- **Headers**: Authorization: Bearer <accessToken>
- **Role Required**: admin
- **Response**: Array of property report statistics with property details

---

## Common Response Format

All API responses follow this structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Error Response Format

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

## Notes for Frontend Developers

1. **File Uploads**: Use `multipart/form-data` content type for routes that accept files
2. **Authentication**: Store accessToken and refreshToken securely (e.g., httpOnly cookies or secure storage)
3. **MongoDB ObjectIds**: All IDs are MongoDB ObjectId strings (24 hex characters)
4. **Role-based Access**: Check user role before showing certain UI elements
5. **Image Limits**: Respect maximum image counts to avoid errors
6. **Document Types**: For verification, ensure required document types are included
7. **Geo Search**: Provide lat, lng, and maxDistance together for location-based search
