import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import axios from 'axios';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email notification
export async function POST(request) {
  try {
    const { type, applicationData, adminEmail } = await request.json();

    const transporter = createTransporter();

    // Email templates based on application type
    const emailTemplates = {
      student: {
        subject: `🎓 New Student Application - ${applicationData.fullName}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0b4f8f 0%, #3aa0ec 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">New Student Application</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Crestfield International Academy</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <h2 style="color: #1e293b; margin-top: 0;">${applicationData.fullName}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${applicationData.email}</p>
                <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${applicationData.phone}</p>
                <p style="margin: 8px 0;"><strong>📚 Program:</strong> ${applicationData.program}</p>
                <p style="margin: 8px 0;"><strong>📅 Applied:</strong> ${new Date(applicationData.createdAt?.toDate()).toLocaleString('en-KE')}</p>
              </div>
              
              ${applicationData.message ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #64748b; margin-top: 0; font-size: 14px;">MESSAGE</h3>
                  <p style="color: #1e293b; line-height: 1.6;">${applicationData.message}</p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${applicationData.id}" 
                   style="background: #0b4f8f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                   View Application
                </a>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from Crestfield Academy Application Management System</p>
            </div>
          </div>
        `
      },
      teacher: {
        subject: `👨‍🏫 New Teacher Application - ${applicationData.fullName} (${applicationData.specialization})`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #051e35 0%, #0b4f8f 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">New Teacher Application</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Crestfield International Academy</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <h2 style="color: #1e293b; margin-top: 0;">${applicationData.fullName}</h2>
              <p style="color: #64748b; margin: 5px 0 20px 0;">${applicationData.specialization} Teacher</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${applicationData.email}</p>
                <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${applicationData.phone}</p>
                <p style="margin: 8px 0;"><strong>🎓 Qualification:</strong> ${applicationData.qualifications}</p>
                <p style="margin: 8px 0;"><strong>💼 Experience:</strong> ${applicationData.experience} years</p>
                <p style="margin: 8px 0;"><strong>📅 Applied:</strong> ${new Date(applicationData.createdAt?.toDate()).toLocaleString('en-KE')}</p>
              </div>
              
              ${applicationData.coverLetter ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #64748b; margin-top: 0; font-size: 14px;">COVER LETTER</h3>
                  <p style="color: #1e293b; line-height: 1.6;">${applicationData.coverLetter.substring(0, 300)}...</p>
                </div>
              ` : ''}
              
              ${applicationData.cvUrl ? `
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${applicationData.cvUrl}" 
                     style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
                     📄 Download CV
                  </a>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${applicationData.id}" 
                   style="background: #0b4f8f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                   View Full Application
                </a>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from Crestfield Academy Application Management System</p>
            </div>
          </div>
        `
      },
      coding: {
        subject: `💻 New Coding Course Request - ${applicationData.fullName}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">New Coding Course Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Crestfield International Academy</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <h2 style="color: #1e293b; margin-top: 0;">${applicationData.fullName}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${applicationData.email}</p>
                <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${applicationData.phone}</p>
                <p style="margin: 8px 0;"><strong>💻 Course:</strong> ${applicationData.program}</p>
                <p style="margin: 8px 0;"><strong>📅 Applied:</strong> ${new Date(applicationData.createdAt?.toDate()).toLocaleString('en-KE')}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${applicationData.id}" 
                   style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                   View Application
                </a>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from Crestfield Academy Application Management System</p>
            </div>
          </div>
        `
      },
      contact: {
        subject: `📩 New Contact Message - ${applicationData.fullName}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #22d3ee 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Crestfield International Academy</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
              <h2 style="color: #1e293b; margin-top: 0;">${applicationData.fullName}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${applicationData.email}</p>
                <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${applicationData.phone}</p>
                <p style="margin: 8px 0;"><strong>📅 Received:</strong> ${new Date(applicationData.createdAt?.toDate()).toLocaleString('en-KE')}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #64748b; margin-top: 0; font-size: 14px;">MESSAGE</h3>
                <p style="color: #1e293b; line-height: 1.6;">${applicationData.message}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${applicationData.email}" 
                   style="background: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                   Reply via Email
                </a>
              </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from Crestfield Academy Application Management System</p>
            </div>
          </div>
        `
      }
    };

    const template = emailTemplates[type] || emailTemplates.contact;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Crestfield Academy <noreply@crestfieldacademy.com>',
      to: adminEmail || process.env.ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully' 
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// WhatsApp notification (using Twilio or similar service)
export async function sendWhatsAppNotification(applicationData) {
  try {
    // This is a placeholder - implement with your WhatsApp Business API provider
    // Options: Twilio, WhatsApp Business API, Wati, etc.
    
    const message = `
🔔 New Application Alert

${applicationData.fullName} has applied for ${applicationData.type === 'teacher' ? 'teaching position' : applicationData.program}

📧 ${applicationData.email}
📱 ${applicationData.phone}

View: ${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${applicationData.id}
    `.trim();

    // Example with Twilio (uncomment and configure when ready)
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${process.env.WHATSAPP_PHONE_NUMBER}`,
      body: message
    });
    */

    console.log('WhatsApp notification prepared:', message);
    return { success: true, message: 'WhatsApp notification prepared' };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { success: false, error: error.message };
  }
}