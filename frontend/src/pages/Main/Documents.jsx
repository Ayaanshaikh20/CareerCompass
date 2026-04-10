import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import resumePdf from "../../assets/images/Resume-2026.pdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FaPlus } from "../../shared/Icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Documents = () => {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const fileSelectRef = useRef(null);

  const documents = [
    { uri: resumePdf, name: "Resume-2026.pdf", type: "PDF", size: "245 KB" },
    { uri: resumePdf, name: "Resume-2020.pdf", type: "PDF", size: "245 KB" },
  ];

  const handleFileUpload = () => {
    fileSelectRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    //build api which will upload the file to s3
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
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <main className="bg-slate-100 dark:bg-gray-900 pt-6 px-4 font-sans text-gray-900 dark:text-gray-100 min-h-full">
      <section className="max-w-7xl mx-auto">
        <div className=" w-full flex justify-between">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Document Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              View and manage your documents
            </p>
          </div>
          <div className="mb-4">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileSelectRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileUpload}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md"
            >
              <FaPlus />
              Upload Document
            </button>
          </div>
        </div>
        <div className="flex gap-4 h-[calc(100vh-180px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Documents
              </h2>
            </div>
            <div className="p-2">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDoc(index)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedDoc === index
                      ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 ${
                        selectedDoc === index
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      <DescriptionIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          selectedDoc === index
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
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
              </div>
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex items-start justify-center p-4">
              <Document
                file={documents[selectedDoc].uri}
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Documents;
