import {
  customToggleLoading,
  useEffect,
  DatePicker,
  Select,
  axiosInstance,
  dayjs,
  toast,
  useState,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CustomTextField,
  AgGridReact,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "../../shared/Imports";
import {
  EditIcon,
  FaPlus,
  DeleteIcon,
  MoreVertIcon,
} from "../../shared/Icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ActionMenuCell = ({
  data,
  handleDeleteClick,
  viewEditApplication,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} sx={{ color: "#666", padding: "2px" }}>
        <MoreVertIcon sx={{ fontSize: "18px" }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
          },
        }}
        MenuListProps={{
          dense: true,
          disablePadding: true,
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            viewEditApplication(data);
          }}
          sx={{
            "&:hover": { bgcolor: "rgba(0,128,0,0.12)" },
            padding: "4px 12px",
            minHeight: "28px",
          }}
        >
          <ListItemIcon sx={{ minWidth: "28px" }}>
            <EditIcon fontSize="small" sx={{ color: "green" }} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ fontSize: "12px" }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleDeleteClick(data);
          }}
          sx={{
            color: "red",
            "&:hover": { bgcolor: "rgba(255,0,0,0.12)" },
            padding: "4px 12px",
            minHeight: "28px",
          }}
        >
          <ListItemIcon sx={{ minWidth: "28px", color: "red" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ fontSize: "12px" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: { bg: "bg-green-50 dark:bg-green-950/40", color: "text-green-700 dark:text-green-400", dot: "bg-green-500", label: "Approved" },
    rejected: { bg: "bg-red-50 dark:bg-red-950/40", color: "text-red-700 dark:text-red-400", dot: "bg-red-500", label: "Rejected" },
    pending: { bg: "bg-amber-50 dark:bg-amber-950/40", color: "text-amber-700 dark:text-amber-450", dot: "bg-amber-500", label: "Pending" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${config.bg} ${config.color} leading-none mt-1 select-none`}>
      <span className={`w-1 h-1 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppToDelete, setSelectedAppToDelete] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "appliedDate", direction: "desc" });
  const [currentStep, setCurrentStep] = useState(0);

  const defaultFormData = {
    role: "",
    appliedDate: "",
    interviewDate: "",
    package: "",
    employer: "",
    location: "",
    jobLink: "",
    experience: "",
    platform: "",
    jobDescription: "",
    status: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditApplication, setIsEditApplication] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.appliedDate)
      newErrors.appliedDate = "Applied date is required";
    if (!formData.package) newErrors.package = "Package is required";
    if (!formData.employer) newErrors.employer = "Employer is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.jobLink) newErrors.jobLink = "Job link is required";
    else if (!/^https?:\/\/.+/.test(formData.jobLink))
      newErrors.jobLink = "Enter a valid URL (https://...";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.jobDescription)
      newErrors.jobDescription = "Job description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrEditApplication = async () => {
    if (!validate()) return;

    const url = isEditApplication ? "/edit-application" : "/new-application";
    try {
      const response = await axiosInstance.post(url, formData);
      const { status, message } = response.data;
      if (status === 201 || status === 200) {
        toast.success(message);
        setFormData(defaultFormData);
        setOpen(false);
        setIsEditApplication(false);
        await fetchApplications();
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  const viewEditApplication = (application) => {
    setFormData(application);
    setIsEditApplication(true);
    setOpen(true);
  };

  const handleDeleteClick = (application) => {
    setSelectedAppToDelete(application);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppToDelete) return;

    try {
      const { id } = selectedAppToDelete;
      const response = await axiosInstance.delete(
        `/delete-application?application_id=${id}`,
      );
      const { status } = response.data;
      if (status === 200) {
        await fetchApplications();
        toast.success("Application deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedAppToDelete(null);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
      setDeleteDialogOpen(false);
    }
  };

  const clearDrawer = () => {
    setFormData(defaultFormData);
    setOpen(false);
    setIsEditApplication(false);
    setErrors({});
    setCurrentStep(0);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredApplications = (applications || []).filter((app) => {
    const query = quickFilterText.toLowerCase();
    return (
      app.role?.toLowerCase().includes(query) ||
      app.employer?.toLowerCase().includes(query) ||
      app.platform?.toLowerCase().includes(query) ||
      app.location?.toLowerCase().includes(query) ||
      app.status?.toLowerCase().includes(query)
    );
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === "package" || sortConfig.key === "experience") {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(
        `/applications`,
      );
      const { status, applications } = response.data;
      if (status === 200) {
        setApplications(applications || []);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="bg-gray-50/50 dark:bg-gray-950 p-3 sm:p-4 font-sans text-gray-900 dark:text-gray-100 min-h-full">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Applications</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
              Manage your job applications database
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
            <input
              type="text"
              placeholder="Search..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 text-xs border border-gray-250 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setFormData(defaultFormData);
                setIsEditApplication(false);
                setOpen(true);
              }}
              className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow w-full sm:w-auto whitespace-nowrap"
            >
              <FaPlus className="text-[10px]" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[calc(100vh-200px)] min-h-[450px]">
          {[
            { title: "Pending Review", status: "pending", bg: "bg-amber-500/5", border: "border-amber-200/60 dark:border-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
            { title: "Offers / Approved", status: "approved", bg: "bg-green-500/5", border: "border-green-200/60 dark:border-green-900/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
            { title: "Rejected", status: "rejected", bg: "bg-red-500/5", border: "border-red-200/60 dark:border-red-900/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
          ].map((col) => {
            const colApps = sortedApplications.filter((app) => app.status === col.status);
            return (
              <div key={col.status} className={`flex flex-col rounded-xl border ${col.border} ${col.bg} p-3 h-auto md:h-full overflow-hidden`}>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/40 dark:border-gray-700/40 select-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">{col.title}</span>
                  </div>
                  <span className="text-[10px] bg-white/80 dark:bg-gray-800/80 px-2 py-0.5 rounded-full font-bold shadow-sm border border-gray-100 dark:border-gray-750 text-gray-500 dark:text-gray-400">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-visible md:overflow-y-auto space-y-2.5 pr-0.5 custom-scrollbar">
                  {colApps.length > 0 ? (
                    colApps.map((app) => (
                      <div 
                        key={app.id} 
                        className="bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/60 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between"
                      >
                        {/* Actions Dropdown */}
                        <div className="absolute top-2 right-2">
                          <ActionMenuCell
                            data={app}
                            handleDeleteClick={handleDeleteClick}
                            viewEditApplication={viewEditApplication}
                          />
                        </div>

                        {/* Company & Role */}
                        <div className="pr-6">
                          <h4 className="font-extrabold text-[13px] text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {app.role}
                          </h4>
                          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {app.employer}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 text-[10px] text-gray-500 dark:text-gray-400">
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wider block text-[8px]">Applied</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {app.appliedDate ? dayjs(app.appliedDate).format("MMM D, YYYY") : "-"}
                            </span>
                          </div>
                          {app.interviewDate && (
                            <div>
                              <span className="font-bold text-gray-400 uppercase tracking-wider block text-[8px]">Interview</span>
                              <span className="font-medium text-amber-600 dark:text-amber-400">
                                {dayjs(app.interviewDate).format("MMM D, YYYY")}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wider block text-[8px]">Package</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{app.package} LPA</span>
                          </div>
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wider block text-[8px]">Experience</span>
                            <span className="font-medium text-gray-700 dark:text-gray-350">{app.experience} Yrs</span>
                          </div>
                        </div>

                        {/* Job Description Preview */}
                        {app.jobDescription && (
                          <p 
                            className="text-[10px] text-gray-400 dark:text-gray-500 mt-2.5 line-clamp-2 italic leading-relaxed border-t border-dashed border-gray-100 dark:border-gray-700/50 pt-2 cursor-help" 
                            title={app.jobDescription}
                          >
                            "{app.jobDescription}"
                          </p>
                        )}

                        {/* Footer Meta */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-100 dark:border-gray-700/50">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-650 dark:text-gray-300 text-[9px] font-semibold tracking-wide">
                            {app.platform}
                          </span>
                          {app.jobLink && (
                            <a
                              href={app.jobLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                            >
                              View Job
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 select-none border border-dashed border-gray-200/40 dark:border-gray-700/20 rounded-xl">
                      <span className="text-xs">Empty column</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "16px" }}>
            Delete Application
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "14px" }}>
              Are you sure you want to delete the application for{" "}
              <strong>{selectedAppToDelete?.role}</strong> at{" "}
              <strong>{selectedAppToDelete?.employer}</strong>? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Adding/Editing Application */}
        <Dialog
          open={open}
          onClose={clearDrawer}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              bgcolor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "16px", px: 3, pt: 2.5, pb: 1.5, borderBottom: "1px solid rgba(229, 231, 235, 0.5)", color: document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#111827" }}>
            {isEditApplication ? "Edit Application" : "New Application"}
          </DialogTitle>
          
          {/* Step Indicator Header */}
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-150 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30 select-none">
            {[
              { label: "Role Details", step: 0 },
              { label: "Dates & Status", step: 1 },
              { label: "Links & Context", step: 2 }
            ].map((stepItem, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                  idx === currentStep 
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20" 
                    : idx < currentStep 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {idx < currentStep ? "✓" : idx + 1}
                </span>
                <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  idx === currentStep ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-550"
                }`}>
                  {stepItem.label}
                </span>
                {idx < 2 && <span className="h-0.5 w-6 sm:w-10 bg-gray-200 dark:bg-gray-700 rounded" />}
              </div>
            ))}
          </div>

          <DialogContent sx={{ px: 3, py: 2.5, "&.MuiDialogContent-root": { pt: "12px" } }}>
            <div className="space-y-4">
              
              {/* Group 1: Position Details */}
              {currentStep === 0 && (
                <div className="border border-gray-150 dark:border-gray-700/60 rounded-xl p-3 bg-gray-50/20 dark:bg-gray-800/10 space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Position Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
                      <CustomTextField
                        value={formData.role}
                        handleChange={(e) => handleChange("role", e.target.value)}
                        placeholder="e.g., Software Engineer"
                      />
                      {errors.role && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.role}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Employer / Company</label>
                      <CustomTextField
                        name="employer"
                        value={formData.employer}
                        handleChange={(e) => handleChange("employer", e.target.value)}
                        placeholder="e.g., Google"
                      />
                      {errors.employer && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.employer}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Package (LPA)</label>
                      <CustomTextField
                        name="package"
                        type="number"
                        value={formData.package}
                        handleChange={(e) => handleChange("package", e.target.value)}
                        placeholder="e.g., 12"
                      />
                      {errors.package && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.package}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Required Experience (Years)</label>
                      <CustomTextField
                        name="experience"
                        value={formData.experience}
                        handleChange={(e) => handleChange("experience", e.target.value)}
                        type="number"
                        placeholder="e.g., 2"
                      />
                      {errors.experience && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.experience}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Group 2: Status & Tracking */}
              {currentStep === 1 && (
                <div className="border border-gray-150 dark:border-gray-700/60 rounded-xl p-3 bg-gray-50/20 dark:bg-gray-800/10 space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Status & Tracking</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Applied Date</label>
                      <input
                        type="date"
                        value={formData.appliedDate}
                        onChange={(e) => handleChange("appliedDate", e.target.value)}
                        max={dayjs().format("YYYY-MM-DD")}
                        className="w-full h-[32px] px-3 py-1 text-xs border border-gray-250 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.appliedDate && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.appliedDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Interview Date</label>
                      <input
                        type="date"
                        value={formData.interviewDate}
                        onChange={(e) => handleChange("interviewDate", e.target.value)}
                        min={formData.appliedDate || undefined}
                        className="w-full h-[32px] px-3 py-1 text-xs border border-gray-250 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Platform</label>
                      <select
                        value={formData.platform || ""}
                        onChange={(e) => handleChange("platform", e.target.value)}
                        className="w-full h-[32px] px-3 py-1 text-xs border border-gray-250 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>Select platform</option>
                        <option value="Linkedin">Linkedin</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Monster">Monster</option>
                        <option value="Workday">Workday</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.platform && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.platform}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formData.status || ""}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full h-[32px] px-3 py-1 text-xs border border-gray-250 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>Select status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.status}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Group 3: Links & Context */}
              {currentStep === 2 && (
                <div className="border border-gray-150 dark:border-gray-700/60 rounded-xl p-3 bg-gray-50/20 dark:bg-gray-800/10 space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Links & Context</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Post Link</label>
                      <CustomTextField
                        name="jobLink"
                        value={formData.jobLink}
                        handleChange={(e) => handleChange("jobLink", e.target.value)}
                        placeholder="https://company.com/careers/job..."
                      />
                      {errors.jobLink && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.jobLink}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Location / Address</label>
                      <CustomTextField
                        name="location"
                        value={formData.location}
                        handleChange={(e) => handleChange("location", e.target.value)}
                        placeholder="City, Country or Remote"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Description</label>
                      <CustomTextField
                        name="jobDescription"
                        value={formData.jobDescription}
                        rows={3}
                        isMultiline={true}
                        handleChange={(e) => handleChange("jobDescription", e.target.value)}
                        placeholder="Paste key responsibilities or details here..."
                      />
                      {errors.jobDescription && (
                        <p className="text-red-500 text-[10px] mt-0.5">{errors.jobDescription}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(229, 231, 235, 0.5)" }}>
            <button
              onClick={clearDrawer}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-auto"
            >
              Cancel
            </button>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button
                onClick={() => {
                  if (currentStep === 0) {
                    const newErrors = {};
                    if (!formData.role) newErrors.role = "Role is required";
                    if (!formData.employer) newErrors.employer = "Employer is required";
                    if (!formData.package) newErrors.package = "Package is required";
                    if (!formData.experience) newErrors.experience = "Experience is required";
                    if (Object.keys(newErrors).length > 0) {
                      setErrors(newErrors);
                      return;
                    }
                  }
                  if (currentStep === 1) {
                    const newErrors = {};
                    if (!formData.appliedDate) newErrors.appliedDate = "Applied date is required";
                    if (!formData.platform) newErrors.platform = "Platform is required";
                    if (!formData.status) newErrors.status = "Status is required";
                    if (Object.keys(newErrors).length > 0) {
                      setErrors(newErrors);
                      return;
                    }
                  }
                  setCurrentStep((prev) => prev + 1);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitOrEditApplication}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
              >
                {isEditApplication ? "Update" : "Add"}
              </button>
            )}
          </DialogActions>
        </Dialog>
      </section>
    </main>
  );
};

export default Applications;
