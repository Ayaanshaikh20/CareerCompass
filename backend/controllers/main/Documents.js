const { Router } = require("express");
const router = Router();
const pool = require("../../config/dbConnect");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { bucketName, s3 } = require("../../config/s3client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = (bytes = 32) =>
  crypto.randomUUID(bytes).toString("hex");

const getDocument = async (req, res, next) => {
  let sqlQuery, con;
  try {
    const { user_id } = req.query;

    con = await pool.connect();

    //fetch all the documents from DB
    sqlQuery = `SELECT * FROM documents WHERE user_id=$1`;

    let documents = await con.query(sqlQuery, [user_id]);

    for (document in documents.rows) {
      const eachDoc = documents.rows[document];
      const getObjectParams = {
        Bucket: bucketName,
        Key: eachDoc.file_key,
      };
      const command = new GetObjectCommand(getObjectParams);
      documents.rows[document].url = await getSignedUrl(s3, command, {
        expiresIn: 3600,
      });
    }

    req.documents = documents.rows;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching documents",
    });
  } finally {
    if (con) con.release();
  }
};

const documentRead = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const { file } = req.files;

    if (!file || !name) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded",
      });
    }

    const safeFileName =
      randomImageName() + "-" + file.name.replace(/\s+/g, "-");

    const params = {
      Bucket: bucketName,
      Key: safeFileName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    req.params = params;
    res.locals.fileDetails = {
      fileKey: safeFileName,
      fileName: name,
      mimeType: file.mimetype,
      user_id: userId,
    };

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const documentUpload = async (req, res, next) => {
  let sqlQuery, con;
  try {
    const params = req.params;
    const { fileKey, fileName, mimeType, user_id } = res.locals.fileDetails;

    con = await pool.connect();

    const command = new PutObjectCommand(params);
    await s3.send(command);

    //save image details in db
    sqlQuery = `INSERT INTO documents(user_id, file_name, file_key, mime_type) VALUES($1, $2, $3, $4) RETURNING *`;

    const result = await con.query(sqlQuery, [
      user_id,
      fileName,
      fileKey,
      mimeType,
    ]);

    const document = result.rows[0];
    res.locals.document = document;

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  } finally {
    if (con) con.release();
  }
};

const deleteDocument = async (req, res, next) => {
  let sqlQuery, con;
  try {
    const { documentId, userId } = req.body;

    con = await pool.connect();

    sqlQuery = `SELECT file_key FROM documents WHERE id=$1 AND user_id=$2`;

    const result = await con.query(sqlQuery, [documentId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Document not found or access denied",
      });
    }

    const { file_key: fileKey } = result.rows[0];

    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    const deletedS3Object = new DeleteObjectCommand(deleteParams);
    await s3.send(deletedS3Object);

    sqlQuery = `DELETE FROM documents WHERE id=$1 AND user_id=$2`;

    await con.query(sqlQuery, [documentId, userId]);

    req.deletedDocument = { documentId, fileKey };

    next();
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to delete document",
    });
  } finally {
    if (con) con.release();
  }
};

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
    data: deletedDocument
  });
});

module.exports = router;
