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
    <div className="bg-slate-200/60 dark:bg-gray-950 p-3 sm:p-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Track your job applications and metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-5">
        {[
          { label: "Total Applications", value: applications.length, themeColor: "blue", trend: "this week", icon: <WorkOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: "Pending Review", value: statusCounts.pending, themeColor: "amber", trend: "Requires action", icon: <AccessTimeIcon sx={{ fontSize: 18 }} /> },
          { label: "Approved Offers", value: statusCounts.approved, themeColor: "green", trend: "Congratulations!", icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> },
          { label: "Rejected Applications", value: statusCounts.rejected, themeColor: "red", trend: "Keep applying", icon: <CancelOutlinedIcon sx={{ fontSize: 18 }} /> },
        ].map(({ label, value, themeColor, trend, icon }, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200/90 dark:border-gray-700/60 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white tracking-tight">{value}</p>
              <p className={`text-[10px] mt-1.5 font-semibold ${themeColor === "green" ? "text-emerald-600 dark:text-emerald-400" :
                  themeColor === "red" ? "text-slate-500 dark:text-gray-400" :
                    themeColor === "amber" ? "text-amber-600 dark:text-amber-400" :
                      "text-blue-600 dark:text-blue-400"
                }`}>{trend}</p>
            </div>
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${themeColor === "blue" ? "bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40" :
                themeColor === "amber" ? "bg-amber-50/90 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40" :
                  themeColor === "green" ? "bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40" :
                    "bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/40"
              }`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-slate-200/90 dark:border-gray-700/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Recent Applications</h2>
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 font-bold px-2.5 py-0.5 rounded-full">
              Latest {applications.slice(0, 10).length}
            </span>
          </div>

          {/* Table Headers */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-800/80 py-2 px-3 rounded-lg border border-slate-100 dark:border-gray-700/40 text-[9px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-gray-400 select-none mb-1">
            <span className="w-1/2">Role & Company</span>
            <span className="w-1/4 text-center">Applied Date</span>
            <span className="w-1/4 text-right">Status</span>
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar flex-1 pr-1">
            {applications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-gray-700/40">
                {applications.slice(0, 10).map((app, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-gray-700/40 px-3 rounded-lg transition-colors group"
                  >
                    <div className="w-1/2 min-w-0 pr-4">
                      <p className="font-bold text-xs text-slate-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.role}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 font-medium truncate">{app.employer} • {app.platform}</p>
                    </div>
                    <div className="w-1/4 text-center select-none">
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">{new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="w-1/4 flex justify-end select-none">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide border ${app.status === "approved" ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50" :
                          app.status === "rejected" ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/50" :
                            "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${app.status === "approved" ? "bg-emerald-500" :
                            app.status === "rejected" ? "bg-rose-500" :
                              "bg-amber-500"
                          }`} />
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 dark:text-gray-500 text-xs py-16 font-medium">No applications yet. Start applying!</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200/90 dark:border-gray-700/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Platform Usage</h2>
            <div className="flex gap-1 select-none">
              <span className="text-[9px] bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors">30D</span>
              <span className="text-[9px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 font-bold px-2 py-0.5 rounded cursor-pointer">ALL</span>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center">
            {applications.length > 0 ? (
              <Line data={frequentPlatformsData} options={frequentPlatformsOptions} />
            ) : (
              <div className="text-center text-slate-400 dark:text-gray-500 text-xs font-medium">No metrics to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
