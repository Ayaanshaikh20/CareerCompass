import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@mui/material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import {
  Input,
  DatePicker,
  Select,
  Drawer,
  Row,
  Col,
  Space,
  Descriptions,
} from "antd";
import dayjs from "dayjs";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import axios from "axios";
import { handleTokenExpiryAndRetry } from "../helpers/AccessTokenExpiry";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MaterialReactTable } from "material-react-table";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AppliedJobs = () => {
  const [open, setOpen] = useState(false);
  const { accessToken, refreshToken, _id } = JSON.parse(
    localStorage.getItem("user")
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showDrawer = () => setOpen(true);
  const [formData, setFormData] = useState({
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
  });
  const [applications, setApplications] = useState([]);
  const [isViewDetailsDrawer, setIsViewDetailsDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.role) errors.role = "Role is required";
    if (!values.appliedDate) errors.appliedDate = "Applied date is required";
    if (!values.package) errors.package = "Package is required";
    if (!values.employer) errors.employer = "Employer is required";
    // if (!values.resume) errors.resume = "Resume URL is required";
    if (!values.location) errors.location = "Location is required";
    if (!values.jobLink) errors.jobLink = "Job link is required";
    else if (!/^https?:\/\/.+/.test(values.jobLink))
      errors.jobLink = "Enter a valid URL";

    if (!values.experience) errors.experience = "Experience is required";
    if (!values.platform) errors.platform = "Platform is required";
    if (!values.jobDescription)
      errors.jobDescription = "Job description is required";
    return errors;
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/applications/${_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { status } = response.data;
      if (status === 200) {
        const { applications: allApplications } = response.data;
        setApplications(allApplications);
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 403) {
        const newToken = await handleTokenExpiryAndRetry(
          error,
          navigate,
          queryClient
        );
        if (newToken === "Expired refresh token") {
          return;
        } else if (newToken) {
          //retry api
          const response = await axios.get(`/api/applications/${_id}`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          const { status } = response.data;
          if (status === 200) {
            const { applications: allApplications } = response.data;
            setApplications(allApplications);
          }
        } else {
          toast.error("Error fetching application");
        }
      }
    }
  };

  const retrySubmitApplication = async (
    latestAccessToken,
    values,
    resetForm
  ) => {
    try {
      const retryRes = await axios.post("/api/new-application", values, {
        headers: {
          Authorization: `Bearer ${latestAccessToken}`,
        },
      });
      const { status, message } = retryRes.data;
      if (status === 201) {
        toast.success(message);
        onClose();
        resetForm();
        await fetchApplications();
      }
    } catch {
      toast.error("Error creating application");
    }
  };

  const viewDetails = (row) => {
    setSelectedJob(row);
    setIsViewDetailsDrawer(true);
  };

  const clearDrawerDetails = () => {
    setIsViewDetailsDrawer(false);
    setSelectedJob(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "view",
        header: "View",
        size: 60,
        Cell: ({ row }) => (
          <VisibilityIcon
            style={{ cursor: "pointer", color: "orange" }}
            onClick={() => viewDetails(row.original)}
            sx={{
              fontSize: "22px",
            }}
          />
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "experience",
        header: "Experience",
      },
      {
        accessorKey: "platform",
        header: "Platform",
      },
      {
        accessorKey: "appliedDate",
        header: "Applied Date",
        Cell: ({ row }) => (
          <span>{moment(row.original.appliedDate).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        accessorKey: "jobDescription",
        header: "Job Description",
      },
    ],
    []
  );

  return (
    <section className="h-full w-[calc(100vw-210px)]">
      <div className="w-full flex justify-end">
        <Button
          size="small"
          onClick={showDrawer}
          sx={{
            backgroundColor: "#2563EB",
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            "&:hover": {
              backgroundColor: "#1D4ED8",
            },
          }}
        >
          New application
        </Button>
      </div>
      <div className="w-full mt-5">
        <MaterialReactTable
          data={applications}
          columns={columns}
          enableTopToolbar={true}
          enableColumnResizing={false}
          columnResizeMode="onChange"
          enableSorting={false}
          enableBottomToolbar={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnActions={false}
          enableRowVirtualization={true}
          enablePagination={false}
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
                height: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              height: "calc(100vh - 220px)",
            },
          }}
        />
      </div>
      <Drawer
        title="Job Details"
        placement="right"
        width={480}
        onClose={() => clearDrawerDetails()}
        open={isViewDetailsDrawer}
      >
        {selectedJob && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: 600, width: 140 }}
            contentStyle={{ wordBreak: "break-word" }}
          >
            <Descriptions.Item label="Role">
              {selectedJob.role}
            </Descriptions.Item>
            <Descriptions.Item label="Employer">
              {selectedJob.employer}
            </Descriptions.Item>
            <Descriptions.Item label="Package">
              {selectedJob.package}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              <EnvironmentOutlined /> {selectedJob.location}
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {selectedJob.experience}
            </Descriptions.Item>
            <Descriptions.Item label="Platform">
              {selectedJob.platform}
            </Descriptions.Item>
            <Descriptions.Item label="Job Description">
              {selectedJob.jobDescription}
            </Descriptions.Item>
            <Descriptions.Item label="Applied Date">
              <CalendarOutlined />{" "}
              {moment(selectedJob.appliedDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Job Link">
              <a
                href={selectedJob.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1677ff" }}
              >
                View Posting
              </a>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
      <Formik
        initialValues={formData}
        validate={validate}
        validateOnBlur={validate}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          try {
            let response = await axios.post("/api/new-application", values, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const { status, message } = response.data;
            if (status === 201) {
              toast.success(message);
              onClose();
              resetForm();
              await fetchApplications();
            }
          } catch (error) {
            const status = error.response.status;
            if (status === 403) {
              const newToken = await handleTokenExpiryAndRetry(
                error,
                navigate,
                queryClient
              );
              if (newToken === "Expired refresh token") {
                return;
              } else if (newToken) {
                //retry api
                await retrySubmitApplication(newToken, values, resetForm);
              } else {
                toast.error("Error creating application");
              }
            }
          }
        }}
      >
        {(formik) => (
          <Drawer
            title="New application"
            width={700}
            closeIcon={false}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
              <Space>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    onClose();
                    formik.resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={formik.handleSubmit}
                >
                  Submit
                </Button>
              </Space>
            }
          >
            <FormikForm id="applicationForm">
              <Row gutter={16}>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Role</label>
                  <Field name="role" as={Input} placeholder="Enter role" />
                  <ErrorMessage
                    name="role"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Applied Date</label>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                    onChange={(date) => {
                      formik.setFieldValue(
                        "appliedDate",
                        date.format("DD/MM/YYYY")
                      );
                    }}
                  />
                  <ErrorMessage
                    name="appliedDate"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Package (LPA)</label>
                  <Field
                    name="package"
                    as={Input}
                    placeholder="Enter package"
                  />
                  <ErrorMessage
                    name="package"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>

                <Col span={12} className="mb-4">
                  <label className="block mb-1">Employer / Company</label>
                  <Field
                    name="employer"
                    as={Input}
                    placeholder="Enter company name"
                  />
                  <ErrorMessage
                    name="employer"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Location</label>
                  <Field
                    name="location"
                    as={Input}
                    placeholder="Enter location"
                  />
                  <ErrorMessage
                    name="location"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Link of the job</label>
                  <Field
                    name="jobLink"
                    as={Input}
                    placeholder="Enter job link"
                  />
                  <ErrorMessage
                    name="jobLink"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>

                <Col span={12} className="mb-4">
                  <label className="block mb-1">Required experience</label>
                  <Field
                    name="experience"
                    as={Input}
                    placeholder="Enter experience"
                  />
                  <ErrorMessage
                    name="experience"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12} className="mb-4">
                  <label className="block mb-1">Platform</label>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select platform"
                    value={formik.values.platform}
                    onChange={(value) =>
                      formik.setFieldValue("platform", value)
                    }
                  >
                    <Select.Option value="Linkedin">Linkedin</Select.Option>
                    <Select.Option value="Naukri">Naukri</Select.Option>
                    <Select.Option value="Indeed">Indeed</Select.Option>
                    <Select.Option value="Monster">Monster</Select.Option>
                    <Select.Option value="Workday">Workday</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                  <ErrorMessage
                    name="platform"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>

              <Row>
                <Col span={24} className="mb-4">
                  <label className="block mb-1">Job Description</label>
                  <Field
                    name="jobDescription"
                    as={Input.TextArea}
                    rows={4}
                    placeholder="Enter job description"
                  />
                  <ErrorMessage
                    name="jobDescription"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>
              </Row>
            </FormikForm>
          </Drawer>
        )}
      </Formik>
    </section>
  );
};

export default AppliedJobs;
