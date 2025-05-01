import axios from "axios";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex justify-center items-center mt-24">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
          <Formik
            initialValues={formData}
            onSubmit={async (formData) => {
              try {
                const response = await axios.post("/api/login", formData);
                const { status } = response.data;
                if (status === 200) {
                  const { message, userDetails } = response.data;
                  toast.success(message);
                  localStorage.setItem("user", JSON.stringify(userDetails));
                  queryClient.setQueryData(["user"], userDetails);
                  navigate("/dashboard");
                }
              } catch (error) {
                const { status, message } = error?.response?.data;
                if (status) {
                  toast.error(message);
                } else {
                  toast.error("Error logging in user");
                }
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Field
                    name="email"
                    as={TextField}
                    label="Email *"
                    fullWidth
                    size="small"
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                  />
                </div>
                <div className="mb-4">
                  <Field
                    name="password"
                    type="password"
                    as={TextField}
                    label="Password *"
                    fullWidth
                    size="small"
                    variant="outlined"
                    helperText={<ErrorMessage name="password" />}
                  />
                </div>
                <div className="text-sm mb-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-500 hover:underline"
                  >
                    Register
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="small"
                  className="hover:bg-blue-600 transition"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
