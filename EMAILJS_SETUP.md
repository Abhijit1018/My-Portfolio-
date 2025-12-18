# EmailJS Setup Instructions

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month for free)
3. Verify your email address

## Step 2: Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. For Gmail:
   - Click **Connect Account**
   - Authorize EmailJS to send emails from your Gmail
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template
1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Set up your template with these variables:
   - **Template Name**: Portfolio Contact Form
   - **Subject**: `New message from {{from_name}} - {{subject}}`
   - **Content**:
     ```
     You have received a new message from your portfolio:

     Name: {{from_name}}
     Email: {{from_email}}
     Subject: {{subject}}

     Message:
     {{message}}
     ```
4. Set **To Email**: `abhijeetrathore104@gmail.com`
5. Save and copy the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key
1. Go to **Account** > **General** in your dashboard
2. Copy your **Public Key** (e.g., `your_public_key_here`)

## Step 5: Update Configuration
Open `js/emailjs-config.js` and replace:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',      // Replace with your Public Key
    serviceId: 'YOUR_SERVICE_ID',       // Replace with your Service ID
    templateId: 'YOUR_TEMPLATE_ID'      // Replace with your Template ID
};
```

Example:
```javascript
const EMAILJS_CONFIG = {
    publicKey: 'your_public_key_here',
    serviceId: 'service_abc123',
    templateId: 'template_xyz789'
};
```

## Step 6: Test
1. Save the file and push to GitHub
2. Wait for Netlify to deploy
3. Go to your portfolio contact form
4. Fill out and submit the form
5. Check your email at abhijeetrathore104@gmail.com

## Troubleshooting
- **Check browser console** for errors
- **Verify credentials** are correct in emailjs-config.js
- **Check EmailJS dashboard** for email delivery status
- **Email not received?** Check spam folder
- **Free tier limit**: 100 emails/month

## Template Variables Reference
Use these in your EmailJS template:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_email}}` - Your email (abhijeetrathore104@gmail.com)
