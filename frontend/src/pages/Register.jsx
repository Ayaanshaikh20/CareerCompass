import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    accessToken: "",
    refreshToken: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-24 p-4">
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
            Register
          </h2>
          <Formik
            initialValues={formData}
            onSubmit={async (formData) => {
              try {
                formData.id = uuidv4();
                const response = await axios.post("/api/register", formData);
                const { status } = response.data;
                if (status === 201) {
                  const { message, userDetails } = response?.data;
                  toast.success(message);
                  localStorage.setItem("user", JSON.stringify(userDetails));
                  queryClient.setQueryData(["user"], userDetails);
                  navigate("/dashboard");
                }
              } catch (error) {
                const errorData = error.response?.data;
                if (errorData) {
                  const { message, status } = errorData;
                  if (status) {
                    toast.error(message);
                  } else {
                    toast.error("Error registering user");
                  }
                } else {
                  toast.error("Unexpected error occurred");
                }
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Field
                  label="Firstname"
                  variant="outlined"
                  as={TextField}
                  name="firstName"
                  size="small"
                  className="mb-2"
                  fullWidth
                  required
                />
                <Field
                  label="Location"
                  variant="outlined"
                  as={TextField}
                  name="location"
                  size="small"
                  className="mb-2"
                  fullWidth
                  required
                />
                <Field
                  label="Phone number"
                  variant="outlined"
                  name="phone"
                  type="tel"
                  inputProps={{
                    minLength: 10,
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "\\d{10}",
                  }}
                  helperText="Phone number must be 10 digits"
                  as={TextField}
                  size="small"
                  fullWidth
                  required
                />
                <Field
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  as={TextField}
                  size="small"
                  className="mb-2"
                  fullWidth
                  required
                />
                <Field
                  label="Password"
                  variant="outlined"
                  name="password"
                  type="password"
                  as={TextField}
                  size="small"
                  className="mb-2"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mt-2"
                  size="small"
                  fullWidth
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
