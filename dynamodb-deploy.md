# DynamoDB Cloud Deployment Guide

## ✅ Migration Complete

All controllers have been updated to use `getTableName()` function with `careercompass_` prefix.

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Tables in AWS DynamoDB Console

Go to **AWS Console → DynamoDB → Tables → Create table**

#### Table 1: careercompass-register_users
```
Table name: careercompass-register_users
Partition key: user_id (String)
Billing mode: On-demand

Global Secondary Index (GSI):
  - Index name: email-index
  - Partition key: email (String)
  - Projection: All attributes
```

#### Table 2: careercompass_applications
```
Table name: careercompass_applications
Partition key: user_id (String)
Sort key: application_id (String)
Billing mode: On-demand
```

#### Table 3: careercompass_companies
```
Table name: careercompass_companies
Partition key: user_id (String)
Sort key: company_id (String)
Billing mode: On-demand
```

#### Table 4: careercompass_documents
```
Table name: careercompass_documents
Partition key: user_id (String)
Sort key: document_id (String)
Billing mode: On-demand
```

#### Table 5: careercompass_forget_password
```
Table name: careercompass_forget_password
Partition key: email (String)
Billing mode: On-demand
```

---

### Step 2: Create IAM User for DynamoDB Access

1. Go to **AWS Console → IAM → Users → Create user**
2. User name: `careercompass-dynamodb-user`
3. Select: **Access key - Programmatic access**
4. **Attach policies directly → Create policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:DescribeTable"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-south-1:*:table/careercompass_*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-south-1:*:table/careercompass_*/index/*"
      ]
    }
  ]
}
```

5. Copy the **Access Key ID** and **Secret Access Key**

---

### Step 3: Update Backend .env File

```env
# Application
NODE_ENV=production
PORT=8000

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend-url.com

# AWS DynamoDB (Production)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...(from IAM user)
AWS_SECRET_ACCESS_KEY=...(from IAM user)
# DO NOT set DYNAMODB_ENDPOINT in production

# AWS S3
S3_BUCKET_NAME=your-s3-bucket-name
```

**Important**: Remove or comment out `DYNAMODB_ENDPOINT` for production. The SDK will automatically connect to AWS DynamoDB.

---

### Step 4: Test Connection

**Local Development:**
```bash
cd backend
NODE_ENV=development npm start
# Uses: DynamoDB Local at localhost:5000
```

**Production:**
```bash
cd backend
NODE_ENV=production npm start
# Uses: AWS DynamoDB Cloud
```

Test endpoints:
```bash
# Register a user
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "phone": "1234567890",
    "location": "Mumbai"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

### Step 5: Deploy to EC2 (Optional)

If deploying to EC2:

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repository
git clone https://github.com/yourusername/CareerCompass.git
cd CareerCompass/backend

# Install dependencies
npm install

# Create .env file with production credentials
nano .env
# Paste production environment variables

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name careercompass-api
pm2 save
pm2 startup
```

---

## 📝 Deployment Checklist

- [x] ✅ All controllers updated with `getTableName()`
- [ ] Create 5 tables in AWS DynamoDB:
  - [ ] careercompass_register_users (with email-index GSI)
  - [ ] careercompass_applications
  - [ ] careercompass_companies
  - [ ] careercompass_documents
  - [ ] careercompass_forget_password
- [ ] Create IAM user with DynamoDB permissions
- [ ] Get AWS Access Key ID and Secret Access Key
- [ ] Update backend .env with AWS credentials
- [ ] Set `NODE_ENV=production`
- [ ] Remove/comment `DYNAMODB_ENDPOINT` in production .env
- [ ] Test locally: Register → Login → Create Application
- [ ] Verify data in AWS DynamoDB Console
- [ ] Deploy to EC2/production server
- [ ] Update frontend API URL to production backend

---

## 🔍 Verify Deployment

1. **Check Tables in AWS Console:**
   - Go to DynamoDB → Tables
   - You should see 5 tables with `careercompass_` prefix

2. **Register a Test User:**
   - Use Postman or frontend to register
   - Check `careercompass_register_users` table for new entry

3. **Create Test Data:**
   - Add an application
   - Add a company
   - Upload a document
   - Check respective tables in AWS Console

---

## 🔒 Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use IAM roles** instead of access keys when on EC2:
   - Attach DynamoDB policy to EC2 instance role
   - Remove AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from .env
3. **Enable encryption at rest** in DynamoDB table settings
4. **Use VPC endpoints** for DynamoDB access from EC2
5. **Monitor costs** - Set up CloudWatch billing alarms

---

## 💰 Cost Estimation

With On-demand pricing:
- **Read**: $0.25 per million requests
- **Write**: $1.25 per million requests
- **Storage**: $0.25 per GB-month

For low-medium traffic: **~$5-20/month**

Alternative: Use **Provisioned mode** with 1-5 RCU/WCU per table for **~$1-3/month**

---

## 🔄 Switching Between Local and Cloud

**Use Local DynamoDB:**
```env
NODE_ENV=development
DYNAMODB_ENDPOINT=http://localhost:5000
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```

**Use AWS Cloud:**
```env
NODE_ENV=production
# Remove DYNAMODB_ENDPOINT
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

---

## 🆘 Troubleshooting

### Error: "ResourceNotFoundException: Table not found"
- Verify table names match exactly: `careercompass_register_users` etc.
- Check AWS region matches: `ap-south-1`
- Ensure tables are created in the correct region

### Error: "AccessDeniedException"
- Verify IAM user has DynamoDB permissions
- Check AWS credentials are correct in .env
- Ensure policy includes GSI access for queries

### Error: "Cannot do operations on a non-existent table"
- Table names must include the prefix: `careercompass_`
- Use `getTableName()` function in all controllers

### Connection Issues
- Local: Ensure DynamoDB Local is running on port 5000
- Cloud: Remove `DYNAMODB_ENDPOINT` from production .env
- Check AWS credentials are not expired

---

## 📊 Table Summary

All tables use `careercompass_` prefix for easy identification:

| Table Name | Partition Key | Sort Key | GSI |
|------------|---------------|----------|-----|
| careercompass_register_users | user_id | - | email-index |
| careercompass_applications | user_id | application_id | - |
| careercompass_companies | user_id | company_id | - |
| careercompass_documents | user_id | document_id | - |
| careercompass_forget_password | email | - | - |
