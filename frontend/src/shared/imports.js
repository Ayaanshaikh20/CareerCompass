import "@radix-ui/themes/styles.css";
import "../assets/styles/styles.css";
import "@fontsource/roboto";

//React
import { useEffect, useState, useMemo } from "react";

//Material UI/Icons
import {
  Typography,
  TextField,
  Avatar,
  Box,
  Grid2,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Divider,
  Paper
} from "@mui/material";

//Material Table
import { MaterialReactTable } from "material-react-table";

//Ant design
import { Input, DatePicker, Select, Drawer, Row, Col, Space, Descriptions } from "antd";

//react-router
import { useNavigate, Route, Routes, Navigate, Outlet, Link, BrowserRouter, useLocation } from "react-router";

//tanstack query
import { useQueryClient, QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//react dom
import { createRoot } from "react-dom/client";

//Tools
import axios from "axios";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip as ToolTip,
  Legend,
} from "chart.js";

//Radix
import { Theme, Button } from "@radix-ui/themes";

//Components
import { customToggleLoading } from "../utilities/CustomLoading";
import axiosInstance from "../config/AxiosInstance";
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Main/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import Settings from "../pages/Main/Settings";
import Profile from "../pages/Main/Profile";
import AppliedJobs from "../pages/Main/AppliedJobs";
import Router from "../config/Router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NotFound from "../pages/Main/NotFound";

//Utilities
import { CustomTextField } from "../utilities/CustomTextField";
import { CustomButton } from "../utilities/CustomButton";
import { muiTableBodyCellProps, muiTableBodyRowProps, muiTableContainerProps, muiTableProps } from "../utilities/TableStyles";

export {
  muiTableBodyCellProps,
  muiTableBodyRowProps,
  muiTableContainerProps,
  muiTableProps,
  Paper,
  Divider,
  FormHelperText,
  NotFound,
  CustomButton,
  CustomTextField,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Line,
  Pie,
  ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  ToolTip,
  useLocation,
  Toolbar,
  useQuery,
  AppBar,
  Navbar,
  Sidebar,
  Router,
  createRoot,
  BrowserRouter,
  Toaster,
  ReactQueryDevtools,
  QueryClientProvider,
  QueryClient,
  Avatar,
  Box,
  Grid2,
  IconButton,
  Tooltip,
  useQueryClient,
  Link,
  TextField,
  MainLayout,
  Register,
  Login,
  Dashboard,
  AuthLayout,
  Settings,
  Profile,
  AppliedJobs,
  Route,
  Routes,
  Navigate,
  Outlet,
  useEffect,
  useState,
  useMemo,
  Button,
  Typography,
  MaterialReactTable,
  Input,
  DatePicker,
  Select,
  Drawer,
  Row,
  Col,
  Space,
  Descriptions,
  customToggleLoading,
  axios,
  dayjs,
  toast,
  moment,
  axiosInstance,
  useNavigate,
};
