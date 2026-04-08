# Manual AWS Lambda Deployment Guide

## Step 1: Prepare the deployment package
1. In the backend folder, run:
   ```
   npm install --production
   ```

2. Create a ZIP file containing:
   - All files in backend folder (server.js, handler.js, package.json, etc.)
   - node_modules folder
   - config folder
   - controllers folder
   
   **Important:** ZIP the contents, not the folder itself

## Step 2: Create Lambda Function (AWS Console)
1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `careercompass-api`
5. Runtime: `Node.js 20.x`
6. Click "Create function"

## Step 3: Upload your code
1. In the Lambda function page, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload your ZIP file
4. Click "Save"

## Step 4: Configure Handler
1. Go to "Runtime settings"
2. Click "Edit"
3. Set Handler to: `handler.handler`
4. Click "Save"

## Step 5: Add Environment Variables
1. Go to "Configuration" → "Environment variables"
2. Click "Edit" → "Add environment variable"
3. Add all your .env variables:
   - PORT
   - MONGODB_URI (or DATABASE_URL)
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - FRONTEND_URL
   - etc.

## Step 6: Increase Timeout
1. Go to "Configuration" → "General configuration"
2. Click "Edit"
3. Set Timeout to: `30 seconds`
4. Click "Save"

## Step 7: Create API Gateway
1. Go to API Gateway Console
2. Click "Create API"
3. Choose "HTTP API" (cheaper and simpler)
4. Click "Build"
5. Add integration: Select "Lambda"
6. Choose your Lambda function
7. API name: `careercompass-api`
8. Click "Next" → "Next" → "Create"

## Step 8: Configure CORS (if needed)
1. In API Gateway, go to "CORS"
2. Click "Configure"
3. Add your frontend URL to allowed origins
4. Click "Save"

## Your API URL
After creating API Gateway, you'll get a URL like:
`https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com`

Update your frontend to use this URL!

## Cost: FREE (within free tier limits)
- Lambda: 1M requests/month free
- API Gateway: 1M requests/month free
