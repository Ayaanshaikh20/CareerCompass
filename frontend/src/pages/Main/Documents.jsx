import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FaPlus } from "../../shared/Icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { axiosInstance, toast } from "../../shared/Imports";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Documents = () => {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const fileSelectRef = useRef(null);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [allDocuments, setAllDocuments] = useState([]);

  useEffect(() => {
    Promise.all([getAllDocuments()]);
  }, []);

  const openFileUploadForm = () => {
    setOpenFileDialog(true);
  };

  const closeFileUploadForm = () => {
    setOpenFileDialog(false);
    setFileName("");
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const getAllDocuments = async () => {
    try {
      let result = await axiosInstance.get(`/get-documents`);
      const { data, status } = result.data;
      if (status === 200) {
        setAllDocuments(data);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  const handleFileUpload = async () => {
    try {
      if (fileSelectRef.current?.files[0]) {
        const file = fileSelectRef.current.files[0];
        // Clear the file input value before closing dialog
        if (fileSelectRef.current) {
          fileSelectRef.current.value = "";
        }
        // build api which will upload the file to s3
        let formdata = new FormData();
        formdata.append("file", file);
        formdata.append("name", fileName);
        let result = await axiosInstance.post("/upload-document", formdata);
        const { status, message } = result.data;
        if (status === 200) {
          toast.success(message);
          closeFileUploadForm();
          await getAllDocuments();
        }
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  const handleDeleteDocument = async (documentId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const result = await axiosInstance.delete(`/delete-document?documentId=${documentId}`);

      if (result.data.status === 200) {
        toast.success(result.data.message || "Document deleted successfully");
        await getAllDocuments();

        // Adjust selected document index if needed
        if (selectedDoc >= allDocuments.length - 1) {
          setSelectedDoc(Math.max(0, allDocuments.length - 2));
        }
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Failed to delete document");
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'document';
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.6));

  return (
    <main className="bg-slate-100 dark:bg-gray-900 pt-4 sm:pt-6 px-2 sm:px-4 font-sans text-gray-900 dark:text-gray-100 min-h-full">
      <section className="max-w-7xl mx-auto">
        <div className="w-full flex flex-col sm:flex-row justify-between gap-3">
          <div className="mb-2 sm:mb-4">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">
              Document Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs mt-1">
              View and manage your documents
            </p>
          </div>
          <div className="mb-2 sm:mb-4">
            <button
              onClick={openFileUploadForm}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md w-full sm:w-auto justify-center"
            >
              <FaPlus className="text-xs sm:text-sm" />
              Upload Document
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)] min-h-[400px]">
          <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0 max-h-60 md:max-h-full">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Documents
              </h2>
            </div>
            <div className="p-2">
              {allDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors mb-2 group ${selectedDoc === index
                    ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 ${selectedDoc === index
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                        }`}
                    >
                      <DescriptionIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => setSelectedDoc(index)}>
                      <p
                        className={`text-xs font-medium truncate ${selectedDoc === index
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {doc.fileName}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {doc.mimeType}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id, doc.fileName);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 transition-opacity"
                      title="Delete document"
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Viewer */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                {allDocuments[selectedDoc] && getFileType(allDocuments[selectedDoc].mimeType) === 'pdf' && (
                  <>
                    <button
                      onClick={previousPage}
                      disabled={pageNumber <= 1}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <NavigateBeforeIcon fontSize="small" />
                    </button>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      Page {pageNumber} of {numPages || "--"}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={pageNumber >= numPages}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <NavigateNextIcon fontSize="small" />
                    </button>
                  </>
                )}
                {!allDocuments[selectedDoc] && (
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    No document selected
                  </span>
                )}
                {allDocuments[selectedDoc] && getFileType(allDocuments[selectedDoc].mimeType) !== 'pdf' && (
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    {allDocuments[selectedDoc].fileName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {allDocuments[selectedDoc] && (
                  <>
                    <a
                      href={allDocuments[selectedDoc].url}
                      download={allDocuments[selectedDoc].fileName}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      title="Download"
                      target="_blank"
                    >
                      <DownloadIcon fontSize="small" />
                    </a>
                    {getFileType(allDocuments[selectedDoc].mimeType) === 'image' && (
                      <>
                        <button
                          onClick={zoomOut}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ZoomOutIcon fontSize="small" />
                        </button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
                          {Math.round(scale * 100)}%
                        </span>
                        <button
                          onClick={zoomIn}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ZoomInIcon fontSize="small" />
                        </button>
                      </>
                    )}
                    {getFileType(allDocuments[selectedDoc].mimeType) === 'pdf' && (
                      <>
                        <button
                          onClick={zoomOut}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ZoomOutIcon fontSize="small" />
                        </button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
                          {Math.round(scale * 100)}%
                        </span>
                        <button
                          onClick={zoomIn}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ZoomInIcon fontSize="small" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex items-start justify-center p-4">
              {allDocuments[selectedDoc] ? (
                (() => {
                  const fileType = getFileType(allDocuments[selectedDoc].mimeType);
                  const fileUrl = allDocuments[selectedDoc].url;

                  switch (fileType) {
                    case 'image':
                      return (
                        <img
                          src={fileUrl}
                          alt={allDocuments[selectedDoc].fileName}
                          className="max-w-full max-h-full object-contain shadow-lg"
                          style={{ transform: `scale(${scale})` }}
                        />
                      );
                    case 'pdf':
                      return (
                        <Document
                          file={fileUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                              Loading PDF...
                            </div>
                          }
                          error={
                            <div className="text-red-500 text-sm">Failed to load PDF</div>
                          }
                        >
                          <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="shadow-lg"
                          />
                        </Document>
                      );
                    default:
                      return (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <DescriptionIcon sx={{ fontSize: 48, marginBottom: 2 }} />
                          <p className="text-sm">{allDocuments[selectedDoc].fileName}</p>
                          <p className="text-xs mt-2">Click download to open this document</p>
                        </div>
                      );
                  }
                })()
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <DescriptionIcon sx={{ fontSize: 48, marginBottom: 2 }} />
                  <p className="text-sm">No document selected</p>
                  <p className="text-xs mt-2">Select a document from the sidebar to view</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* File Upload Dialog */}
      <Dialog
        open={openFileDialog}
        onClose={closeFileUploadForm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          Upload Document
        </DialogTitle>
        <DialogContent className="bg-white dark:bg-gray-800 p-6">
          <div className="space-y-4 mt-4">
            {/* File Name Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={fileName}
                disabled={!fileSelectRef.current?.files[0]}
                onChange={handleFileNameChange}
                placeholder="e.g., Resume-2026"
                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Upload Button */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select File
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileSelectRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && !fileName) {
                      setFileName(file.name.split(".")[0]);
                    }
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => fileSelectRef.current?.click()}
                  className="flex-1 px-3 py-2 text-xs border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  {fileSelectRef.current?.files[0]
                    ? fileSelectRef.current.files[0].name
                    : "Choose File"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={closeFileUploadForm}
            className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFileUpload}
            disabled={!fileName || !fileSelectRef.current?.files[0]}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Documents;
