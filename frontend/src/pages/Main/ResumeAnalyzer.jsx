import {
  useState,
  useEffect,
  toast,
  axiosInstance,
  customToggleLoading,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useNavigate,
} from "../../shared/Imports";
import { FaPlus, AutoAwesomeIcon } from "../../shared/Icons";

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hasFreeTrial, setHasFreeTrial] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const user_id = localStorage.getItem("uid");
  const navigate = useNavigate();

  useEffect(() => {
    checkFreeTrial();
  }, []);

  const checkFreeTrial = async () => {
    try {
      const response = await axiosInstance.get(`/fetch-user?userId=${user_id}`);
      const { userDetails } = response.data;
      setHasFreeTrial(userDetails.plan ? true : false);
    } catch (error) {
      console.error(error);
    }
  };

  const activateFreeTrial = async () => {
    try {
      const response = await axiosInstance.post("/activate-free-trial", {
        userId: user_id,
      });
      const { status, message } = response.data;
      if (status === 200) {
        toast.success(message);
        setHasFreeTrial(true);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      console.log(message);
      toast.error(message || "Failed to activate free trial");
    }
  };

  const handleFileUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    customToggleLoading({ loading: true });
    e.preventDefault();
    if (!hasFreeTrial) return;

    let formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);
    try {
      const response = await axiosInstance.post("/analyze-resume", formData);
      const result = response.data?.data ?? response.data;
      setAnalysisResult(result);
      setAnalysisModalOpen(true);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  const closeAnalysisModal = async () => {
    setAnalysisModalOpen(false);
    setResume(null);
    setJobTitle("");
    setJobDescription("");
    setAnalysisResult(null);
    await checkFreeTrial()
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 text-gray-900 dark:text-gray-100 font-sans min-h-full">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold mb-1">
            Resume Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
            Upload your resume and compare it with job descriptions
          </p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/analyzed-results')}
            className="ml-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:shadow"
          >
            View Analyzed Resumes
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-4 sm:pb-6">
        {!hasFreeTrial ? (
          /* Free Trial Banner */
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-lg p-8 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-full">
                <AutoAwesomeIcon className="text-white text-4xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Start Your Free Trial
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              Get 5 free resume analyses to optimize your job applications
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">
              No credit card required • Instant activation • AI-powered insights
            </p>
            <button
              onClick={activateFreeTrial}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Activate Free Trial
            </button>
            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ✓ Analyze up to 5 resumes • ✓ Match against job descriptions • ✓
                Get actionable feedback
              </p>
            </div>
          </div>
        ) : null}

        <form
          onSubmit={handleAnalyze}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 ${!hasFreeTrial ? "opacity-50 pointer-events-none" : ""}`}
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
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!hasFreeTrial}
              className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all duration-200 ${
                hasFreeTrial
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Analyze Resume
            </button>
            {!hasFreeTrial && (
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                Activate free trial to analyze resumes
              </span>
            )}
            
          </div>
        </form>
      </div>

      <Dialog open={analysisModalOpen} onClose={closeAnalysisModal} maxWidth="lg" fullWidth>
        <DialogTitle className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume Analysis</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Actionable feedback & suggestions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold border-4 border-blue-100 dark:border-blue-800 bg-white dark:bg-gray-800">
                <span className="text-2xl text-blue-600 dark:text-blue-300">{analysisResult?.overallScore ?? "--"}</span>
              </div>
            </div>
          </div>
        </DialogTitle>

        <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-h-[70vh] overflow-auto px-6 py-5">
          {analysisResult ? (
            analysisResult.rawText ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 p-4 bg-slate-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                {analysisResult.rawText}
              </pre>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                <div className="col-span-1 space-y-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(analysisResult.matchedSkills || []).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {!analysisResult.matchedSkills?.length && <p className="text-xs text-gray-500">No matched skills</p>}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(analysisResult.missingSkills || []).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {!analysisResult.missingSkills?.length && <p className="text-xs text-gray-500">No missing skills</p>}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Summary</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{analysisResult.summary || "No summary available."}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Strengths</h4>
                      <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                        {(analysisResult.strengths || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                        {!analysisResult.strengths?.length && <li className="text-xs text-gray-500">No strengths listed.</li>}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Improvements</h4>
                      <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                        {(analysisResult.improvements || []).map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                        {!analysisResult.improvements?.length && <li className="text-xs text-gray-500">No improvement suggestions.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <DialogContentText className="text-sm text-gray-700 dark:text-gray-300">
              No analysis results are available yet.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={closeAnalysisModal}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md whitespace-nowrap"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResumeAnalyzer;
