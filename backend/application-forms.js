/**
 * Crestfield Online Homeschool - Application Forms Integration
 * This script integrates with the existing website forms and sends data to Firebase
 */

// Firebase SDK (add to your HTML)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "crestfield-academy.firebaseapp.com",
  projectId: "crestfield-academy",
  storageBucket: "crestfield-academy.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Application type definitions
const APPLICATION_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  CODING: 'coding',
  HOMESCHOOL: 'homeschool',
  CONTACT: 'contact',
  CONSULTATION: 'consultation'
};

// Main application submission handler
class ApplicationManager {
  constructor() {
    this.isSubmitting = false;
    this.init();
  }

  init() {
    this.attachFormListeners();
    this.setupFileUploads();
    this.setupRealTimeUpdates();
  }

  // Attach event listeners to all forms
  attachFormListeners() {
    // Student Application Form (Admissions/Contact)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleStudentApplication(e));
    }

    // Teacher Application Form
    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
      careerForm.addEventListener('submit', (e) => this.handleTeacherApplication(e));
    }

    // Coding Course Form
    const codingContactForm = document.getElementById('codingContactForm');
    if (codingContactForm) {
      codingContactForm.addEventListener('submit', (e) => this.handleCodingApplication(e));
    }

    // Consultation Form
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
      consultationForm.addEventListener('submit', (e) => this.handleConsultationApplication(e));
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubscription(e));
    }

    // Footer Newsletter Form
    const footerNewsletterForm = document.getElementById('footerNewsletterForm');
    if (footerNewsletterForm) {
      footerNewsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubscription(e));
    }
  }

  // Handle Student Application
  async handleStudentApplication(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const noteEl = document.getElementById('formNote');

    try {
      this.isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const applicationData = {
        type: APPLICATION_TYPES.STUDENT,
        fullName: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email') || '',
        program: formData.get('program'),
        message: formData.get('message') || '',
        source: window.location.href,
        userAgent: navigator.userAgent
      };

      // Submit to Firebase
      const result = await this.submitApplication(applicationData);

      if (result.success) {
        this.showSuccess(noteEl, 'Application submitted successfully! We will contact you soon.');
        form.reset();
        
        // Send notification to admin
        this.sendNotification(APPLICATION_TYPES.STUDENT, { ...applicationData, id: result.id });
      } else {
        this.showError(noteEl, 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Student application error:', error);
      this.showError(noteEl, 'An error occurred. Please try again or contact us directly.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
    }
  }

  // Handle Teacher Application
  async handleTeacherApplication(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const noteEl = document.getElementById('careerFormNote');
    const progressLabel = document.getElementById('careerProgressLabel');

    try {
      this.isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      // Update progress
      progressLabel.textContent = 'Application progress: 100%';

      // Upload files first
      const cvFile = formData.get('cv');
      const photoFile = formData.get('photo');
      let cvUrl = '';
      let photoUrl = '';

      if (cvFile && cvFile.size > 0) {
        cvUrl = await this.uploadFile(cvFile, `cvs/${Date.now()}_${cvFile.name}`);
      }

      if (photoFile && photoFile.size > 0) {
        photoUrl = await this.uploadFile(photoFile, `photos/${Date.now()}_${photoFile.name}`);
      }

      const applicationData = {
        type: APPLICATION_TYPES.TEACHER,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        specialization: formData.get('specialization'),
        experience: parseInt(formData.get('experience')) || 0,
        qualifications: formData.get('qualification'),
        certifications: formData.get('certifications') || '',
        curriculum: formData.get('curriculum'),
        cvUrl: cvUrl,
        photoUrl: photoUrl,
        coverLetter: formData.get('coverLetter'),
        linkedin: formData.get('linkedin') || '',
        portfolio: formData.get('portfolio') || '',
        source: window.location.href,
        userAgent: navigator.userAgent
      };

      // Submit to Firebase
      const result = await this.submitApplication(applicationData);

      if (result.success) {
        this.showSuccess(noteEl, 'Application submitted successfully! Our academic team will review your profile.');
        form.reset();
        progressLabel.textContent = 'Application progress: 0%';
        
        // Send notification to admin
        this.sendNotification(APPLICATION_TYPES.TEACHER, { ...applicationData, id: result.id });
      } else {
        this.showError(noteEl, 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Teacher application error:', error);
      this.showError(noteEl, 'An error occurred. Please try again or contact us directly.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Teacher Application';
    }
  }

  // Handle Coding Course Application
  async handleCodingApplication(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const noteEl = document.getElementById('codingFormNote');

    try {
      this.isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const applicationData = {
        type: APPLICATION_TYPES.CODING,
        fullName: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email') || '',
        program: formData.get('program'),
        message: formData.get('message') || '',
        source: window.location.href,
        userAgent: navigator.userAgent
      };

      // Submit to Firebase
      const result = await this.submitApplication(applicationData);

      if (result.success) {
        this.showSuccess(noteEl, 'Course enquiry sent! Our admissions team will help with schedules and options.');
        form.reset();
        
        // Send notification
        this.sendNotification(APPLICATION_TYPES.CODING, { ...applicationData, id: result.id });
      } else {
        this.showError(noteEl, 'Failed to send enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Coding application error:', error);
      this.showError(noteEl, 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Course Enquiry';
    }
  }

  // Handle Consultation Request
  async handleConsultationApplication(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const noteEl = document.getElementById('consultationNote');

    try {
      this.isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Requesting...';

      const applicationData = {
        type: APPLICATION_TYPES.CONSULTATION,
        fullName: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        consultationType: formData.get('consultationType'),
        program: formData.get('program'),
        preferredDate: formData.get('date'),
        preferredTime: formData.get('time'),
        message: formData.get('message') || '',
        source: window.location.href,
        userAgent: navigator.userAgent
      };

      // Submit to Firebase
      const result = await this.submitApplication(applicationData);

      if (result.success) {
        this.showSuccess(noteEl, 'Consultation request received! We will confirm your appointment soon.');
        form.reset();
        
        // Close modal if open
        const modal = document.getElementById('consultationModal');
        if (modal) {
          modal.classList.add('hidden');
          modal.setAttribute('aria-hidden', 'true');
        }
        
        // Send notification
        this.sendNotification(APPLICATION_TYPES.CONSULTATION, { ...applicationData, id: result.id });
      } else {
        this.showError(noteEl, 'Failed to request consultation. Please try again.');
      }
    } catch (error) {
      console.error('Consultation application error:', error);
      this.showError(noteEl, 'An error occurred. Please try again.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Consultation';
    }
  }

  // Handle Newsletter Subscription
  async handleNewsletterSubscription(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const noteEl = form.querySelector('.form-note');

    try {
      this.isSubmitting = true;
      submitBtn.disabled = true;

      const subscriptionData = {
        email: formData.get('email'),
        subscribedAt: new Date().toISOString(),
        source: window.location.href
      };

      // Add to subscriptions collection
      await db.collection('subscriptions').add(subscriptionData);

      this.showSuccess(noteEl, 'Thank you for subscribing!');
      form.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      this.showError(noteEl, 'Failed to subscribe. Please try again.');
    } finally {
      this.isSubmitting = false;
      submitBtn.disabled = false;
    }
  }

  // Submit application to Firebase
  async submitApplication(data) {
    try {
      const docRef = await db.collection('applications').add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        reviewed: false,
        aiAnalysis: null
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Firebase submission error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload file to Firebase Storage
  async uploadFile(file, path) {
    try {
      const storageRef = storage.ref(path);
      await storageRef.put(file);
      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('File upload error:', error);
      return '';
    }
  }

  // Send notification to admin
  async sendNotification(type, applicationData) {
    try {
      // Call our notification API
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          applicationData,
          adminEmail: 'hrcrestfieldschool@gmail.com'
        })
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  // Setup real-time updates
  setupRealTimeUpdates() {
    // Listen for new applications
    db.collection('applications')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            // Show toast notification for new application
            this.showToast('New application received!', 'info');
          }
        });
      });
  }

  // Setup file upload drag and drop
  setupFileUploads() {
    const fileDrops = document.querySelectorAll('.file-drop');
    fileDrops.forEach(drop => {
      const input = drop.querySelector('input[type="file"]');
      
      drop.addEventListener('dragover', (e) => {
        e.preventDefault();
        drop.classList.add('drag-over');
      });

      drop.addEventListener('dragleave', () => {
        drop.classList.remove('drag-over');
      });

      drop.addEventListener('drop', (e) => {
        e.preventDefault();
        drop.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          input.files = files;
          input.dispatchEvent(new Event('change'));
        }
      });

      drop.addEventListener('click', () => {
        input.click();
      });
    });
  }

  // Show success message
  showSuccess(element, message) {
    if (element) {
      element.textContent = message;
      element.className = 'form-note success';
      element.style.color = '#10b981';
    }
  }

  // Show error message
  showError(element, message) {
    if (element) {
      element.textContent = message;
      element.className = 'form-note error';
      element.style.color = '#ef4444';
    }
  }

  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ApplicationManager();
});

// Export for use in other scripts
window.ApplicationManager = ApplicationManager;
