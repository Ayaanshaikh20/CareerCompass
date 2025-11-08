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

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1", // Tailwind slate-300
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155" }, // Tailwind slate-700
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          color: "#cbd5e1",
        },
        grid: { color: "#334155" },
      },
    },
  };

  const dateLineData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Applications",
        data: dateCounts,
        borderColor: "#6366f1", // Tailwind indigo-500
        backgroundColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  const monthLineData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Applications",
        data: monthCounts,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
        backgroundColor: ["#facc15", "#22c55e", "#ef4444"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="bg-zinc-900 pt-16 p-6 text-white min-h-screen">
      <ScrollArea.Root className="w-full h-full rounded overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Applications", value: applications.length, color: "text-indigo-400" },
              { label: "Pending", value: statusCounts.pending, color: "text-yellow-400" },
              { label: "Approved", value: statusCounts.approved, color: "text-green-400" },
              { label: "Rejected", value: statusCounts.rejected, color: "text-red-400" },
            ].map(({ label, value, color }, idx) => (
              <div
                key={idx}
                className="bg-zinc-800 border border-zinc-700 shadow rounded-xl p-6 text-center"
              >
                <p className={`text-5xl font-bold ${color}`}>{value}</p>
                <p className="text-zinc-400 mt-2">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <div className="bg-zinc-800 border border-zinc-700 shadow rounded-lg p-4 h-[350px]">
              <h2 className="text-lg font-semibold mb-2">Application Trends (Date wise)</h2>
              <div className="h-[250px] w-full">
                <Line data={dateLineData} options={commonChartOptions} />
              </div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 shadow rounded-lg p-4 h-[350px]">
              <h2 className="text-lg font-semibold mb-2">Application Trends (Month wise)</h2>
              <div className="h-[250px] w-full">
                <Line data={monthLineData} options={commonChartOptions} />
              </div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 shadow rounded-lg p-4 h-[350px]">
              <h2 className="text-lg font-semibold mb-2">Application Status</h2>
              <div className="h-[250px] w-full flex justify-center items-center">
                <div className="w-[300px] h-[250px]">
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: "#cbd5e1",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
};

export default Dashboard;
