import { useState } from 'react';

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalyze = () => {
    // Analysis logic will go here
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Resume Analyzer</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'block', margin: '10px 0', padding: '10px', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="10"
          style={{ width: '100%', padding: '10px', fontSize: '14px', resize: 'vertical' }}
          placeholder="Paste the job description here..."
        />
      </div>

      <button 
        onClick={handleAnalyze}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          fontSize: '16px', 
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        Analyze
      </button>
    </div>
  );
}
