import { useNavigate, Button, Typography } from "../shared/imports";
import { compass } from "../shared/icons";

const Home = () => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  const redirectDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className='min-h-screen flex flex-col bg-white'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20 px-6 md:px-20 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Your Job Hunt, Organized.</h1>
        <p className='text-lg md:text-xl max-w-2xl mx-auto'>
          Career Compass helps you track job applications, follow up with ease, and never lose sight of your career goals.
        </p>
        <div className='mt-8 flex justify-center space-x-4'>
          <Button
            size='medium'
            variant='contained'
            sx={{
              bgcolor: "white",
              color: "blue",
            }}
            onClick={() => redirectDashboard()}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-6 md:px-20 bg-gray-50'>
        <h2 className='text-3xl font-bold text-center mb-12'>Why Career Compass?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 text-center'>
          <div className='bg-white p-6 rounded-xl shadow hover:shadow-md transition'>
            <i className='fas fa-briefcase text-blue-600 text-3xl mb-4'></i>
            <h3 className='text-xl font-semibold mb-2'>Track Applications</h3>
            <p className='text-gray-600'>Log job links, statuses, and deadlines in one place.</p>
          </div>
          <div className='bg-white p-6 rounded-xl shadow hover:shadow-md transition'>
            <i className='fas fa-bell text-blue-600 text-3xl mb-4'></i>
            <h3 className='text-xl font-semibold mb-2'>Get Reminders</h3>
            <p className='text-gray-600'>Set follow-up dates so you never miss an opportunity.</p>
          </div>
          <div className='bg-white p-6 rounded-xl shadow hover:shadow-md transition'>
            <i className='fas fa-chart-line text-blue-600 text-3xl mb-4'></i>
            <h3 className='text-xl font-semibold mb-2'>Visual Insights</h3>
            <p className='text-gray-600'>See your application progress and trends at a glance.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-16 px-6 md:px-20 bg-white text-center'>
        <h2 className='text-3xl font-bold mb-12'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          <div className='flex flex-col items-center'>
            <div className='bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-xl font-bold'>1</div>
            <h3 className='text-xl font-semibold mb-2'>Add Jobs</h3>
            <p className='text-gray-600 max-w-xs'>Paste the job link, set your application status, and keep it stored securely.</p>
          </div>
          <div className='flex flex-col items-center'>
            <div className='bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-xl font-bold'>2</div>
            <h3 className='text-xl font-semibold mb-2'>Stay Notified</h3>
            <p className='text-gray-600 max-w-xs'>Set reminders for follow-ups and receive timely alerts.</p>
          </div>
          <div className='flex flex-col items-center'>
            <div className='bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-xl font-bold'>3</div>
            <h3 className='text-xl font-semibold mb-2'>Track Progress</h3>
            <p className='text-gray-600 max-w-xs'>View insights on your application history to identify trends and opportunities.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16 px-6 md:px-20 bg-gray-50 text-center'>
        <h2 className='text-3xl font-bold mb-12'>What Users Are Saying</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-700 italic'>"Career Compass helped me organize 30+ job applications with ease. No more spreadsheets!"</p>
            <h4 className='text-blue-600 font-semibold mt-4'>– Priya S.</h4>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-700 italic'>"The reminders are a game changer. I followed up and landed my current role!"</p>
            <h4 className='text-blue-600 font-semibold mt-4'>– Rohan M.</h4>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-700 italic'>"Simple UI, powerful features. I recommend it to all job seekers."</p>
            <h4 className='text-blue-600 font-semibold mt-4'>– Anjali T.</h4>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 px-6 md:px-20 bg-white text-center'>
        <h2 className='text-3xl font-bold mb-10'>Frequently Asked Questions</h2>
        <div className='max-w-4xl mx-auto text-left space-y-6'>
          <div>
            <h4 className='font-semibold text-lg text-blue-600'>Is Career Compass free?</h4>
            <p className='text-gray-700'>Yes! The basic features are completely free to use. Premium features may be introduced later.</p>
          </div>
          <div>
            <h4 className='font-semibold text-lg text-blue-600'>Can I track multiple jobs at once?</h4>
            <p className='text-gray-700'>Absolutely. You can add as many job links as you want, with statuses and notes for each.</p>
          </div>
          <div>
            <h4 className='font-semibold text-lg text-blue-600'>Do I need to install anything?</h4>
            <p className='text-gray-700'>Nope — Career Compass works right in your browser.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className='py-16 px-6 md:px-20 bg-blue-600 text-white text-center'>
        <h2 className='text-3xl font-bold mb-4'>Ready to Take Control of Your Job Hunt?</h2>
        <p className='text-lg mb-8'>Join Career Compass today and never lose track of an opportunity again.</p>
        <Button
          size='large'
          variant='contained'
          onClick={() => {
            redirectDashboard();
          }}
          sx={{ bgcolor: "white", color: "blue" }}
        >
          Get Started Now
        </Button>
      </section>

      {/* Call to Action */}
      <section className='py-16 px-6 md:px-20 text-center'>
        <h2 className='text-3xl font-bold mb-6'>Stay on Track. Land Your Dream Job.</h2>
        <p className='text-gray-700 max-w-2xl mx-auto mb-8'>
          Career Compass makes job tracking easy, so you can focus on preparing, applying, and succeeding.
        </p>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8 mt-auto'>
        <div className='container mx-auto text-center space-y-4'>
          <div className='flex w-full justify-center items-center'>
            <Typography variant='h6' component='div' className='text-gray-400 font-semibold'>
              Career C
            </Typography>
            <img src={compass} alt='compass_logo' className='h-4 w-4' />
            <Typography variant='h6' component='div' className='text-gray-400 font-semibold'>
              mpass
            </Typography>
          </div>
          <p className='text-gray-400 text-sm'>Your personal assistant for job application tracking.</p>
          <div className='flex justify-center space-x-6 text-sm'>
            <a href='#' className='text-gray-400 hover:text-white'>
              Privacy Policy
            </a>
            <a href='#' className='text-gray-400 hover:text-white'>
              Terms
            </a>
            <a href='#' className='text-gray-400 hover:text-white'>
              Contact
            </a>
          </div>
          <p className='text-xs text-gray-500 mt-4'>&copy; {new Date().getFullYear()} Career Compass. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;
