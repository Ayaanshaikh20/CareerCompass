import { useState } from 'react';
import { FaPlus } from "../shared/Icons";

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    // Analysis logic will go here
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <h1 className="text-base sm:text-lg md:text-xl font-bold mb-1">Resume Analyzer</h1>
        <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">Upload your resume and compare it with job descriptions</p>
      </div>

      <div className="max-w-5xl mx-auto pb-4 sm:pb-6">
        <form onSubmit={handleAnalyze} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          
          {/* Upload Resume Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Upload Resume</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
                required
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <FaPlus className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {resume ? resume.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Job Description</label>
            <textarea
              value={jobDescription}
              required
              onChange={(e) => setJobDescription(e.target.value)}
              rows="12"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
              placeholder="Paste the job description here...&#10;&#10;Include requirements, skills, qualifications, and responsibilities."
            />
          </div>

          {/* Analyze Button */}
          <button 
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Analyze Resume
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
