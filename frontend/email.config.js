import emailjs from "@emailjs/browser";

emailjs.init({
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  blockHeadless: true,
  blockList: {
    watchVariable: "user_email",
  },
  limitRate: {
    id: "careercompass-email",
    throttle: 10000, // 1 request per 10s
  },
});

export default emailjs;
