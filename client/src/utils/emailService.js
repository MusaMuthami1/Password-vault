import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // You'll need to get this from EmailJS
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // You'll need to get this from EmailJS
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // You'll need to get this from EmailJS

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const templateParams = {
      to_email: email,
      otp_code: otp,
      app_name: 'CipherNest',
      message: `Your verification code is: ${otp}`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

// For now, let's create a simple mock function for testing
export const sendOTPEmailMock = async (email, otp) => {
  console.log(`📧 [MOCK] Sending OTP to ${email}: ${otp}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Show user-friendly notification
  alert(`📧 OTP sent to ${email}: ${otp}\n\n(This is a demo - in production, check your email)`);
  
  return { success: true };
};

export default {
  sendOTPEmail,
  sendOTPEmailMock
};
