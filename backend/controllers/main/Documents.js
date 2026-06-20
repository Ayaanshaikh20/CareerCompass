const { Router } = require("express");
const { documentRead, documentUpload, getDocument, deleteDocument } = require("../../models/main/Documents");
const router = Router();

router.post(
  "/api/upload-document",
  documentRead,
  documentUpload,
  async (req, res) => {
    const { fileName } = res.locals.fileDetails;
    const { document } = res.locals;
    res.status(200).json({
      status: 200,
      message: `${fileName} uploaded successfully`,
      data: document,
    });
  },
);

router.get("/api/get-documents", getDocument, async (req, res) => {
  const { documents } = req;
  res.status(200).json({
    status: 200,
    message: "Documents fetched successfully",
    data: documents,
  });
});

router.delete("/api/delete-document", deleteDocument, async (req, res) => {
  const { deletedDocument } = req;
  res.status(200).json({
    status: 200,
    message: "Document deleted successfully",
    data: deletedDocument,
  });
});

module.exports = router;
