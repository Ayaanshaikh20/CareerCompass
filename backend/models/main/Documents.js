const { dbClient, getTableName } = require("../../config/dbConnect");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { bucketName, s3 } = require("../../config/s3client");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { DeleteCommand, PutCommand, QueryCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const randomImageName = () => crypto.randomUUID();

const getDocument = async (req, res, next) => {
  try {
    const { userId } = req;

    const documents = await dbClient.send(
      new QueryCommand({
        TableName: getTableName("documents"),
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    const documentsWithUrls = await Promise.all(
      documents.Items.map(async (doc) => {
        const getObjectParams = {
          Bucket: bucketName,
          Key: doc.file_key,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return {
          id: doc.document_id,
          userId: doc.user_id,
          fileName: doc.file_name,
          fileKey: doc.file_key,
          mimeType: doc.mime_type,
          url: url,
        };
      })
    );

    req.documents = documentsWithUrls;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error fetching documents",
    });
  }
};

const documentRead = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { file } = req.files;
    const { userId } = req;

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
  try {
    const params = req.params;
    const { fileKey, fileName, mimeType, user_id } = res.locals.fileDetails;

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const documentId = crypto.randomUUID();

    await dbClient.send(
      new PutCommand({
        TableName: getTableName("documents"),
        Item: {
          document_id: documentId,
          user_id: user_id,
          file_name: fileName,
          file_key: fileKey,
          mime_type: mimeType,
        },
      })
    );

    res.locals.document = {
      id: documentId,
      userId: user_id,
      fileName: fileName,
      fileKey: fileKey,
      mimeType: mimeType,
    };

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { documentId } = req.query;
    const { userId } = req;

    const getResult = await dbClient.send(
      new GetCommand({
        TableName: getTableName("documents"),
        Key: { document_id: documentId, user_id: userId },
      }),
    );

    const fileKey = getResult.Item?.file_key;

    if (!fileKey) {
      return res.status(404).json({
        status: 404,
        message: "Document not found",
      });
    }

    await dbClient.send(
      new DeleteCommand({
        TableName: getTableName("documents"),
        Key: { document_id: documentId, user_id: userId },
      }),
    );

    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    const deletedS3Object = new DeleteObjectCommand(deleteParams);
    await s3.send(deletedS3Object);

    req.deletedDocument = { documentId, fileKey };

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message || "Failed to delete document",
    });
  }
};

module.exports = {
  getDocument,
  documentRead,
  documentUpload,
  deleteDocument,
};