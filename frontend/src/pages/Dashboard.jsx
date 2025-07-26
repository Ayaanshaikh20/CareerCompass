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
} from "../shared/imports";

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

  const dateFrequency = applications && applications.reduce((acc, item) => {
    const month = moment(item.appliedDate).format("DD-MMM-YYYY");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) || [];

  const monthFrequency = applications.reduce((acc, item) => {
    const month = moment(item.appliedDate).format("MMM-YYYY");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) || [];

  // Prepare chart data based on real applications
  const dateLabels = Object.keys(dateFrequency);
  const dateCounts = Object.values(dateFrequency);
  const monthLabels = Object.keys(monthFrequency);
  const monthCounts = Object.values(monthFrequency);

  const statusCounts = {
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  const dateLineData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Applications",
        data: dateCounts,
        borderColor: "rgb(99, 102, 241)",
        tension: 0,
      },
    ],
  };
  const monthLineData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Applications",
        data: monthCounts,
        borderColor: "rgb(99, 102, 241)",
        tension: 0,
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
    <div className=' space-y-5'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white border shadow rounded-lg p-6 text-center'>
          <p className='text-5xl font-bold text-blue-600'>{applications.length}</p>
          <p className='text-gray-600 mt-2'>Total Applications</p>
        </div>
        <div className='bg-white border shadow rounded-lg p-6 text-center'>
          <p className='text-5xl font-bold text-yellow-500'>{statusCounts.pending}</p>
          <p className='text-gray-600 mt-2'>Pending</p>
        </div>
        <div className='bg-white border shadow rounded-lg p-6 text-center'>
          <p className='text-5xl font-bold text-green-500'>{statusCounts.approved}</p>
          <p className='text-gray-600 mt-2'>Approved</p>
        </div>
        <div className='bg-white border shadow rounded-lg p-6 text-center'>
          <p className='text-5xl font-bold text-red-500'>{statusCounts.rejected}</p>
          <p className='text-gray-600 mt-2'>Rejected</p>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='bg-white border shadow rounded-lg p-3 h-[350px]'>
          <h2 className='text-lg font-semibold'>Application Trends (Date wise)</h2>
          <div className=' w-full h-full flex items-center justify-center'>
            <div className='h-[250px] w-full'>
              <Line
                data={dateLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        stepSize: 1,
                        precision: 0,
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className='bg-white border shadow rounded-lg p-3 h-[350px]'>
          <h2 className='text-lg font-semibold'>Application Trends (Month wise)</h2>
          <div className=' w-full h-full flex items-center justify-center'>
            <div className='h-[250px] w-full'>
              <Line
                data={monthLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        stepSize: 1,
                        precision: 0,
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className='bg-white border shadow rounded-lg p-3 h-[350px]'>
          <h2 className='text-lg font-semibold'>Application Status</h2>
          <div className='w-full h-full flex items-center justify-center'>
            <div className='w-[350px] h-[250px]'>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
