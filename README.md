# Crestfield International Academy - Application Management System

A complete, production-ready Application Management System for Crestfield International Academy with real-time notifications, AI-powered application analysis, and a modern admin dashboard.

## 🚀 Features

### Application Forms
- **Student Applications** - For admissions to tuition, homeschool, Cambridge, Pearson Edexcel, IGCSE, A Levels, and Checkpoints programs
- **Teacher Applications** - Complete job application with CV upload, cover letter, and portfolio links
- **Coding Course Requests** - For technology course enrollments
- **Homeschool Applications** - Dedicated homeschool program applications
- **Contact Messages** - General inquiries and support requests
- **Consultation Booking** - Schedule demos, trials, and advisor meetings

### Admin Dashboard
- **Real-time Application Tracking** - See applications as they arrive
- **Separate Sections** - Student, Teacher, Coding, Homeschool, Messages
- **Search & Filter** - Find applications by name, email, phone, program, or status
- **Status Management** - Approve, reject, or change application status
- **CSV Export** - Download application data for reporting
- **File Downloads** - Download CVs and documents directly

### Notifications
- **Email Notifications** - Instant email alerts for new applications
- **Dashboard Notifications** - In-app notification center
- **WhatsApp Alerts** - Optional WhatsApp Business API integration

### AI Integration (OpenAI)
- **Application Analysis** - Automatic suitability scoring and recommendations
- **Applicant Categorization** - AI-powered program/position recommendations
- **Interview Questions** - Auto-generated interview questions based on applications
- **Course Recommendations** - Personalized learning path suggestions for students

### Technology Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: OpenAI GPT-4
- **Email**: Nodemailer with SMTP
- **File Storage**: Firebase Storage

## 📁 Project Structure

```
crestfield school website/
├── admin-dashboard/           # Next.js admin dashboard
│   ├── app/
│   │   ├── dashboard/         # Main dashboard pages
│   │   ├── login/             # Admin login page
│   │   ├── api/               # API routes (notifications)
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home redirect
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── firebase.js        # Firebase configuration & functions
│   │   └── openai.js          # OpenAI integration
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── .env.local.example     # Environment variables template
├── backend/
│   ├── firebase-config.js     # Firebase configuration
│   └── application-forms.js   # Website form integration script
├── index.html                 # Main website
├── script.js                  # Website JavaScript
├── styles.css                 # Website styles
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `crestfield-academy`
3. Enable the following services:
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Create database in production mode
   - **Storage** → Enable for file uploads

4. Get your Firebase config:
   - Project Settings → General → Your apps → Web app
   - Copy the configuration values

### 2. Environment Configuration

1. Copy `.env.local.example` to `.env.local`:
```bash
cd admin-dashboard
cp .env.local.example .env.local
```

2. Update `.env.local` with your values:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI API Key
OPENAI_API_KEY=sk-your_openai_api_key

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Crestfield Academy <noreply@crestfieldacademy.com>

# Admin Email
ADMIN_EMAIL=hrcrestfieldschool@gmail.com
```

### 3. Install Dependencies

```bash
cd admin-dashboard
npm install
```

### 4. Create Admin User

1. Start the development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000/login`

3. In Firebase Console → Authentication → Users → Add user:
   - Email: `hrcrestfieldschool@gmail.com`
   - Password: (create a secure password)

### 5. Website Integration

Add Firebase SDK to your main website (`index.html`):

```html
<!-- Add before closing body tag -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-storage-compat.js"></script>
<script src="backend/application-forms.js"></script>
```

Update the Firebase config in `backend/application-forms.js` with your actual values.

### 6. Deploy

#### Option A: Vercel (Recommended)
```bash
npm install -g vercel
cd admin-dashboard
vercel --prod
```

#### Option B: Self-hosted
```bash
npm run build
npm start
```

## 📱 Using the Dashboard

### Viewing Applications
1. Log in at `/login`
2. Dashboard shows real-time statistics
3. Click "All Applications" to see full list
4. Use filters to find specific applications
5. Click "View" to see application details

### AI Analysis
1. Open any application detail page
2. Click "Run Analysis" button
3. View AI-generated insights:
   - Suitability score (1-10)
   - Recommended category
   - Strengths and concerns
   - Interview questions

### Managing Status
- **Pending** → New applications awaiting review
- **Approved** → Applications that passed review
- **Rejected** → Applications that didn't meet criteria

### Notifications
- Email notifications are sent automatically when applications are submitted
- Configure WhatsApp notifications in the notification API route

## 🔒 Security

- All routes are protected by Firebase Authentication
- File uploads are validated and stored securely
- API routes use environment variables for sensitive data
- CORS is configured for production deployment

## 📊 Database Schema

### Collections

**applications**
```javascript
{
  id: string,
  type: 'student' | 'teacher' | 'coding' | 'homeschool' | 'contact' | 'consultation',
  fullName: string,
  email: string,
  phone: string,
  program?: string,
  message?: string,
  status: 'pending' | 'approved' | 'rejected',
  reviewed: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  aiAnalysis?: {
    suitabilityScore: number,
    recommendedCategory: string,
    strengths: string[],
    concerns: string[],
    interviewRecommendation: string,
    nextSteps: string[]
  },
  // Teacher-specific fields
  specialization?: string,
  experience?: number,
  qualifications?: string,
  certifications?: string,
  curriculum?: string,
  coverLetter?: string,
  cvUrl?: string,
  photoUrl?: string,
  linkedin?: string,
  portfolio?: string
}
```

**notifications**
```javascript
{
  id: string,
  title: string,
  message: string,
  type: string,
  applicationId?: string,
  read: boolean,
  createdAt: timestamp
}
```

**subscriptions**
```javascript
{
  email: string,
  subscribedAt: string,
  source: string
}
```

## 🛟 Support

### Contact Information
- **Location**: Ruiru, Kiambu, Kenya
- **Phone**: +254 758 219 179
- **Email**: hrcrestfieldschool@gmail.com

### Technical Issues
For technical support with the application management system, contact the development team.

## 📄 License

This project is proprietary software developed for Crestfield International Academy.

---

Built with ❤️ for Crestfield International Academy
Inspiring Future Leaders Through World-Class Education