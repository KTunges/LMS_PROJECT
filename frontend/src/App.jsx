import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/auth/AuthPage';
import Profile from './pages/student/Profile';
import Registration from './pages/student/Registration';
import Schedule from './pages/student/Schedule';
import Results from './pages/student/Results';
import Curriculum from './pages/student/Curriculum';
import ExamSchedule from './pages/student/ExamSchedule';
import GraduationProgress from './pages/student/GraduationProgress';
import Materials from './pages/student/Materials';
import DigitalLibrary from './pages/student/DigitalLibrary';
import Downloads from './pages/student/Downloads';
import OnlineCourses from './pages/student/OnlineCourses';
import MyClasses from './pages/student/MyClasses';
import Classroom from './pages/student/Classroom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Dashboard />} />
            <Route path="categories" element={<Dashboard />} />
            <Route path="users" element={<Dashboard />} />
            <Route path="settings" element={<Dashboard />} />
          </Route>

          {/* Teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute roles={['teacher']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Dashboard />} />
            <Route path="upload" element={<Dashboard />} />
          </Route>

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute roles={['student']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="digital-library" element={<DigitalLibrary />} />
            <Route path="online-courses" element={<OnlineCourses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="registration" element={<Registration />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="results" element={<Results />} />
            <Route path="curriculum" element={<Curriculum />} />
            <Route path="exam-schedule" element={<ExamSchedule />} />
            <Route path="graduation-progress" element={<GraduationProgress />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="classroom/:classId" element={<Classroom />} />
          </Route>

          {/* Public Login page */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
