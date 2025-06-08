import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/register", formData);
      const { status } = response.data;
      if (status === 201) {
        const { message, userData } = response.data;
        toast.success(message);
        localStorage.setItem("user", JSON.stringify(userData));
        queryClient.setQueryData(["user"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.status) {
        toast.error(errorData.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24 p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-3 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            label="Firstname"
            variant="outlined"
            name="firstName"
            size="small"
            fullWidth
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            variant="outlined"
            name="location"
            size="small"
            fullWidth
            required
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
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
            size="small"
            fullWidth
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            type="email"
            size="small"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            size="small"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
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
        </form>
      </div>
    </div>
  );
};

export default Register;
