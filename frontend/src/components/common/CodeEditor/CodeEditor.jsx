import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FiPlay, FiCheckCircle } from 'react-icons/fi';
import './CodeEditor.css';

const CodeEditor = ({ question, testCases, onSubmit }) => {
  const [code, setCode] = useState(question.default_code || '// Viết code của bạn vào đây\n');
  const [language, setLanguage] = useState(question.language || 'javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState(null);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setResults(null);
    try {
      const response = await fetch('http://localhost:5000/api/student/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          language,
          sourceCode: code,
          testCases: testCases || []
        })
      });
      const res = await response.json();
      if (res.success) {
        setResults(res.data);
      } else {
        setResults({ error: true, message: 'Đã có lỗi xảy ra' });
      }
    } catch (err) {
      setResults({ error: true, message: 'Lỗi kết nối máy chủ' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ code, results });
    }
  };

  return (
    <div className="code-editor-container glass-card">
      <div className="code-editor-header">
        <select 
          className="language-selector" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <div className="editor-actions">
          <button className="btn btn-outline" onClick={handleRunCode} disabled={isExecuting}>
            <FiPlay /> {isExecuting ? 'Đang chạy...' : 'Run Code'}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            <FiCheckCircle /> Nộp bài
          </button>
        </div>
      </div>
      
      <div className="editor-wrapper">
        <Editor
          height="400px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false
          }}
        />
      </div>

      {results && (
        <div className={`execution-results ${results.score === 100 ? 'success' : 'error'}`}>
          <h3>Kết quả chạy ({results.passedCount}/{results.totalCases} passed)</h3>
          <div className="test-cases-list">
            {results.results?.map((tc, idx) => (
              <div key={tc.id || idx} className={`test-case-item ${tc.passed ? 'passed' : 'failed'}`}>
                <div className="tc-header">
                  <span>Test Case #{idx + 1}</span>
                  <span className="tc-status">{tc.passed ? '✅ Passed' : '❌ Failed'}</span>
                </div>
                {!tc.passed && !tc.isHidden && (
                  <div className="tc-details">
                    <div><strong>Input:</strong> <pre>{tc.input}</pre></div>
                    <div><strong>Expected:</strong> <pre>{tc.expected}</pre></div>
                    <div><strong>Output:</strong> <pre>{tc.output}</pre></div>
                  </div>
                )}
                {!tc.passed && tc.isHidden && (
                  <div className="tc-details">
                    <div><em>Hidden Test Case</em></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
