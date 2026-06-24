import "@radix-ui/themes/styles.css";
import "../assets/styles/styles.css";
import "@fontsource/roboto";

//React
import { useEffect, useState } from "react";

//Material UI/Icons
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge
} from "@mui/material";

//Ant design
import { DatePicker, Select } from "antd";

//react-router
import { useNavigate, Route, Routes, Navigate, Outlet, Link, BrowserRouter, useLocation, useSearchParams } from "react-router";

//tanstack query
import { useQueryClient, QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//ag-grid
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

//react dom
import { createRoot } from "react-dom/client";

//Tools
import axios from "axios";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { Line } from "react-chartjs-2";
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
import { Theme } from "@radix-ui/themes";

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
import Router from "../config/Router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import NotFound from "../pages/Main/NotFound";
import Applications from "../pages/Main/Applications";
import Companies from "../pages/Main/Companies";
import Documents from "../pages/Main/Documents";
import ResumeAnalyzer from "../pages/Main/ResumeAnalyzer";
import AnalyzedResults from "../pages/Main/AnalyzedResults";

//Utilities
import { CustomTextField } from "../utilities/CustomTextField";

//Services
import emailService from "../services/email"; 

export {
  AnalyzedResults,
  ResumeAnalyzer,
  Documents,
  Badge,
  AgGridReact,
  AllCommunityModule,
  ModuleRegistry,
  Applications,
  Companies,
  useSearchParams,
  ResetPassword,
  emailService,
  ForgotPassword,
  FormHelperText,
  NotFound,
  CustomTextField,
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Line,
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
  NotificationBell,
  Router,
  createRoot,
  BrowserRouter,
  Toaster,
  ReactQueryDevtools,
  QueryClientProvider,
  QueryClient,
  IconButton,
  useQueryClient,
  Link,
  MainLayout,
  Register,
  Login,
  Dashboard,
  AuthLayout,
  Settings,
  Profile,
  Route,
  Routes,
  Navigate,
  Outlet,
  useEffect,
  useState,
  Typography,
  DatePicker,
  Select,
  customToggleLoading,
  axios,
  dayjs,
  toast,
  axiosInstance,
  useNavigate,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
};
