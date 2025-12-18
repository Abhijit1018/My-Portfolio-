// ===== EMAILJS CONFIGURATION =====
// Replace these with your actual EmailJS credentials from https://www.emailjs.com/

const EMAILJS_CONFIG = {
    // Your EmailJS Public Key (from Dashboard > Account > API Keys)
    publicKey: 'YOUR_PUBLIC_KEY',
    
    // Your EmailJS Service ID (from Dashboard > Email Services)
    serviceId: 'YOUR_SERVICE_ID',
    
    // Your EmailJS Template ID (from Dashboard > Email Templates)
    templateId: 'YOUR_TEMPLATE_ID'
};

// ===== EMAILJS FORM HANDLER =====
class EmailJSHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || 
            EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
            EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID') {
            console.warn('EmailJS is not configured. Please update emailjs-config.js with your credentials.');
            return;
        }

        // Initialize EmailJS with public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded. Please include the EmailJS CDN script.');
        }
    }

    async sendEmail(formData) {
        if (!this.isInitialized) {
            throw new Error('EmailJS is not initialized. Please check your configuration.');
        }

        try {
            console.log('Sending email via EmailJS...');
            
            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'abhijeetrathore104@gmail.com' // Your email address
                }
            );

            console.log('Email sent successfully:', response);
            return {
                success: true,
                message: 'Thank you! Your message has been sent successfully.'
            };

        } catch (error) {
            console.error('EmailJS error:', error);
            return {
                success: false,
                message: 'Sorry, there was an error sending your message. Please try again or email me directly.',
                error: error
            };
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        return {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
    }
}

// Export for use in main.js
window.EmailJSHandler = EmailJSHandler;
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
