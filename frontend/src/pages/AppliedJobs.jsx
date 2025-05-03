import React, { useState } from "react";
import { Button } from "@mui/material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Input, DatePicker, Select, Drawer, Row, Col, Space } from "antd";
import axios from "axios";
import { handleTokenExpiryAndRetry } from "../helpers/AccessTokenExpiry";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const AppliedJobs = () => {
  const [open, setOpen] = useState(false);
  const { accessToken, refreshToken } = JSON.parse(
    localStorage.getItem("user")
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const validate = (values) => {
    const errors = {};

    if (!values.role) errors.role = "Role is required";
    if (!values.appliedDate) errors.appliedDate = "Applied date is required";
    if (!values.package) errors.package = "Package is required";
    if (!values.employer) errors.employer = "Employer is required";
    if (!values.resume) errors.resume = "Resume URL is required";
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

  return (
    <section className="w-full h-full">
      <div className="w-full flex">
        <Button variant="contained" size="small" onClick={showDrawer}>
          Add application
        </Button>
      </div>
      <Formik
        initialValues={{
          role: "",
          appliedDate: "",
          package: "",
          employer: "",
          resume: "",
          location: "",
          jobLink: "",
          experience: "",
          platform: "",
          jobDescription: "",
        }}
        // validate={validate}
        // validateOnBlur={validate}
        onSubmit={async (values) => {
          try {
            let response = await axios.post("/api/new-application", values, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            const message = await handleTokenExpiryAndRetry({
              error,
              retryCallback: async (newAccessToken) => {
                const retryRes = await axios.post(
                  "/api/new-application",
                  values,
                  {
                    headers: {
                      Authorization: `Bearer ${newAccessToken}`,
                    },
                  }
                );
                return retryRes;
              },
            });
            if (message === "expired") {
              navigate("/");
              localStorage.clear();
              queryClient.setQueryData(["user"], null);
            }
          }
        }}
      >
        {(formik) => (
          <Drawer
            title="New application"
            width={720}
            onClose={onClose}
            open={open}
            styles={{ body: { paddingBottom: 80 } }}
            extra={
              <Space>
                <Button variant="outlined" size="small" onClick={onClose}>
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
            <FormikForm>
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
                  <label className="block mb-1">Resume URL or file name</label>
                  <Field
                    name="resume"
                    as={Input}
                    placeholder="Enter resume URL"
                  />
                  <ErrorMessage
                    name="resume"
                    render={(msg) => (
                      <div className="text-red-500 text-xs mt-1">{msg}</div>
                    )}
                  />
                </Col>

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
