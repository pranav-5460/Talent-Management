import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/EmployeeDetails';
import Reports from './pages/Reports';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import JobVacancies from './pages/JobVacancies';
import JobPosting from './pages/JobPosting';
import ApplyJob from './pages/ApplyJob';
import Performance from './pages/Performance';
import MyNavbar from './components/Navbar';
import RoleBasedRoute from './components/RoleBasedRoute';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import PerformanceReports from './pages/PerformanceReports';
import SetGoals from './pages/SetGoals';
import ReviewPerformance from './pages/ReviewPerformance';
import Applications from './pages/Applications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  return (
    <Router>
      <MyNavbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userRole={userRole} />
      <div className="container mt-5">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
          <Route path="/job-vacancies" element={<JobVacancies />} />
          <Route path="/create-job" element={isAuthenticated && userRole === 'manager' ? <JobPosting /> : <Navigate to="/unauthorized" />} />
          <Route path="/apply-job/:jobId" element={<ApplyJob />} />  {/* Allow non-authenticated users */}

          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route element={<RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['manager', 'HR', 'employee']} userRole={userRole} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['manager', 'HR']} userRole={userRole} />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/employee/:id" element={<EmployeeDetails />} />
            </Route>
            <Route element={<RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['manager']} userRole={userRole} />}>
              <Route path="/reports" element={<Reports />} />
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            </Route>
            <Route element={<RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['HR']} userRole={userRole} />}>
              <Route path="/hr-dashboard" element={<HRDashboard />} />
            </Route>
            <Route element={<RoleBasedRoute isAuthenticated={isAuthenticated} allowedRoles={['manager', 'HR']} userRole={userRole} />}>
              <Route path="/applications" element={<Applications />} />
            </Route>
          </Route>

          <Route path="/set-goals" element={<SetGoals />} />
          <Route path="/performance-reports" element={<PerformanceReports />} />
          <Route path="/review-performance/:employeeId/:goalId" element={<ReviewPerformance />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          <Route path="/performance/:employeeId" element={<Performance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
