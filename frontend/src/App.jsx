import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import Dashboard from './pages/student/Dashboard/Dashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherRevenue from './pages/teacher/TeacherRevenue';
import CreateCourse from './pages/teacher/CreateCourse';
import TeacherMaterials from './pages/teacher/TeacherMaterials';
import TeacherSettings from './pages/teacher/TeacherSettings';
import TeacherStudents from './pages/teacher/TeacherStudents';
import ManageCourse from './pages/teacher/ManageCourse';
import AuthPage from './pages/auth/AuthPage';
import TeacherLogin from './pages/auth/TeacherLogin';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/student/Profile';
import Schedule from './pages/student/Schedule';
import Results from './pages/student/Results';
import ResourceCenter from './pages/student/ResourceCenter';
import CourseCatalog from './pages/student/CourseCatalog';
import MyClasses from './pages/student/MyClasses';
import Classroom from './pages/student/Classroom';
import PinSetupModal from './components/common/PinSetupModal/PinSetupModal';
import Leaderboard from './pages/student/Leaderboard';
import Quiz from './pages/student/Quiz';
import Achievements from './pages/student/Achievements';
import Transactions from './pages/student/Transactions';
import Curriculum from './pages/student/Curriculum';
import NotFound from './components/common/NotFound';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
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

            {/* Teacher Login Route */}
            <Route path="/portal-giang-vien/login" element={<TeacherLogin />} />

            {/* Teacher routes */}
            <Route
              path="/portal-giang-vien"
              element={
                <ProtectedRoute roles={['teacher']}>
                  <TeacherLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="materials" element={<TeacherMaterials />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="revenue" element={<TeacherRevenue />} />
              <Route path="courses" element={<TeacherClasses />} />
              <Route path="courses/new" element={<CreateCourse />} />
              <Route path="courses/:id/edit" element={<ManageCourse />} />
              <Route path="profile" element={<TeacherSettings />} />
              <Route path="settings" element={<TeacherSettings />} />
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
              <Route path="curriculum" element={<Curriculum />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="quiz/:quizId" element={<Quiz />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>

            {/* Public Login page */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
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
    </ThemeProvider>
  );
}

export default App;
