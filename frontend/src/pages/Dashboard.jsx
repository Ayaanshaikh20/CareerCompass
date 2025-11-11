"use client";
import {
  customToggleLoading,
  axiosInstance,
  toast,
  useState,
  useEffect,
  Line,
  Pie,
  ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  ToolTip,
  moment,
  Chip
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

  const dateFrequency = applications.reduce((acc, item) => {
    const date = moment(item.appliedDate).format("DD-MMM-YYYY");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {}) || [];

  const monthFrequency = applications.reduce((acc, item) => {
    const month = moment(item.appliedDate).format("MMM-YYYY");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) || [];

  const dateLabels = Object.keys(dateFrequency);
  const dateCounts = Object.values(dateFrequency);
  const monthLabels = Object.keys(monthFrequency);
  const monthCounts = Object.values(monthFrequency);

  const statusCounts = {
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="bg-background pt-12 p-6 text-textPrimary min-h-screen">
      <ScrollArea.Root className="w-full h-full rounded overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          {/* Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-border shadow rounded-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-textPrimary">Application Overview</h2>
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
            <div className="bg-surface border border-border shadow rounded-sm p-5">
              <h2 className="text-lg font-semibold mb-4 text-textPrimary">Applications Over Time</h2>
              <div className="bg-background rounded-xl p-4 h-[300px] overflow-y-auto space-y-2">
                {applications.length > 0 ? (
                  applications.map((app, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-surface transition-colors rounded-lg px-4 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-100">{app.role}</span>
                        <span className="text-xs text-zinc-400">Role</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-medium text-zinc-100">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-zinc-400">Applied Date</span>
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
          </div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};

export default Dashboard;
