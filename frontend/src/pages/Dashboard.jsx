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
  Chip,
  AppliedJobs
} from "../shared/Imports";

import * as ScrollArea from "@radix-ui/react-scroll-area";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, ToolTip, Legend);

const Dashboard = () => {
  const { user_id } = JSON.parse(localStorage.getItem("user"));
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(`/api/applications?user_id=${user_id}`);
      const { status, applications } = response.data;
      if (status === 200) {
        setApplications(applications);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      if (!error.customSessionExpired) {
        toast.error(message || "Error fetching applications");
      }
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
        data: Array.from(
          new Set(applications.map((app) => app.platform))
        ).map(
          (platform) =>
            applications.filter((app) => app.platform === platform).length
        ),
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
          precision: 0,   // ✅ removes decimals
          stepSize: 1,    // ✅ counts only whole numbers
        },
      },
    },
  };


  return (
    <div className="bg-background pt-12 p-6 text-textPrimary min-h-screen">
      <ScrollArea.Root className="w-full h-full rounded overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          {/* Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-border shadow rounded-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-textPrimary border-b-2">Application Overview</h2>
              <ul className="space-y-3">
                {[
                  { label: "Total Applications", value: applications.length, color: "text-primary" },
                  { label: "Pending", value: statusCounts.pending, color: "text-info" },
                  { label: "Approved", value: statusCounts.approved, color: "text-success" },
                  { label: "Rejected", value: statusCounts.rejected, color: "text-danger" },
                ].map(({ label, value, color }, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-none last:pb-0"
                  >
                    <Chip className="text-sm text-textSecondary" variant="filled" label={label} size="small" />
                    <span className={`text-base font-semibold ${color}`}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Application history */}
            <div className="bg-surface space-y-4 border border-border shadow rounded-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-textPrimary border-b-2">Applications Over Time</h2>
              {/* Scrollable area after 3 items */}
              <div className="max-h-64 pr-3 overflow-y-auto custom-scrollbar">
                {applications.length > 0 ? (
                  applications.map((app, idx) => (
                    <div
                      key={idx}
                      className="flex items-center my-3 justify-between border border-2 bg-surface transition-colors rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:bg-accent/20 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-textPrimary">{app.role}</span>
                        <span className="text-xs text-textSecondary">{app.employer}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-medium text-textPrimary">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-textSecondary">Applied Date</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-500 text-sm py-10">
                    No applications found
                  </div>
                )}
              </div>
            </div>
            {/* Application history */}
            <div className="bg-surface space-y-4 border border-border shadow rounded-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-textPrimary border-b-2">
                Frequent Platforms
              </h2>
              {/* Make the chart fill the card space */}
              <div className="w-full h-56">
                <Line data={frequentPlatformsData} options={{ maintainAspectRatio: false, ...frequentPlatformsOptions }} />
              </div>
            </div>
            {/* Complete Profile */}
            <div className="bg-surface border border-border shadow rounded-sm p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-textPrimary border-b-2">Complete Your Profile</h2>
                <p className="text-textSecondary text-sm mb-4">
                  A complete profile increases your chances of getting noticed by employers. Add more details to stand out!
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <p className="text-textPrimary">Add a profile picture</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <p className="text-textPrimary">Complete your bio</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <p className="text-textPrimary">Add your education</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                    <p className="text-textPrimary">Add your experience</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primaryHover transition">
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
          {/* Applied Jobs */}
          <AppliedJobs fetchApplications={fetchApplications} setApplications={setApplications} applications={applications} />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};

export default Dashboard;
