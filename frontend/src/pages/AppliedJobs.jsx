import {
  CalendarMonthIcon,
  EditIcon,
  VisibilityIcon,
  DeleteIcon,
  MoreVertIcon,
  CloseIcon
} from "../shared/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Row,
  Select,
  axiosInstance,
  customToggleLoading,
  dayjs,
  moment,
  toast,
  useEffect,
  useState,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
} from "../shared/imports";

const ActionMenuCell = ({ row, viewDetails, deleteApplication, viewEditApplication }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const item = row;

  return (
    <>
      <IconButton size='small' onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            viewDetails(item);
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize='small' sx={{ color: "orange" }} />
          </ListItemIcon>
          <ListItemText primary='View' />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            viewEditApplication(item);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize='small' sx={{ color: "green" }} />
          </ListItemIcon>
          <ListItemText primary='Edit' />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            deleteApplication(item);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize='small' sx={{ color: "red" }} />
          </ListItemIcon>
          <ListItemText primary='Delete' />
        </MenuItem>
      </Menu>
    </>
  );
};

const AppliedJobs = () => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { user_id } = JSON.parse(localStorage.getItem("user"));
  const defaultFormData = {
    userId: user_id,
    role: "",
    appliedDate: "",
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
  const [applications, setApplications] = useState([]);
  const [isViewDetailsDrawer, setIsViewDetailsDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditApplication, setIsEditApplication] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.appliedDate) newErrors.appliedDate = "Applied date is required";
    if (!formData.package) newErrors.package = "Package is required";
    if (!formData.employer) newErrors.employer = "Employer is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.jobLink) newErrors.jobLink = "Job link is required";
    else if (!/^https?:\/\/.+/.test(formData.jobLink)) newErrors.jobLink = "Enter a valid URL (https://...";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.jobDescription) newErrors.jobDescription = "Job description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrEditApplication = async () => {
    if (!validate()) return;

    const url = isEditApplication ? "/api/edit-application" : "/api/new-application";
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
      if (!error.customSessionExpired) {
        toast.error(message || "Error submitting form");
      }
    }
  };

  const fetchApplications = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(`/api/applications?user_id=${user_id}`);
      const { status, applications, message } = response.data;
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

  const viewEditApplication = (application) => {
    setFormData(application);
    setIsEditApplication(true);
  };

  const clearDrawer = () => {
    setFormData(defaultFormData);
    setOpen(false);
    setIsEditApplication(false);
    setErrors({});
  };

  const viewDetails = (job) => {
    setSelectedJob(job);
    setIsViewDetailsDrawer(true);
  };

  const deleteApplication = async (selectedApplication) => {
    try {
      const { user_id, id } = selectedApplication;
      let response = await axiosInstance.delete(`/api/delete-application?user_id=${user_id}&application_id=${id}`);
      const { status } = response.data;
      if (status === 200) {
        await fetchApplications();
        toast.success("Application deleted successfully");
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      if (!error.customSessionExpired) {
        toast.error(message || "Error deleting application");
      }
    }
  };

  const { TextArea } = Input;

  return (
    <section className='h-full mt-3 p-3'>
      <div className=" w-full flex justify-end mb-2">
        <Button className="" variant="contained" size="small" onClick={() => { setOpen(true) }}>
          Add Job
        </Button>
      </div>
      <TableContainer component={Paper} className="mt-4" sx={{ maxHeight: 500, boxShadow: 3 }}>
        <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell></TableCell>
              {[
                "Status", "Job link", "Role", "Experience",
                "Platform", "Applied Date"
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((row, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  "& td": { verticalAlign: "top", fontSize: 13, padding: "10px" },
                }}
              >
                <TableCell>
                  <ActionMenuCell
                    deleteApplication={deleteApplication}
                    viewDetails={viewDetails}
                    viewEditApplication={viewEditApplication}
                    row={row}
                  />
                </TableCell>

                <TableCell align="center">{row.status}</TableCell>

                <TableCell align="center">
                  <a
                    href={row.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    View
                  </a>
                </TableCell>

                <TableCell align="center">{row.role}</TableCell>
                <TableCell align="center">{row.experience}</TableCell>
                <TableCell align="center">{row.platform}</TableCell>
                <TableCell align="center">{moment(row.appliedDate).format("DD-MMM-YYYY")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        selectedJob && (
          <Dialog
            onClose={() => setIsViewDetailsDrawer(false)}
            open={isViewDetailsDrawer}
            maxWidth={"md"}
            fullWidth
          >
            <DialogTitle>
              View Job Application
            </DialogTitle>
            <DialogContent>
              <Descriptions
                bordered
                column={1}
                size='small'
                labelStyle={{ fontWeight: 600, width: 140 }}
                contentStyle={{ wordBreak: "break-word" }}
              >
                <Descriptions.Item label='Role'>{selectedJob.role}</Descriptions.Item>
                <Descriptions.Item label='Employer'>{selectedJob.employer}</Descriptions.Item>
                <Descriptions.Item label='Package'>{selectedJob.package}</Descriptions.Item>
                <Descriptions.Item label='Location'>{selectedJob.location}</Descriptions.Item>
                <Descriptions.Item label='Experience'>{selectedJob.experience}</Descriptions.Item>
                <Descriptions.Item label='Platform'>{selectedJob.platform}</Descriptions.Item>
                <Descriptions.Item label='Job Description'>{selectedJob.jobDescription}</Descriptions.Item>
                <Descriptions.Item label='Applied Date'>
                  <CalendarMonthIcon /> {moment(selectedJob.appliedDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label='Job Link'>
                  <a href={selectedJob.jobLink} target='_blank' rel='noopener noreferrer' style={{ color: "#1677ff" }}>
                    View Posting
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </DialogContent>
          </Dialog>
        )
      }
      <Dialog
        open={open || isEditApplication}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            clearDrawer();
          }
        }}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>{isEditApplication ? "Edit Application" : "New Application"}</span>
          <IconButton onClick={clearDrawer}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className=" p-4">
          <Row gutter={16}>
            <Col xs={24} md={12} className='mb-4'>
              <label>Role</label>
              <Input
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
              />
              {errors.role && <p className='text-red-500 text-xs'>{errors.role}</p>}
            </Col>
            <Col xs={24} md={12} className='mb-4'>
              <label>Applied Date</label>
              <DatePicker
                style={{ width: "100%" }}
                format='YYYY-MM-DD'
                placeholder=""
                value={formData.appliedDate ? dayjs(formData.appliedDate) : null}
                onChange={(date, dateString) => handleChange("appliedDate", dateString)}
                disabledDate={(current) => current && current > dayjs().endOf("day")}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
              {errors.appliedDate && <p className='text-red-500 text-xs'>{errors.appliedDate}</p>}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Package (LPA)</label>
              <Input
                name='package'
                value={formData.package}
                onChange={(e) => handleChange("package", e.target.value)}
              />
              {errors.package && <p className='text-red-500 text-xs'>{errors.package}</p>}
            </Col>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Employer/Company</label>
              <Input
                name='employer'
                value={formData.employer}
                onChange={(e) => {
                  handleChange("employer", e.target.value);
                }}
              />
              {errors.employer && <p className='text-red-500 text-xs'>{errors.employer}</p>}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Location</label>
              <Input
                name='location'
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              {errors.location && <p className='text-red-500 text-xs'>{errors.location}</p>}
            </Col>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Status</label>
              <Select
                style={{ width: "100%" }}
                value={formData.status}
                onChange={(selectedValue) => handleChange("status", selectedValue)}
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                <Select.Option value='pending'>Pending</Select.Option>
                <Select.Option value='approved'>Approved</Select.Option>
                <Select.Option value='rejected'>Rejected</Select.Option>
              </Select>
              {errors.status && <p className='text-red-500 text-xs'>{errors.status}</p>}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Link of the job</label>
              <Input
                name='jobLink'
                value={formData.jobLink}
                onChange={(e) => handleChange("jobLink", e.target.value)}
              />
              {errors.jobLink && <p className='text-red-500 text-xs'>{errors.jobLink}</p>}
            </Col>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Required experience</label>
              <Input
                name='experience'
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
              {errors.experience && <p className='text-red-500 text-xs'>{errors.experience}</p>}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12} className='mb-4'>
              <label className='block mb-1'>Platform</label>
              <Select
                style={{ width: "100%" }}
                value={formData.platform}
                onChange={(selectedValue) => handleChange("platform", selectedValue)}
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                <Select.Option value='Linkedin'>Linkedin</Select.Option>
                <Select.Option value='Naukri'>Naukri</Select.Option>
                <Select.Option value='Indeed'>Indeed</Select.Option>
                <Select.Option value='Monster'>Monster</Select.Option>
                <Select.Option value='Workday'>Workday</Select.Option>
                <Select.Option value='Other'>Other</Select.Option>
              </Select>
              {errors.platform && <p className='text-red-500 text-xs'>{errors.platform}</p>}
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24} className='mb-4'>
              <label className='block mb-1'>Job Description</label>
              <TextArea
                name='jobDescription'
                value={formData.jobDescription}
                autoSize={{ minRows: 5, maxRows: 5 }}
                onChange={(e) => {
                  handleChange("jobDescription", e.target.value);
                }}
              />
              {errors.jobDescription && <p className='text-red-500 text-xs'>{errors.jobDescription}</p>}
            </Col>
          </Row>
          <Row className=" flex justify-end">
            <Button variant="contained" size="small" onClick={submitOrEditApplication}>
              Submit
            </Button>
          </Row>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AppliedJobs;
