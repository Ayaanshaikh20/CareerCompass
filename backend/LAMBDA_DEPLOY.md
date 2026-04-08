# Complete AWS Deployment Guide - CareerCompass

## Part 1: Backend Deployment to Lambda

### Step 1: Prepare the deployment package
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

### Step 2: Create Lambda Function
1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `careercompass-api`
5. Runtime: `Node.js 20.x`
6. Click "Create function"

### Step 3: Upload your code
1. In the Lambda function page, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload your ZIP file
4. Click "Save"

### Step 4: Configure Handler
1. Go to "Runtime settings"
2. Click "Edit"
3. Set Handler to: `handler.handler`
4. Click "Save"

### Step 5: Add Environment Variables
1. Go to "Configuration" → "Environment variables"
2. Click "Edit" → "Add environment variable"
3. Add these variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL_PROD` = `your-postgres-url`
   - `FRONTEND_URL_PROD` = `https://careercompass.cyrusesolutions.xyz`
   - `ACCESS_TOKEN_SECRET` = `your-secret`
   - `REFRESH_TOKEN_SECRET` = `your-secret`
   - `PORT` = `8000`
4. Click "Save"

### Step 6: Increase Timeout
1. Go to "Configuration" → "General configuration"
2. Click "Edit"
3. Set Timeout to: `30 seconds`
4. Click "Save"

## Part 2: Create REST API Gateway

### Step 7: Create REST API
1. Go to API Gateway Console
2. Click "Create API"
3. Choose "REST API" (NOT HTTP API)
4. Click "Build"
5. API name: `careercompass-api`
6. Endpoint Type: Regional
7. Click "Create API"

### Step 8: Create Proxy Resource
1. Click "Actions" → "Create Resource"
2. Check "Configure as proxy resource"
3. Resource Path: `/{proxy+}`
4. Click "Create Resource"

### Step 9: Setup Lambda Integration
1. Integration type: "Lambda Function Proxy"
2. Check "Use Lambda Proxy integration"
3. Lambda Region: `ap-south-1` (your region)
4. Lambda Function: `careercompass-api`
5. Click "Save"
6. Click "OK" to give API Gateway permission

### Step 10: Enable CORS
1. Select the `/{proxy+}` resource
2. Click "Actions" → "Enable CORS"
3. Click "Enable CORS and replace existing CORS headers"
4. Click "Yes, replace existing values"

### Step 11: Deploy API
1. Click "Actions" → "Deploy API"
2. Deployment stage: "[New Stage]"
3. Stage name: `prod`
4. Click "Deploy"
5. Copy the "Invoke URL" (e.g., `https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod`)

## Part 3: Setup Custom Domain for Backend

### Step 12: Request SSL Certificate
1. Go to AWS Certificate Manager (ACM)
2. Click "Request a certificate"
3. Certificate type: "Request a public certificate"
4. Domain name: `api.careercompass.cyrusesolutions.xyz`
5. Validation method: "DNS validation"
6. Click "Request"
7. Click "View certificate"
8. Click "Create records in Route 53" (auto-validates)
9. Wait 5-10 minutes for status to change to "Issued"

### Step 13: Create Custom Domain in API Gateway
1. Go to API Gateway Console
2. Click "Custom domain names" (left sidebar)
3. Click "Create"
4. Domain name: `api.careercompass.cyrusesolutions.xyz`
5. Type: "Public"
6. Routing mode: "API mappings only"
7. API endpoint type: "Regional"
8. IP address type: "IPv4"
9. Security policy: "TLS 1.2"
10. ACM certificate: Select your certificate
11. Click "Create domain name"

### Step 14: Configure API Mapping
1. In your custom domain, click "API mappings" tab
2. Click "Configure API mappings"
3. Click "Add new mapping"
4. API: Select your REST API
5. Stage: `prod`
6. Path: leave empty
7. Click "Save"

### Step 15: Update Route 53
1. Go to Route 53 Console
2. Click "Hosted zones"
3. Select your domain
4. Click "Create record"
5. Record name: `api`
6. Record type: "A"
7. Toggle "Alias" to ON
8. Route traffic to: "Alias to API Gateway API"
9. Region: `ap-south-1`
10. Choose endpoint: Select `api.careercompass.cyrusesolutions.xyz`
11. Click "Create records"

### Step 16: Update Frontend Environment Variable
1. Go to AWS Amplify Console
2. Select your app
3. Click "Environment variables" (left sidebar)
4. Edit `VITE_API_URL_PROD`
5. Change value to: `https://api.careercompass.cyrusesolutions.xyz`
6. Click "Save"
7. Go to your branch and click "Redeploy this version"

## Part 4: Frontend Deployment to Amplify

### Step 17: Connect GitHub Repository
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Choose "GitHub"
4. Authorize AWS Amplify
5. Select repository: `CareerCompass`
6. Select branch: `main`
7. Click "Next"

### Step 18: Configure Build Settings
1. App name: `careercompass`
2. Build settings should auto-detect (Vite)
3. If not, set:
   - Build command: `npm run build`
   - Base directory: `frontend`
   - Output directory: `dist`
4. Click "Next"
5. Click "Save and deploy"

### Step 19: Add Environment Variables
1. In Amplify Console, click your app
2. Click "Environment variables" (left sidebar)
3. Click "Manage variables"
4. Add these variables:
   - `AMPLIFY_MONOREPO_APP_ROOT` = `frontend`
   - `VITE_API_URL_PROD` = `https://api.careercompass.cyrusesolutions.xyz`
   - Add any other VITE_ variables your app needs
5. Click "Save"

### Step 20: Setup Custom Domain for Frontend
1. In Amplify Console, click "Domain management" (left sidebar)
2. Click "Add domain"
3. Domain: `careercompass.cyrusesolutions.xyz`
4. Click "Configure domain"
5. Amplify will automatically:
   - Request SSL certificate
   - Create CloudFront distribution
   - Add records to Route 53
6. Wait 15-30 minutes for DNS propagation

## Testing

### Test Backend:
```
https://api.careercompass.cyrusesolutions.xyz/health
```
Should return: "Backend up and running"

### Test Frontend:
```
https://careercompass.cyrusesolutions.xyz
```
Should load your app and be able to login/register

## Monthly Costs (Estimated)

### Free Tier (First 12 months):
- Lambda: FREE (1M requests/month)
- API Gateway: FREE (1M requests/month)
- CloudFront: FREE (1TB transfer, 10M requests)
- ACM Certificates: FREE forever
- Route 53: $0.50/month ($6/year)

**Total: ~$6/year**

### After Free Tier:
- Lambda: FREE (within limits)
- API Gateway: ~$3.50 per million requests
- CloudFront: ~$0.085 per GB
- Route 53: $0.50/month

**Total: ~$10-20/year for personal project**

## Troubleshooting

### CORS Errors:
- Check Lambda environment variables (NODE_ENV, FRONTEND_URL_PROD)
- Verify API Gateway CORS is enabled
- Check browser console for exact error

### 404 Errors:
- Verify API Gateway proxy resource is configured
- Check Lambda handler is set to `handler.handler`
- Verify deployment stage is `prod`

### Certificate Issues:
- Wait for ACM certificate to show "Issued" status
- Verify DNS validation record exists in Route 53
- Can take up to 30 minutes

### Frontend Build Failures:
- Check Amplify build logs
- Verify all dependencies are in package.json
- Check environment variables are set correctly
