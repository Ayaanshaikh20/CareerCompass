import { CalendarOutlined, EditIcon, EnvironmentOutlined, FaPlus, MdOutlineRefresh } from "../shared/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Input,
  MaterialReactTable,
  Row,
  Select,
  Space,
  VisibilityIcon,
  axiosInstance,
  customToggleLoading,
  dayjs,
  moment,
  toast,
  useEffect,
  useMemo,
  useState,
} from "../shared/imports";

const AppliedJobs = () => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { accessToken, _id } = JSON.parse(localStorage.getItem("user"));
  const defaultFormData = {
    userId: _id,
    role: "",
    appliedDate: "",
    package: "",
    employer: "",
    location: "",
    jobLink: "",
    experience: "",
    platform: "",
    jobDescription: "",
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
    else if (!/^https?:\/\/.+/.test(formData.jobLink)) newErrors.jobLink = "Enter a valid URL";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
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
      const { status, message } = error?.response?.data || {};
      toast.error(message || "Error submitting form");
    }
  };

  const fetchApplications = async () => {
    try {
      customToggleLoading({ loading: true });
      const response = await axiosInstance.get(`/api/applications/${_id}`);
      const { status } = response.data;
      if (status === 200) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      const { status, message } = error?.response?.data || {};
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

  const clearDrawerDetails = () => {
    setIsViewDetailsDrawer(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const viewDetails = (job) => {
    setSelectedJob(job);
    setIsViewDetailsDrawer(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "view",
        header: "Actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <VisibilityIcon style={{ cursor: "pointer", color: "orange" }} onClick={() => viewDetails(row.original)} />
            <EditIcon style={{ cursor: "pointer", color: "green" }} onClick={() => viewEditApplication(row.original)} />
          </div>
        ),
      },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "experience", header: "Experience" },
      { accessorKey: "platform", header: "Platform" },
      {
        accessorKey: "appliedDate",
        header: "Applied Date",
        Cell: ({ row }) => <span>{moment(row.original.appliedDate).format("DD/MM/YYYY")}</span>,
      },
      {
        accessorKey: "jobDescription",
        header: "Job Description",
        Cell: ({ row }) => <span className=' text-wrap'>{row.original.jobDescription}</span>,
      },
    ],
    []
  );

  return (
    <section className='h-full w-[calc(100vw-210px)]'>
      <div className='w-full'>
        <MaterialReactTable
          data={applications}
          columns={columns}
          enableTopToolbar={true}
          enableColumnResizing={false}
          columnResizeMode='onChange'
          enableSorting={false}
          enableBottomToolbar={false}
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
                <button className=' p-2' onClick={showDrawer}>
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
              height: "calc(100vh - 160px)",
            },
          }}
        />
      </div>
      <Drawer title='Job Details' placement='right' width={480} onClose={() => clearDrawerDetails()} open={isViewDetailsDrawer}>
        {selectedJob && (
          <Descriptions bordered column={1} size='small' labelStyle={{ fontWeight: 600, width: 140 }} contentStyle={{ wordBreak: "break-word" }}>
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
      <Drawer
        title={isEditApplication ? "Edit Application" : "New Application"}
        open={open || isEditApplication}
        onClose={clearDrawer}
        width={700}
        extra={
          <Space>
            <Button onClick={clearDrawer}>Cancel</Button>
            <Button variant='contained' onClick={submitOrEditApplication}>
              Submit
            </Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label>Role</label>
            <Input value={formData.role} onChange={(e) => handleChange("role", e.target.value)} placeholder='Enter role' />
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
            <Input name='package' value={formData.package} onChange={(e) => handleChange("package", e.target.value)} placeholder='Enter package' />
            {errors.package && <p className='text-red-500 text-xs'>{errors.package}</p>}
          </Col>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Employer/Company</label>
            <Input
              name='employer'
              value={formData.employer}
              onChange={(e) => {
                handleChange("employer", e.target.value);
              }}
              placeholder='Enter company name'
            />
            {errors.employer && <p className='text-red-500 text-xs'>{errors.employer}</p>}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Location</label>
            <Input
              name='location'
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder='Enter location'
            />
            {errors.location && <p className='text-red-500 text-xs'>{errors.location}</p>}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Link of the job</label>
            <Input name='jobLink' value={formData.jobLink} onChange={(e) => handleChange("jobLink", e.target.value)} placeholder='Enter job link' />
            {errors.jobLink && <p className='text-red-500 text-xs'>{errors.jobLink}</p>}
          </Col>
          <Col span={12} className='mb-4'>
            <label className='block mb-1'>Required experience</label>
            <Input
              name='experience'
              value={formData.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              placeholder='Enter experience'
            />
            {errors.experience && <p className='text-red-500 text-xs'>{errors.experience}</p>}
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
        </Row>
        <Row>
          <Col span={24} className='mb-4'>
            <label className='block mb-1'>Job Description</label>
            <Input
              name='jobDescription'
              onChange={(e) => {
                handleChange("jobDescription", e.target.value);
              }}
              placeholder='Enter job description'
            />
            {errors.jobDescription && <p className='text-red-500 text-xs'>{errors.jobDescription}</p>}
          </Col>
        </Row>
      </Drawer>
    </section>
  );
};

export default AppliedJobs;
