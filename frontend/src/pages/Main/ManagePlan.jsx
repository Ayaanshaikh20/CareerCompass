import { useState, useEffect, axiosInstance, toast } from "../../shared/Imports";
import { AutoAwesomeIcon } from "../../shared/Icons";
import CheckIcon from "@mui/icons-material/Check";

const ManagePlan = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [analysesUsed, setAnalysesUsed] = useState(0);
  const user_id = localStorage.getItem("uid");

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await axiosInstance.get(`/fetch-user?userId=${user_id}`);
      const { userDetails } = response.data;
      setCurrentPlan(userDetails.plan || null);
      setAnalysesUsed(userDetails.analysesUsed || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const plans = [
    {
      name: "FREE",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      analyses: 5,
      features: [
        "5 resume analyses per month",
        "Job description matching",
        "Basic skill recommendations",
        "Application tracking",
        "Document storage (5 files)",
        "Email support",
      ],
      buttonText: "Current Plan",
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800",
      borderColor: "border-gray-300 dark:border-gray-600",
    },
    // {
    //   name: "PRO",
    //   price: "$9.99",
    //   period: "per month",
    //   description: "For serious job seekers",
    //   analyses: 50,
    //   popular: true,
    //   features: [
    //     "50 resume analyses per month",
    //     "Advanced AI insights",
    //     "Priority email support",
    //     "Custom resume templates",
    //     "Interview preparation tips",
    //     "Application analytics",
    //     "Document storage (50 files)",
    //     "Export reports (PDF)",
    //   ],
    //   buttonText: "Upgrade to Pro",
    //   gradient: "from-blue-500 to-indigo-600",
    //   bgGradient: "from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800",
    //   borderColor: "border-blue-300 dark:border-blue-700",
    // },
    // {
    //   name: "PREMIUM",
    //   price: "$19.99",
    //   period: "per month",
    //   description: "For professionals and agencies",
    //   analyses: 200,
    //   features: [
    //     "200 resume analyses per month",
    //     "Unlimited job tracking",
    //     "Dedicated account manager",
    //     "API access",
    //     "White-label reports",
    //     "Team collaboration (5 users)",
    //     "Unlimited document storage",
    //     "Priority phone support",
    //     "Custom integrations",
    //   ],
    //   buttonText: "Upgrade to Premium",
    //   gradient: "from-purple-500 to-pink-600",
    //   bgGradient: "from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800",
    //   borderColor: "border-purple-300 dark:border-purple-700",
    // },
  ];

  const handleUpgrade = (planName) => {
    if (planName === currentPlan) return;
    toast.success(`Redirecting to payment for ${planName} plan...`);
    // Add payment integration logic here
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 text-gray-900 dark:text-gray-100 font-sans min-h-full pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-base sm:text-lg md:text-xl font-bold mb-1">
          Manage Subscription
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
          Choose the plan that works best for you
        </p>
      </div>

      {/* Current Usage Banner */}
      {currentPlan && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Your Current Plan:</span>
                  <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs font-bold uppercase">
                    {currentPlan}
                  </span>
                </div>
                <p className="text-xs text-blue-100">
                  You've used {analysesUsed} of {plans.find(p => p.name === currentPlan)?.analyses || 0} resume analyses this month
                </p>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">
                  {analysesUsed}
                  <span className="text-sm font-normal opacity-80"> / {plans.find(p => p.name === currentPlan)?.analyses || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name;
            
            return (
              <div
                key={plan.name}
                className={`relative bg-gradient-to-br ${plan.bgGradient} border-2 ${
                  isCurrentPlan ? "border-green-500 dark:border-green-600" : plan.borderColor
                } rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <CheckIcon sx={{ fontSize: 12 }} />
                      CURRENT
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        / {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mb-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckIcon className="text-green-600 dark:text-green-400 mt-0.5" sx={{ fontSize: 16 }} />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isCurrentPlan
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                        : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl hover:scale-105`
                    }`}
                  >
                    {isCurrentPlan ? plan.buttonText : plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Can I cancel anytime?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                What happens when I reach my analysis limit?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                You can upgrade to a higher plan anytime. Your limit will reset at the beginning of each billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Is there a refund policy?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We offer a 14-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePlan;
