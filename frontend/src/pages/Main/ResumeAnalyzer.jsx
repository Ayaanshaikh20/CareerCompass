import { useState, toast, axiosInstance } from "../../shared/Imports";
import { FaPlus } from "../../shared/Icons";

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    console.log(resume, jobTitle, jobDescription);
    const response = await axiosInstance.post("/analyze-resume", {
      resume,
      jobTitle,
      jobDescription,
    });
    try {
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <h1 className="text-base sm:text-lg md:text-xl font-bold mb-1">
          Resume Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
          Upload your resume and compare it with job descriptions
        </p>
      </div>

      <div className="max-w-7xl mx-auto pb-4 sm:pb-6">
        <form
          onSubmit={handleAnalyze}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6"
        >
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Upload Resume Section */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-3">
                Upload Resume
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex-1 flex items-center justify-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer w-full"
                >
                  <div className="flex flex-col items-center">
                    <FaPlus className="text-3xl text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {resume
                        ? resume.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="flex flex-col">
              <label className="block text-sm font-semibold mb-3">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                required
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-2.5 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="e.g., Senior Software Engineer"
              />
              <label className="block text-sm font-semibold mb-3">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                required
                onChange={(e) => setJobDescription(e.target.value)}
                rows="15"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y min-h-[300px]"
                placeholder="Paste the job description here...&#10;&#10;Include requirements, skills, qualifications, and responsibilities."
              />
            </div>
          </div>

          {/* Analyze Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Analyze Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
