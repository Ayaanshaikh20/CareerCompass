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
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

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
      const response = await axiosInstance.get(`/applications`);
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
        label: "Applications",
        data: Array.from(new Set(applications.map((app) => app.platform))).map(
          (platform) => applications.filter((app) => app.platform === platform).length
        ),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        pointRadius: 3.5,
        pointHoverRadius: 5,
      },
    ],
  };

  const frequentPlatformsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.04)",
        },
        ticks: {
          precision: 0, // ✅ removes decimals
          stepSize: 1, // ✅ counts only whole numbers
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-50/50 dark:bg-gray-950 p-3 sm:p-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">Track your job applications and metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {[
          { label: "Total Applications", value: applications.length, themeColor: "blue", trend: "+4 this week", icon: <WorkOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: "Pending Review", value: statusCounts.pending, themeColor: "amber", trend: "Requires action", icon: <AccessTimeIcon sx={{ fontSize: 18 }} /> },
          { label: "Approved Offers", value: statusCounts.approved, themeColor: "green", trend: "Congratulations!", icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: "Rejected Applications", value: statusCounts.rejected, themeColor: "red", trend: "Keep applying", icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} /> },
        ].map(({ label, value, themeColor, trend, icon }, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/50 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-gray-405 dark:text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl sm:text-2xl font-extrabold mt-1 text-gray-900 dark:text-white tracking-tight">{value}</p>
              <p className={`text-[10px] mt-1.5 font-medium ${
                themeColor === "green" ? "text-green-600 dark:text-green-400" :
                themeColor === "red" ? "text-gray-400 dark:text-gray-500" :
                themeColor === "amber" ? "text-amber-600 dark:text-amber-500" :
                "text-blue-600 dark:text-blue-400"
              }`}>{trend}</p>
            </div>
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${
              themeColor === "blue" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" :
              themeColor === "amber" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" :
              themeColor === "green" ? "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400" :
              "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
            }`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/50 shadow-sm p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Recent Applications</h2>
            <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded">
              Latest {applications.slice(0, 10).length}
            </span>
          </div>

          {/* Table Headers */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 px-2 pb-2 border-b border-gray-100 dark:border-gray-700/50 select-none">
            <span className="w-1/2">Role & Company</span>
            <span className="w-1/4 text-center">Applied Date</span>
            <span className="w-1/4 text-right">Status</span>
          </div>
          
          <div className="max-h-80 overflow-y-auto custom-scrollbar flex-1 pr-1 mt-1">
            {applications.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
                {applications.slice(0, 10).map((app, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 px-2 rounded-lg transition-colors group"
                  >
                    <div className="w-1/2 min-w-0 pr-4">
                      <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.role}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{app.employer} • {app.platform}</p>
                    </div>
                    <div className="w-1/4 text-center select-none">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="w-1/4 flex justify-end select-none">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${
                        app.status === "approved" ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400" :
                        app.status === "rejected" ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400" :
                        "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-450"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          app.status === "approved" ? "bg-green-500" :
                          app.status === "rejected" ? "bg-red-500" :
                          "bg-amber-500"
                        }`} />
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-xs py-16">No applications yet. Start applying!</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-700/50 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Platform Usage</h2>
            <div className="flex gap-1 select-none">
              <span className="text-[9px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">30D</span>
              <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded cursor-pointer">ALL</span>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center">
            {applications.length > 0 ? (
              <Line data={frequentPlatformsData} options={frequentPlatformsOptions} />
            ) : (
              <div className="text-center text-gray-450 text-xs">No metrics to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
