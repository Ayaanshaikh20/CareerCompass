import { useNavigate, Button, Typography, Typewriter, useEffect } from "../shared/imports";
import { compass } from "../shared/icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    gsap.utils.toArray(".fade-in").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const redirectDashboard = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#171717] text-white font-sans">
      {/* Hero Section */}
      <section className="text-white py-28 px-6 md:px-20 text-center fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          <Typewriter
            words={["Your Job Hunt, Organized."]}
            loop={3}
            cursor
            cursorStyle="|"
            typeSpeed={75}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Career Compass helps you track job applications, follow up with ease, and never lose sight of your career goals.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Button
            onClick={redirectDashboard}
            size="3"
            variant="solid"
            style={{
              backgroundColor: "white",
              color: 'black',
              border: "1px solid #434345"
            }}
            className="text-black px-6 py-2 rounded-md text-sm font-semibold border border-gray-300"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 text-center fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-14">Why Career Compass?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-900">
          {[
            {
              icon: "fas fa-briefcase",
              title: "Track Applications",
              desc: "Log job links, statuses, and deadlines in one place.",
            },
            {
              icon: "fas fa-bell",
              title: "Get Reminders",
              desc: "Set follow-up dates so you never miss an opportunity.",
            },
            {
              icon: "fas fa-chart-line",
              title: "Visual Insights",
              desc: "See your application progress and trends at a glance.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <i className={`${item.icon} text-blue-600 text-3xl mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-20 text-center fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-300">
          {["Add Jobs", "Stay Notified", "Track Progress"].map((title, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-xl font-bold">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
              <p className="text-gray-400 max-w-xs">
                {i === 0
                  ? "Paste the job link, set your status, and store it securely."
                  : i === 1
                    ? "Set follow-up reminders and receive timely alerts."
                    : "See trends in your application journey at a glance."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-20 text-center fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-14">What Users Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
          {[
            {
              text: "Career Compass helped me organize 30+ job applications with ease.",
              author: "– Priya S.",
            },
            {
              text: "The reminders are a game changer. I followed up and landed my role!",
              author: "– Rohan M.",
            },
            {
              text: "Simple UI, powerful features. I recommend it to all job seekers.",
              author: "– Anjali T.",
            },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <p className="italic">"{t.text}"</p>
              <h4 className="text-blue-600 font-semibold mt-4">{t.author}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-20 text-center text-gray-300 fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto text-left space-y-6">
          <div>
            <h4 className="font-semibold text-lg text-blue-500">Is Career Compass free?</h4>
            <p>Yes! The core features are completely free. Premium tools may be introduced later.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-blue-500">Can I track multiple jobs?</h4>
            <p>Absolutely. Add as many job links as you need with notes and statuses.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-blue-500">Do I need to install anything?</h4>
            <p>Nope — Career Compass runs right in your browser with zero install.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 md:px-20 text-center fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control?</h2>
        <p className="text-lg text-gray-300 mb-8">
          Join Career Compass today and never lose track of an opportunity again.
        </p>
        <Button
          onClick={redirectDashboard}
          size="3"
          variant="solid"
          style={{
            backgroundColor: "white",
            color: 'black',
            border: "1px solid #434345"
          }}
          className="bg-white text-black px-6 py-2 rounded-md font-semibold border border-gray-300"
        >
          Get Started Now
        </Button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #434345",
      }} className="bg-[#121212] text-white py-12 mt-auto">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex justify-center items-center space-x-1">
            <Typography variant="h6" className="text-gray-400 font-semibold">
              Career C
            </Typography>
            <img src={compass} alt="compass_logo" className="h-4 w-4" />
            <Typography variant="h6" className="text-gray-400 font-semibold">
              mpass
            </Typography>
          </div>
          <p className="text-gray-400 text-sm">Your personal assistant for job application tracking.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            &copy; {new Date().getFullYear()} Career Compass. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
