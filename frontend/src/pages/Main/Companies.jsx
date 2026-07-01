import {
  customToggleLoading,
  useEffect,
  axiosInstance,
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
  DialogActions,
} from "../../shared/Imports";
import { EditIcon, FaPlus, DeleteIcon, MoreVertIcon } from "../../shared/Icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ActionMenuCell = ({ data, handleDeleteClick, viewEditCompany }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }} sx={{ color: "#666", padding: "2px" }}>
        <MoreVertIcon sx={{ fontSize: "18px" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} PaperProps={{ elevation: 3, sx: { borderRadius: 2 } }} MenuListProps={{ dense: true, disablePadding: true }}>
        <MenuItem onClick={() => { setAnchorEl(null); viewEditCompany(data); }} sx={{ "&:hover": { bgcolor: "rgba(0,128,0,0.12)" }, padding: "4px 12px", minHeight: "28px" }}>
          <ListItemIcon sx={{ minWidth: "28px" }}><EditIcon fontSize="small" sx={{ color: "green" }} /></ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ fontSize: "12px" }} />
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); handleDeleteClick(data); }} sx={{ color: "red", "&:hover": { bgcolor: "rgba(255,0,0,0.12)" }, padding: "4px 12px", minHeight: "28px" }}>
          <ListItemIcon sx={{ minWidth: "28px", color: "red" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: "12px" }} />
        </MenuItem>
      </Menu>
    </>
  );
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const defaultFormData = {
    companyName: "",
    phoneNumber: "",
    websiteUrl: "",
    hrEmail: "",
    location: "",
    isContacted: false,
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrEdit = async () => {
    if (!validate()) return;

    try {
      if (isEdit) {
        await axiosInstance.put(`/companies/${formData.id}`, formData);
        toast.success("Company updated successfully");
      } else {
        await axiosInstance.post("/companies", formData);
        toast.success("Company added successfully");
      }
      setFormData(defaultFormData);
      setOpen(false);
      setIsEdit(false);
      await fetchCompanies();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const viewEditCompany = (company) => {
    setFormData(company);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/companies/${selectedCompany.id}`, {
        data: selectedCompany
      });
      await fetchCompanies();
      toast.success("Company deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setDeleteDialogOpen(false);
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  const columnDefs = [
    {
      headerName: "",
      width: 50,
      cellRenderer: (params) => <ActionMenuCell data={params.data} handleDeleteClick={handleDeleteClick} viewEditCompany={viewEditCompany} />,
      sortable: false,
      filter: false,
      pinned: "left",
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "center" },
    },
    { headerName: "Company", field: "companyName", flex: 1.5, minWidth: 150, cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" } },
    { headerName: "Location", field: "location", flex: 1, minWidth: 120, cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" } },
    {
      headerName: "Contacted",
      field: "isContacted",
      width: 100,
      cellRenderer: (params) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <input
            type="checkbox"
            checked={params.value}
            onChange={(e) => {
              e.stopPropagation();
              const updatedCompany = { ...params.data, isContacted: e.target.checked };
              axiosInstance.put(`/companies/${params.data.id}`, updatedCompany).then(() => fetchCompanies());
            }}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      ),
      cellStyle: { paddingTop: "4px", paddingBottom: "4px" },
    },
    { headerName: "Phone", field: "phoneNumber", flex: 1, minWidth: 120, cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" } },
    { headerName: "HR Email", field: "hrEmail", flex: 1.2, minWidth: 150, cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" } },
    {
      headerName: "Website",
      field: "websiteUrl",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => params.value ? <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: "#1890ff", fontSize: "12px", textDecoration: "underline" }}>Visit</a> : "-",
      cellStyle: { paddingTop: "4px", paddingBottom: "4px", fontSize: "12px" },
    },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(`/companies`);
      setCompanies(response.data.companies || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 font-sans text-gray-900 dark:text-gray-100 min-h-full">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">Companies</h1>
            <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs mt-1">Manage your shortlisted companies</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" placeholder="Search..." value={quickFilterText} onChange={(e) => setQuickFilterText(e.target.value)} className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={() => { setFormData(defaultFormData); setIsEdit(false); setOpen(true); }} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md whitespace-nowrap">
              <FaPlus className="text-xs sm:text-sm" /><span className="hidden sm:inline">Add Company</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div className={isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"} style={{ height: "calc(100vh - 250px)", minHeight: "400px", borderRadius: "4px", overflow: "hidden", fontFamily: "sans-serif", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" }}>
          <AgGridReact rowData={companies} columnDefs={columnDefs} pagination={false} rowHeight={35} animateRows={true} headerHeight={36} defaultColDef={{ sortable: true, filter: false, resizable: true }} suppressCellFocus={false} enableCellTextSelection={true} ensureDomOrder={true} rowClassRules={{ "ag-row-even": (params) => params.node.rowIndex % 2 === 0, "ag-row-odd": (params) => params.node.rowIndex % 2 === 1 }} quickFilterText={quickFilterText} />
        </div>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 600, fontSize: "16px" }}>Delete Company</DialogTitle>
          <DialogContent><p className="text-sm">Are you sure you want to delete <strong>{selectedCompany?.companyName}</strong>?</p></DialogContent>
          <DialogActions>
            <button onClick={() => setDeleteDialogOpen(false)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            <button onClick={confirmDelete} className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={() => { setFormData(defaultFormData); setOpen(false); setIsEdit(false); setErrors({}); }} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "8px", bgcolor: isDark ? "#1f2937" : "#ffffff" } }}>
          <DialogTitle sx={{ fontWeight: 600, fontSize: "18px", pb: 2, color: isDark ? "#f3f4f6" : "#111827" }}>{isEdit ? "Edit Company" : "Add Company"}</DialogTitle>
          <DialogContent sx={{ pt: "16px !important" }}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Company Name</label>
                  <CustomTextField value={formData.companyName} handleChange={(e) => handleChange("companyName", e.target.value)} placeholder="e.g., Google" />
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Location</label>
                  <CustomTextField value={formData.location} handleChange={(e) => handleChange("location", e.target.value)} placeholder="e.g., UAE, Saudi Arabia" />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone Number</label>
                  <CustomTextField value={formData.phoneNumber} handleChange={(e) => handleChange("phoneNumber", e.target.value)} placeholder="+971 xxx xxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">HR Email</label>
                  <CustomTextField value={formData.hrEmail} type="email" handleChange={(e) => handleChange("hrEmail", e.target.value)} placeholder="hr@company.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Website URL</label>
                <CustomTextField value={formData.websiteUrl} handleChange={(e) => handleChange("websiteUrl", e.target.value)} placeholder="https://company.com" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isContacted"
                  checked={formData.isContacted}
                  onChange={(e) => handleChange("isContacted", e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isContacted" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Contacted
                </label>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <button onClick={() => { setFormData(defaultFormData); setOpen(false); setIsEdit(false); setErrors({}); }} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            <button onClick={submitOrEdit} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">{isEdit ? "Update" : "Add"}</button>
          </DialogActions>
        </Dialog>
      </section>
    </main>
  );
};

export default Companies;
