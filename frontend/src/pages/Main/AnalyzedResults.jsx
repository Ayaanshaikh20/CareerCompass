import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const AnalyzedResults = () => {
  useEffect(() => {
    document.title = "Analyzed Resumes";
  }, []);

  return (
    <div className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-4 text-gray-900 dark:text-gray-100 min-h-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-2">Analyzed Resumes</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Previously analyzed resumes will appear here. (API integration pending)</p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-gray-800 dark:text-gray-100">
          <p className="text-sm">No analyses to show yet. This page will list saved analyses once the fetch API is implemented.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzedResults;
