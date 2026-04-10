"use client";
import {
  customToggleLoading,
  axiosInstance,
  toast,
  useState,
  useEffect,
  Line,
  ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  ToolTip,
} from "../../shared/Imports";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, ToolTip, Legend);

const Dashboard = () => {
  const user_id = localStorage.getItem("uid");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(`/applications?user_id=${user_id}`);
      const { status, applications } = response.data;
      if (status === 200) {
        setApplications(applications);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  const statusCounts = {
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  //frequent platforms data for line chart
  const frequentPlatformsData = {
    labels: Array.from(new Set(applications.map((app) => app.platform))),
    datasets: [
      {
        label: "Frequent Platforms",
        data: Array.from(new Set(applications.map((app) => app.platform))).map((platform) => applications.filter((app) => app.platform === platform).length),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const frequentPlatformsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          precision: 0, // ✅ removes decimals
          stepSize: 1, // ✅ counts only whole numbers
        },
      },
    },
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-6 px-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 text-xs">Track your job applications at a glance</p>
      </div>

      {/* Stats Card */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Applications", value: applications.length, color: "from-blue-500 to-blue-600", icon: "📋" },
          { label: "Pending", value: statusCounts.pending, color: "from-amber-500 to-amber-600", icon: "⏳" },
          { label: "Approved", value: statusCounts.approved, color: "from-green-500 to-green-600", icon: "✅" },
          { label: "Rejected", value: statusCounts.rejected, color: "from-red-500 to-red-600", icon: "❌" },
        ].map(({ label, value, color, icon }, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${color} rounded-lg p-5 text-white shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">{label}</p>
                <p className="text-2xl font-bold mt-2">{value}</p>
              </div>
              <span className="text-3xl opacity-30">{icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Application history */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-3">Recent Applications</h2>
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {applications.length > 0 ? (
              applications.map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{app.role}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{app.employer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{new Date(app.appliedDate).toLocaleDateString()}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full" style={{
                      backgroundColor: app.status === "approved" ? "#d1fae5" : app.status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: app.status === "approved" ? "#065f46" : app.status === "rejected" ? "#7f1d1d" : "#92400e"
                    }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-12">No applications yet. Start applying!</div>
            )}
          </div>
        </div>

        {/* Frequent Platforms Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h2 className="text-lg font-bold mb-3">Platform Usage</h2>
          <div className="h-64">
            <Line data={frequentPlatformsData} options={{ maintainAspectRatio: false, ...frequentPlatformsOptions }} />
          </div>
        </div>
      </div>
    </div>
  );
};
    
export default Dashboard;
