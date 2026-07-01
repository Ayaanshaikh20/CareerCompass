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
    approved: { bg: "#DFFCF0", color: "#216E4E", label: "Approved" },
    rejected: { bg: "#FFECEB", color: "#AE2A19", label: "Rejected" },
    pending: { bg: "#FFF7D6", color: "#974F0C", label: "Pending" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <div
      style={{
        color: config.color,
        borderRadius: "3px",
        fontWeight: 500,
        fontSize: "12px",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {config.label}
    </div>
  );
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppToDelete, setSelectedAppToDelete] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");

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
  };

  const isDark = document.documentElement.classList.contains("dark");

  const columnDefs = [
    {
      width: 50,
      cellRenderer: (params) => (
        <ActionMenuCell
          data={params.data}
          handleDeleteClick={handleDeleteClick}
          viewEditApplication={viewEditApplication}
        />
      ),
      sortable: false,
      filter: false,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px" },
    },
    {
      headerName: "Company",
      field: "employer",
      flex: 1,
      minWidth: 120,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Role",
      field: "role",
      flex: 1,
      minWidth: 120,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 0.8,
      minWidth: 100,
      cellRenderer: (params) => <StatusBadge status={params.value} />,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Applied Date",
      field: "appliedDate",
      flex: 1,
      minWidth: 110,
      valueFormatter: (params) => {
        return params.value ? dayjs(params.value).format("DD MMM YYYY") : "-";
      },
      cellStyle: {
        paddingTop: "4px",
        paddingBottom: "4px",
        color: "#555",
        fontSize: "12px",
      },
    },
    {
      headerName: "Interview Date",
      field: "interviewDate",
      flex: 1,
      minWidth: 110,
      valueFormatter: (params) => {
        return params.value ? dayjs(params.value).format("DD MMM YYYY") : "-";
      },
      cellStyle: {
        paddingTop: "4px",
        paddingBottom: "4px",
        color: "#555",
        fontSize: "12px",
      },
    },
    {
      headerName: "Package (LPA)",
      field: "package",
      flex: 0.8,
      minWidth: 100,
      cellStyle: {
        paddingTop: "4px",
        paddingBottom: "4px",
        textAlign: "center",
        fontWeight: 500,
        fontSize: "12px",
      },
    },
    {
      headerName: "Experience",
      field: "experience",
      flex: 0.8,
      minWidth: 90,
      cellStyle: {
        paddingTop: "4px",
        paddingBottom: "4px",
        textAlign: "center",
        fontSize: "12px",
      },
    },
    {
      headerName: "Platform",
      field: "platform",
      flex: 0.8,
      minWidth: 90,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Location",
      field: "location",
      flex: 1,
      minWidth: 100,
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Job Link",
      field: "jobLink",
      flex: 0.8,
      minWidth: 80,
      cellRenderer: (params) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1890ff", fontSize: "12px", textDecoration: "underline" }}
        >
          {params.value ? "View Job" : "-"}
        </a>
      ),
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
    {
      headerName: "Description",
      field: "jobDescription",
      flex: 1.5,
      minWidth: 150,
      cellStyle: {
        paddingTop: "4px",
        paddingBottom: "4px",
        fontSize: "12px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      cellRenderer: (params) => (
        <div
          title={params.value}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {params.value || "-"}
        </div>
      ),
    },
  ];

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
    <main className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 font-sans text-gray-900 dark:text-gray-100 min-h-full">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">Applications</h1>
            <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs mt-1">
              Manage your job applications
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setFormData(defaultFormData);
                setIsEditApplication(false);
                setOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md whitespace-nowrap">
              <FaPlus className="text-xs sm:text-sm" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div
          className={isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"}
          style={{
            height: "calc(100vh - 250px)",
            minHeight: "400px",
            borderRadius: "4px",
            overflow: "hidden",
            fontFamily: "sans-serif",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
          }}
        >
          <AgGridReact
            rowData={applications}
            columnDefs={columnDefs}
            pagination={false}
            rowHeight={35}
            rowDragManaged={true}
            animateRows={true}
            headerHeight={36}
            defaultColDef={{
              sortable: true,
              filter: false,
              resizable: true,
            }}
            suppressColumnMoveAnimation={true}
            suppressCellFocus={false}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            rowClassRules={{
              "ag-row-even": (params) => params.node.rowIndex % 2 === 0,
              "ag-row-odd": (params) => params.node.rowIndex % 2 === 1,
            }}
            quickFilterText={quickFilterText}
          />
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
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "8px",
              bgcolor: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: "18px", pb: 2, color: document.documentElement.classList.contains("dark") ? "#f3f4f6" : "#111827" }}>
            {isEditApplication ? "Edit Application" : "New Application"}
          </DialogTitle>
          <DialogContent sx={{ pt: "16px !important" }}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Role</label>
                  <CustomTextField
                    value={formData.role}
                    handleChange={(e) => handleChange("role", e.target.value)}
                    placeholder="e.g., Senior Developer"
                  />
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Applied Date
                  </label>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    value={
                      formData.appliedDate ? dayjs(formData.appliedDate) : null
                    }
                    onChange={(date, dateString) =>
                      handleChange("appliedDate", dateString)
                    }
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                    getPopupContainer={(trigger) => trigger.parentElement}
                  />
                  {errors.appliedDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.appliedDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Interview Date
                  </label>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    value={
                      formData.interviewDate ? dayjs(formData.interviewDate) : null
                    }
                    onChange={(date, dateString) =>
                      handleChange("interviewDate", dateString)
                    }
                    minDate={dayjs(formData.appliedDate, "YYYY-MM-DD")}
                    getPopupContainer={(trigger) => trigger.parentElement}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Package (LPA)
                  </label>
                  <CustomTextField
                    name="package"
                    type="number"
                    value={formData.package}
                    handleChange={(e) => handleChange("package", e.target.value)}
                    placeholder="e.g., 12"
                  />
                  {errors.package && (
                    <p className="text-red-500 text-xs mt-1">{errors.package}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Employer/Company
                  </label>
                  <CustomTextField
                    name="employer"
                    value={formData.employer}
                    handleChange={(e) => {
                      handleChange("employer", e.target.value);
                    }}
                    placeholder="e.g., Google"
                  />
                  {errors.employer && (
                    <p className="text-red-500 text-xs mt-1">{errors.employer}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Platform</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select platform"
                    value={formData.platform}
                    onChange={(selectedValue) =>
                      handleChange("platform", selectedValue)
                    }
                    getPopupContainer={(trigger) => trigger.parentElement}
                  >
                    <Select.Option value="Linkedin">Linkedin</Select.Option>
                    <Select.Option value="Naukri">Naukri</Select.Option>
                    <Select.Option value="Indeed">Indeed</Select.Option>
                    <Select.Option value="Monster">Monster</Select.Option>
                    <Select.Option value="Workday">Workday</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                  {errors.platform && (
                    <p className="text-red-500 text-xs mt-1">{errors.platform}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Status</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select Status"
                    value={formData.status}
                    onChange={(selectedValue) =>
                      handleChange("status", selectedValue)
                    }
                    getPopupContainer={(trigger) => trigger.parentElement}
                  >
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="approved">Approved</Select.Option>
                    <Select.Option value="rejected">Rejected</Select.Option>
                  </Select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Link of the job
                  </label>
                  <CustomTextField
                    name="jobLink"
                    value={formData.jobLink}
                    handleChange={(e) => handleChange("jobLink", e.target.value)}
                    placeholder="https://..."
                  />
                  {errors.jobLink && (
                    <p className="text-red-500 text-xs mt-1">{errors.jobLink}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Required experience
                  </label>
                  <CustomTextField
                    name="experience"
                    value={formData.experience}
                    handleChange={(e) => handleChange("experience", e.target.value)}
                    type="number"
                    placeholder="e.g., 2"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Address</label>
                <CustomTextField
                  name="location"
                  rows={2}
                  isMultiline={true}
                  value={formData.location}
                  handleChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, Country"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Job Description
                </label>
                <CustomTextField
                  name="jobDescription"
                  value={formData.jobDescription}
                  rows={3}
                  isMultiline={true}
                  handleChange={(e) => {
                    handleChange("jobDescription", e.target.value);
                  }}
                  placeholder="Paste job description..."
                />
                {errors.jobDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.jobDescription}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <button
              onClick={clearDrawer}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitOrEditApplication}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              {isEditApplication ? "Update" : "Add"}
            </button>
          </DialogActions>
        </Dialog>
      </section>
    </main>
  );
};

export default Applications;
