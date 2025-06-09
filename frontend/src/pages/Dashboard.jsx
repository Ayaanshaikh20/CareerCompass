
const Dashboard = () => {
  return (
    <div className=" space-y-6">
      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl mt-2 font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Jobs Posted</h2>
          <p className="text-2xl mt-2 font-bold text-green-600">456</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold">Applications</h2>
          <p className="text-2xl mt-2 font-bold text-purple-600">789</p>
        </div>
      </div>

      {/* Row 2: Long card and two square cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Long card (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 h-48">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <p className="text-gray-500">Activity feed or graph can go here.</p>
        </div>

        {/* Two square cards (1/3 width stacked vertically on large screens) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 h-24">
            <h2 className="text-md font-semibold">Pending Approvals</h2>
            <p className="text-xl mt-1 font-bold text-red-500">12</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-24">
            <h2 className="text-md font-semibold">Messages</h2>
            <p className="text-xl mt-1 font-bold text-yellow-500">34</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;