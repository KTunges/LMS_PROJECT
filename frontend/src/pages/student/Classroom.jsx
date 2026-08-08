import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFile, FiVideo, FiUploadCloud, FiDownload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { SkeletonCard, SkeletonTable } from '../../components/common/SkeletonLoaders';
import { courseService } from '../../services';
import './Classroom.css';

const MOCK_MATERIALS = [
  { id: 1, title: 'Bài 1: Tổng quan về ReactJS', type: 'pdf', size: '2.4 MB', date: '01/08/2026' },
  { id: 2, title: 'Video: Cấu trúc Component', type: 'video', size: '45 MB', date: '05/08/2026' },
  { id: 3, title: 'Slide Bài giảng tuần 2', type: 'pdf', size: '5.1 MB', date: '08/08/2026' },
];

const MOCK_ASSIGNMENTS = [
  { 
    id: 1, 
    title: 'Bài tập 1: Khởi tạo dự án', 
    dueDate: '10/08/2026 23:59', 
    status: 'submitted', 
    score: '9/10',
    fileSubmitted: 'project_setup.zip'
  },
  { 
    id: 2, 
    title: 'Bài tập 2: Quản lý State', 
    dueDate: '15/08/2026 23:59', 
    status: 'pending', 
    score: null,
    fileSubmitted: null
  },
];

const Classroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setIsLoading(true);
      try {
        const { data } = await courseService.getMyClasses();
        // data is array of enrollments, find the one with matching classId
        const enrollment = data.find(enr => enr.class_id.toString() === classId);
        if (enrollment) {
          setClassData(enrollment.class);
        } else {
          // Fallback if not found or not authorized
          navigate('/student/my-classes');
        }
      } catch (error) {
        console.error('Failed to load class', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassDetails();
  }, [classId, navigate]);

  const courseName = classData ? classData.course.name : 'Đang tải...';
  const teacher = classData?.teacher ? classData.teacher.full_name : 'Đang tải...';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmitAssignment = () => {
    if (uploadedFile) {
      alert(`Đã nộp file ${uploadedFile.name} thành công!`);
      setUploadedFile(null);
      setSelectedAssignment(null);
    }
  };

  return (
    <div className="classroom-page">
      <div className="classroom-banner">
        <div className="classroom-banner__bg"></div>
        <div className="classroom-banner__content">
          <button className="btn-back" onClick={() => navigate('/student/schedule')}>
            <FiArrowLeft /> Quay lại thời khóa biểu
          </button>
          <div className="course-info">
            <h1>{courseName}</h1>
            <p>Giảng viên: {teacher}</p>
          </div>
        </div>
      </div>

      <div className="classroom-tabs">
        <button 
          className={`ctab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <FiFile /> Tài liệu bài giảng
        </button>
        <button 
          className={`ctab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('assignments');
            setSelectedAssignment(null);
          }}
        >
          <FiUploadCloud /> Bài tập & Nộp bài
        </button>
      </div>

      <div className="classroom-content">
        {isLoading ? (
          <div style={{ marginTop: '24px' }}>
            <SkeletonTable rows={4} cols={1} />
          </div>
        ) : (
          <>
            {activeTab === 'materials' && (
              <div className="materials-list glass-card">
                <div className="list-header">
                  <h3>Tài liệu được chia sẻ</h3>
                  <p>Các tài liệu này chỉ dành cho học viên trong lớp.</p>
                </div>
                
                {MOCK_MATERIALS.map(mat => (
                  <div key={mat.id} className="material-item">
                    <div className="material-icon">
                      {mat.type === 'pdf' ? <FiFile className="text-danger" /> : <FiVideo className="text-info" />}
                    </div>
                    <div className="material-info">
                      <h4>{mat.title}</h4>
                      <span>Đăng ngày: {mat.date} • Kích thước: {mat.size}</span>
                    </div>
                    <button className="btn-download-mat">
                      <FiDownload /> Tải xuống
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && !selectedAssignment && (
              <div className="assignments-list glass-card">
                <div className="list-header">
                  <h3>Danh sách bài tập</h3>
                </div>

                {MOCK_ASSIGNMENTS.map(ass => (
                  <div key={ass.id} className="assignment-item" onClick={() => setSelectedAssignment(ass)}>
                    <div className={`assignment-status-icon ${ass.status}`}>
                      {ass.status === 'submitted' ? <FiCheckCircle /> : <FiClock />}
                    </div>
                    <div className="assignment-info">
                      <h4>{ass.title}</h4>
                      <span className={`due-date ${ass.status === 'pending' ? 'text-danger' : ''}`}>
                        Hạn nộp: {ass.dueDate}
                      </span>
                    </div>
                    <div className="assignment-state">
                      {ass.status === 'submitted' ? (
                        <span className="badge-success">Đã nộp ({ass.score})</span>
                      ) : (
                        <span className="badge-warning">Chưa nộp</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && selectedAssignment && (
              <div className="upload-view glass-card">
                <div className="upload-header">
                  <button className="btn-back-sm" onClick={() => setSelectedAssignment(null)}>
                    <FiArrowLeft /> Trở về
                  </button>
                  <h3>{selectedAssignment.title}</h3>
                  <p className="due-info"><FiAlertCircle /> Hạn chót: <strong>{selectedAssignment.dueDate}</strong></p>
                </div>

                {selectedAssignment.status === 'submitted' ? (
                  <div className="submitted-state">
                    <FiCheckCircle className="success-icon-lg" />
                    <h2>Bạn đã nộp bài thành công!</h2>
                    <div className="submitted-file">
                      <FiFile /> {selectedAssignment.fileSubmitted}
                    </div>
                    {selectedAssignment.score && (
                      <div className="score-box">
                        <span>Điểm:</span>
                        <strong>{selectedAssignment.score}</strong>
                      </div>
                    )}
                    <button className="btn-outline-danger mt-3">Hủy nộp bài</button>
                  </div>
                ) : (
                  <div className="upload-area-wrapper">
                    <form 
                      className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        id="file-upload" 
                        className="file-input-hidden" 
                        onChange={handleFileChange} 
                      />
                      
                      {!uploadedFile ? (
                        <label htmlFor="file-upload" className="drop-zone-content">
                          <FiUploadCloud className="upload-icon-lg" />
                          <h4>Kéo thả file vào đây hoặc <span>Tải lên từ máy</span></h4>
                          <p>Chấp nhận định dạng .pdf, .doc, .zip (Tối đa 50MB)</p>
                        </label>
                      ) : (
                        <div className="uploaded-file-preview">
                          <FiFile className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">{uploadedFile.name}</span>
                            <span className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                          <button 
                            type="button" 
                            className="btn-remove-file" 
                            onClick={(e) => { e.preventDefault(); setUploadedFile(null); }}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </form>

                    <div className="upload-actions">
                      <button className="btn-submit" disabled={!uploadedFile} onClick={handleSubmitAssignment}>
                        Nộp bài tập
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Classroom;
