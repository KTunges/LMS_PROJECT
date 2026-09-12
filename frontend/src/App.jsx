import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/auth/AuthPage';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/student/Profile';
import Schedule from './pages/student/Schedule';
import Results from './pages/student/Results';
import ResourceCenter from './pages/student/ResourceCenter';
import CourseCatalog from './pages/student/CourseCatalog';
import MyClasses from './pages/student/MyClasses';
import Classroom from './pages/student/Classroom';
import PinSetupModal from './components/common/PinSetupModal';
import Leaderboard from './pages/student/Leaderboard';
import Quiz from './pages/student/Quiz';
import Achievements from './pages/student/Achievements';
import Transactions from './pages/student/Transactions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PinSetupModal />
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
            {/* TÀI NGUYÊN HỌC TẬP */}
            <Route path="resource-center" element={<ResourceCenter />} />
            <Route path="catalog" element={<CourseCatalog />} />
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="results" element={<Results />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="classroom/:classId" element={<Classroom />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="quiz/:quizId" element={<Quiz />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Public Login page */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
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
