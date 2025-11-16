import {
  CalendarOutlined,
  EditIcon,
  EnvironmentOutlined,
  FaPlus,
  MdOutlineRefresh,
  VisibilityIcon,
  DeleteIcon,
  MoreVertIcon,
} from "../shared/Icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  MaterialReactTable,
  Row,
  Select,
  axiosInstance,
  dayjs,
  moment,
  toast,
  useEffect,
  useMemo,
  useState,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Divider,
  CustomTextField,
} from "../shared/Imports";

const ActionMenuCell = ({ row, viewDetails, deleteApplication, viewEditApplication }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const item = row.original;

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon />
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
      >
        <MenuItem
          onClick={() => {
            handleClose();
            viewDetails(item);
          }}
          sx={{
            "&:hover": { bgcolor: "rgba(255,165,0,0.15)" }, // orange tint
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: "orange" }} />
          </ListItemIcon>
          <ListItemText primary="View" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            viewEditApplication(item);
          }}
          sx={{
            "&:hover": { bgcolor: "rgba(0,128,0,0.12)" }, // green tint
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: "green" }} />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            deleteApplication(item);
          }}
          sx={{
            color: "red",
            "&:hover": { bgcolor: "rgba(255,0,0,0.12)" }, // red tint
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
};

const AppliedJobs = ({fetchApplications, applications}) => {
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
  const [isViewDetailsDrawer, setIsViewDetailsDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditApplication, setIsEditApplication] = useState(false);

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "view",
        header: "",
        maxSize: 40,
        Cell: ({ row }) => (
          <div className=' flex justify-center items-center w-full'>
            <ActionMenuCell
              deleteApplication={deleteApplication}
              viewDetails={viewDetails}
              viewEditApplication={viewEditApplication}
              row={row}
            />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        maxSize: 50,
        Cell: ({ row }) => {
          const status = row.original.status;
          const getColor = (status) => {
            switch (status.toLowerCase()) {
              case "pending":
                return "warning";
              case "approved":
                return "success";
              case "rejected":
                return "error";
              default:
                return "default";
            }
          };
          return <Chip label={status} color={getColor(status)} size='small' />;
        },
      },
      {
        accessorKey: "appliedDate",
        header: "Applied Date",
        maxSize: 70,
        Cell: ({ row }) => <span className=" font-bold">{moment(row.original.appliedDate).format("DD-MMM-YYYY")}</span>,
      },
      {
        accessorKey: "jobLink",
        header: "Visit",
        maxSize: 40,
        Cell: ({ row }) => (
          <a className='text-blue-500 items-center w-full underline' href={row.original.jobLink}>
            Link
          </a>
        ),
      },
      { accessorKey: "role", header: "Role", minSize: 300 },
      { accessorKey: "experience", header: "Experience", maxSize: 120 },
      { accessorKey: "platform", header: "Platform", maxSize: 100 }
    ],
    []
  );

  return (
    <section className=' mt-2'>

      {/* Applications Table */}
      <div className='w-full border-2'>
        <MaterialReactTable
          data={applications || []}
          columns={columns}
          enableTopToolbar={true}
          enableSorting={false}
          initialState={
            {
              density: "compact"
            }
          }
          enableBottomToolbar={false}
          columnResizeMode="onEnd"
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnActions={false}
          enableRowVirtualization={true}
          enablePagination={false}
          renderTopToolbarCustomActions={() => {
            return (
              <div className=' flex gap-3'>
                <button
                  className=' p-2'
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <FaPlus size={20} className=' text-green-700' />
                </button>
                <button onClick={fetchApplications}>
                  <MdOutlineRefresh size={24} className=' text-blue-600' />
                </button>
              </div>
            );
          }}
          muiTableBodyRowProps={{
            sx: {
              paddingY: 0.5,
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              padding: "8px 8px",
              whiteSpace: "nowrap",
            },
          }}
          muiTableProps={{
            sx: {
              tableLayout: "auto",
              width: "100%",
            },
          }}
          muiTableContainerProps={{
            sx: {
              maxWidth: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "2px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              maxHeight: 410,
              height: 410,
            },
          }}
        />
      </div>

      {/* Drawer for Viewing Job Details */}
      <Drawer
        title='Job Details'
        placement='right'
        width={480}
        onClose={() => setIsViewDetailsDrawer(false)}
        open={isViewDetailsDrawer}
      >
        {selectedJob && (
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
            <Descriptions.Item label='Location'>
              <EnvironmentOutlined /> {selectedJob.location}
            </Descriptions.Item>
            <Descriptions.Item label='Experience'>{selectedJob.experience}</Descriptions.Item>
            <Descriptions.Item label='Platform'>{selectedJob.platform}</Descriptions.Item>
            <Descriptions.Item label='Job Description'>{selectedJob.jobDescription}</Descriptions.Item>
            <Descriptions.Item label='Applied Date'>
              <CalendarOutlined /> {moment(selectedJob.appliedDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label='Job Link'>
              <a href={selectedJob.jobLink} target='_blank' rel='noopener noreferrer' style={{ color: "#1677ff" }}>
                View Posting
              </a>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>


      {/* Drawer for Adding/Editing Application */}
      <Drawer
        title={isEditApplication ? "Edit Application" : "New Application"}
        open={open || isEditApplication}
        onClose={clearDrawer}
        width={700}
        extra={
          <Theme>
            <Button variant='solid' size="2" onClick={submitOrEditApplication}>
              Submit
            </Button>
          </Theme>
        }
      >
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label>Role</label>
            <CustomTextField
              value={formData.role}
              handleChange={(e) => handleChange("role", e.target.value)}
            />
            {errors.role && <p className='text-red-500 text-xs'>{errors.role}</p>}
          </Col>
          <Col span={12} className='mb-4'>
            <label>Applied Date</label>
            <DatePicker
              style={{ width: "100%" }}
              format='YYYY-MM-DD'
              value={formData.appliedDate ? dayjs(formData.appliedDate) : null}
              onChange={(date, dateString) => handleChange("appliedDate", dateString)}
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
            {errors.appliedDate && <p className='text-red-500 text-xs'>{errors.appliedDate}</p>}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Package (LPA)</label>
            <CustomTextField
              name='package'
              value={formData.package}
              handleChange={(e) => handleChange("package", e.target.value)}
            />
            {errors.package && <p className='text-red-500 text-xs'>{errors.package}</p>}
          </Col>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Employer/Company</label>
            <CustomTextField
              name='employer'
              value={formData.employer}
              handleChange={(e) => {
                handleChange("employer", e.target.value);
              }}
            />
            {errors.employer && <p className='text-red-500 text-xs'>{errors.employer}</p>}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Platform</label>
            <Select
              style={{ width: "100%" }}
              placeholder='Select platform'
              value={formData.platform}
              onChange={(selectedValue) => handleChange("platform", selectedValue)}
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
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Status</label>
            <Select
              style={{ width: "100%" }}
              placeholder='Select Status'
              value={formData.status}
              onChange={(selectedValue) => handleChange("status", selectedValue)}
            >
              <Select.Option value='pending'>Pending</Select.Option>
              <Select.Option value='approved'>Approved</Select.Option>
              <Select.Option value='rejected'>Rejected</Select.Option>
            </Select>
            {errors.status && <p className='text-red-500 text-xs'>{errors.status}</p>}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Link of the job</label>
            <CustomTextField
              name='jobLink'
              value={formData.jobLink}
              handleChange={(e) => handleChange("jobLink", e.target.value)}
            />
            {errors.jobLink && <p className='text-red-500 text-xs'>{errors.jobLink}</p>}
          </Col>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Required experience</label>
            <CustomTextField
              name='experience'
              value={formData.experience}
              handleChange={(e) => handleChange("experience", e.target.value)}
              type={"number"}
            />
            {errors.experience && <p className='text-red-500 text-xs'>{errors.experience}</p>}
          </Col>
        </Row>
        <Row>
          <Col span={24} className='mb-4'>
            <label className='block mb-1'>Address</label>
            <CustomTextField
              name='location'
              rows={4}
              isMultiline={true}
              value={formData.location}
              handleChange={(e) => handleChange("location", e.target.value)}
            />
            {errors.location && <p className='text-red-500 text-xs'>{errors.location}</p>}
          </Col>
        </Row>
        <Row>
          <Col span={24} className='mb-4'>
            <label className='block mb-1'>Job Description</label>
            <CustomTextField
              name='jobDescription'
              value={formData.jobDescription}
              rows={4}
              isMultiline={true}
              handleChange={(e) => {
                handleChange("jobDescription", e.target.value);
              }}
            />
            {errors.jobDescription && <p className='text-red-500 text-xs'>{errors.jobDescription}</p>}
          </Col>
        </Row>
      </Drawer>
    </section>
  );
};

export default AppliedJobs;
