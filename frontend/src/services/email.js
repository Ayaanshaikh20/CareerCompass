import emailjs from "@emailjs/browser";

const templateID = import.meta.env.VITE_TEMPLATE_KEY;
const serviceID = import.meta.env.VITE_SERVICE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

class emailService {
  sendEmail(templateParams) {
    emailjs.send(serviceID, templateID, templateParams, publicKey);
  }
};

export default emailService
