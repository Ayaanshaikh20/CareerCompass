const { dbClient, getTableName } = require("../../config/dbConnect");
const {
  ScanCommand,
  UpdateCommand,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const pdf = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const { randomUUID } = require("crypto");

//There are three plans (FREE, PRO, PREMIUM)
const PLAN_LIMITS = {
  FREE: 5,
  PRO: 50,
  PREMIUM: 200,
};

const activateFreeTrial = async (req, res, next) => {
  try {
    const userId = req.userId;
    // Check if user already has a plan
    const result = await dbClient.send(
      new GetCommand({
        TableName: getTableName("register_users"),
        Key: { user_id: userId },
      }),
    );
    if (result.Item?.plan) {
      return res.status(400).json({
        status: 400,
        message: "You already have an active plan",
      });
    }
    // Activate free trial
    await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("register_users"),
        Key: { user_id: userId },
        UpdateExpression: "SET #plan = :plan, analyses_used = :used",
        ExpressionAttributeNames: {
          "#plan": "plan",
        },
        ExpressionAttributeValues: {
          ":plan": "FREE",
          ":used": 0,
        },
      }),
    );
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to activate free trial",
    });
  }
};

//(1)
const validateSubscription = async (req, res, next) => {
  const userId = req.userId;
  //get all user information from db using the userid
  const result = await dbClient.send(
    new GetCommand({
      TableName: getTableName("register_users"),
      Key: {
        user_id: userId,
      },
    }),
  );
  res.locals.userInfo = result.Item;
  next();
};

//(2)
const validateLimit = async (req, res, next) => {
  //validate userAnalysesLimit
  const {
    userInfo: { plan, analyses_used },
  } = res.locals;

  //if exhausted limit then return error
  if (plan == "FREE" && analyses_used >= PLAN_LIMITS[plan]) {
    return res.status(402).json({
      status: 402,
      message: "Free analysis limit exceeded. Please upgrade your plan.",
    });
  } else if (
    (plan == "PRO" && analyses_used >= PLAN_LIMITS[plan]) ||
    (plan == "PREMIUM" && analyses_used >= PLAN_LIMITS[plan])
  ) {
    return res
      .status(402)
      .json({ status: 402, message: "Analysis limit exceeded for the month." });
  }
  next();
};

//(3)
const extractContent = async (req, res, next) => {
  const { userInfo } = res.locals;
  const { jobDescription, jobTitle } = req.body;
  const { resume } = req.files;
  const { mimetype } = resume;
  //parse pdf
  if (mimetype === "application/pdf") {
    const parser = await pdf(resume.data);
    if (parser) {
      res.locals.resumeText = parser.text;
      res.locals.jobTitle = jobTitle;
      res.locals.jobDescription = jobDescription;
    } else {
      return res.status(400).json({
        status: 400,
        message: "Failed to parse PDF",
      });
    }
  } else if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    //parse docx
  }
  next();
};

//(4)
const analyzeResume = async (req, res, next) => {
  const { resumeText, jobTitle, jobDescription } = res.locals;
  //call openai api with the prompt and get the response
  const prompt = `
    You are an ATS resume analyzer.
    Job Title: ${jobTitle}
    Job Description: ${jobDescription}
    Resume: ${resumeText}
    
    Analyze the resume against the job description.
    Return ONLY valid JSON.
    {
      "overallScore": number,
      "matchedSkills": [],
      "missingSkills": [],
      "strengths": [],
      "improvements": [],
      "summary": ""
    }
  `;
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response) {
      res.locals.analysisResult = JSON.parse(response.text);
      next();
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to analyze resume",
    });
  }
};

//(5)
const saveAnalysis = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { analysisResult } = res.locals;
    const analysisId = randomUUID();
    const {
      overallScore,
      matchedSkills,
      missingSkills,
      strengths,
      improvements,
      summary,
    } = analysisResult;

    await dbClient.send(
      new PutCommand({
        TableName: getTableName("resume_analyses"),
        Item: {
          analysis_id: analysisId,
          user_id: userId,
          date: new Date().toISOString(),
          overall_score: overallScore,
          matched_skills: matchedSkills,
          missing_skills: missingSkills,
          strengths: strengths,
          improvements: improvements,
          summary: summary,
        },
      }),
    );
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to save analysis",
    });
  }
};

const incrementAnalysisCount = async (req, res, next) => {
  try {
    const userId = req.userId;
    await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("register_users"),
        Key: {
          user_id: userId
        },
        UpdateExpression: 
        `
          SET
          analyses_used = if_not_exists(analyses_used, :start) + :inc
        `,
        ExpressionAttributeValues: {
          ":start": 0,
          ":inc": 1
        }
      })
    );
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Failed to increment analysis count",
    });
  }
};

module.exports = {
  validateLimit,
  validateSubscription,
  extractContent,
  analyzeResume,
  activateFreeTrial,
  saveAnalysis,
  incrementAnalysisCount
};
