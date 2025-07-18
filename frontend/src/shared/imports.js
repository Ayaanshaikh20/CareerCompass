//React
import { useEffect, useState, useMemo } from "react";

//Material UI/Icons
import {
  Button,
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

//Components
import { customToggleLoading } from "../shared/CustomLoading";
import axiosInstance from "../config/axiosInstance";
import MainLayout from "../main/MainLayout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../main/AuthLayout";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import AppliedJobs from "../pages/AppliedJobs";
import Router from "../config/Router";
import Navbar from "../main/Navbar";
import Sidebar from "../main/Sidebar";

export {
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
  Home,
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
