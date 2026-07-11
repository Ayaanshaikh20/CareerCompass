import React, { useState, useEffect } from "react";
import {
  axiosInstance,
  toast,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useNavigate,
} from "../../shared/Imports";
import {
  AutoAwesomeIcon,
  VisibilityIcon,
  DeleteIcon,
  CloseIcon,
} from "../../shared/Icons";

const AnalyzedResults = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Analyzed Resumes - CareerCompass";
    fetchAnalyses();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/resume-analyses");
      const { status, data } = response.data;
      if (status === 200) {
        setAnalyses(data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load previously analyzed resumes.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedAnalysis(null);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/delete-analysis?analysis_id=${deleteId}`);
      if (response.data.status === 200) {
        toast.success("Analysis deleted successfully.");
        setAnalyses(analyses.filter((item) => item.analysis_id !== deleteId));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete analysis.");
    } finally {
      handleCloseDelete();
    }
  };

  const getScoreColorClass = (score) => {
    if (score >= 75) return "text-emerald-650 dark:text-emerald-400 border-emerald-550/20 bg-emerald-50 dark:bg-emerald-950/20";
    if (score >= 50) return "text-amber-650 dark:text-amber-400 border-amber-550/20 bg-amber-50 dark:bg-amber-950/20";
    return "text-rose-650 dark:text-rose-400 border-rose-550/20 bg-rose-50 dark:bg-rose-950/20";
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 pt-4 sm:pt-6 px-3 sm:px-6 text-gray-950 dark:text-gray-100 min-h-full font-sans pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Saved Resume Analyses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
            Access previous feedback, core strengths, missing keywords, and match scores.
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <AutoAwesomeIcon className="text-sm" />
            Analyze New Resume
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          /* Loading State skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : analyses.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4">
              <AutoAwesomeIcon className="text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">No Saved Analyses Found</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              You haven't saved any resume analyses yet. Run an analysis against a job description to get insights and matching scores.
            </p>
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow active:scale-95 cursor-pointer"
            >
              Analyze Resume Now
            </button>
          </div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => {
              const score = analysis.overall_score || analysis.overallScore || 0;
              const colorClass = getScoreColorClass(score);

              return (
                <div
                  key={analysis.analysis_id}
                  className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top details */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {analysis.job_title || "Untitled Job Match"}
                        </h2>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                          {formatDate(analysis.date)}
                        </span>
                      </div>
                      <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold border ${colorClass} select-none`}>
                        {score}
                      </div>
                    </div>

                    {/* Summary Snippet */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                      {analysis.summary || "No summary feedback available."}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <button
                      onClick={() => handleOpenDetails(analysis)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-gray-750 dark:text-gray-200 bg-gray-50 hover:bg-gray-105 dark:bg-gray-700/40 dark:hover:bg-gray-700/80 rounded-lg transition duration-205 cursor-pointer"
                    >
                      <VisibilityIcon style={{ fontSize: 13 }} />
                      View Details
                    </button>
                    <button
                      onClick={() => confirmDelete(analysis.analysis_id)}
                      className="px-3 py-2 text-[11px] font-semibold text-rose-600 hover:text-white dark:text-rose-400 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/60 rounded-lg transition duration-205 cursor-pointer"
                      title="Delete Analysis"
                    >
                      <DeleteIcon style={{ fontSize: 13 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          className: "bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-100 rounded-xl max-h-[85vh]",
        }}
      >
        <DialogTitle className="border-b border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border ${selectedAnalysis ? getScoreColorClass(selectedAnalysis.overall_score || selectedAnalysis.overallScore) : ""}`}>
              {selectedAnalysis?.overall_score ?? selectedAnalysis?.overallScore ?? "--"}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                {selectedAnalysis?.job_title || "Job Match Details"}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Analyzed on {formatDate(selectedAnalysis?.date)}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseDetails}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-lg transition cursor-pointer"
          >
            <CloseIcon />
          </button>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {selectedAnalysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Skills lists */}
              <div className="col-span-1 space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide uppercase">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAnalysis.matched_skills || selectedAnalysis.matchedSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/45 text-blue-800 dark:text-blue-300 text-[10px] font-bold border border-blue-100/50 dark:border-blue-900/30"
                      >
                        {skill}
                      </span>
                    ))}
                    {!(selectedAnalysis.matched_skills?.length || selectedAnalysis.matchedSkills?.length) && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No matched skills detected.</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide uppercase">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAnalysis.missing_skills || selectedAnalysis.missingSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800/70 text-gray-700 dark:text-gray-400 text-[10px] font-bold border border-gray-200/50 dark:border-gray-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {!(selectedAnalysis.missing_skills?.length || selectedAnalysis.missingSkills?.length) && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No missing skills detected.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 tracking-wide uppercase">AI Analysis Summary</h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedAnalysis.summary || "No summary provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-500/10 dark:border-emerald-900/10 shadow-sm">
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-3 tracking-wide uppercase flex items-center gap-1">
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-xs space-y-2 text-gray-700 dark:text-gray-300">
                      {(selectedAnalysis.strengths || []).map((strength, idx) => (
                        <li key={idx} className="leading-relaxed">{strength}</li>
                      ))}
                      {!selectedAnalysis.strengths?.length && (
                        <li className="text-gray-400 dark:text-gray-500 list-none">No specific strengths documented.</li>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-50/10 dark:bg-amber-950/5 border border-amber-500/10 dark:border-amber-900/10 shadow-sm">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-3 tracking-wide uppercase flex items-center gap-1">
                      Areas of Improvement
                    </h4>
                    <ul className="list-disc list-inside text-xs space-y-2 text-gray-700 dark:text-gray-300">
                      {(selectedAnalysis.improvements || []).map((improvement, idx) => (
                        <li key={idx} className="leading-relaxed">{improvement}</li>
                      ))}
                      {!selectedAnalysis.improvements?.length && (
                        <li className="text-gray-400 dark:text-gray-500 list-none">No improvements documented.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No data selected.</p>
          )}
        </DialogContent>

        <DialogActions className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={handleCloseDetails}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-105 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition cursor-pointer"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={handleCloseDelete}
        PaperProps={{
          className: "bg-white dark:bg-gray-800 text-gray-950 dark:text-gray-100 rounded-xl",
        }}
      >
        <DialogTitle className="font-bold text-base">Delete Resume Analysis</DialogTitle>
        <DialogContent>
          <DialogContentText className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to permanently delete this resume analysis record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <button
            onClick={handleCloseDelete}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow cursor-pointer"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AnalyzedResults;
