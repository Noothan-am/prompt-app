import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";

// Initialize Firebase
initializeApp();

// Get Firebase services
const db = getFirestore();
const auth = getAuth();

// Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Prompt App API" });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
};

app.use(errorHandler);

// Export the API as a Firebase Cloud Function
export const api = onRequest(app);

// Function to get user profile
export const getUserProfile = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userRecord = await auth.getUser(request.auth.uid);

    return {
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
});

// Function to create a prompt
export const createPrompt = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const { title, content } = request.data;
    if (!title || !content) {
      throw new HttpsError(
        "invalid-argument",
        "Title and content are required"
      );
    }

    const promptRef = db.collection("prompts").doc();
    const prompt = {
      id: promptRef.id,
      userId: request.auth.uid,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await promptRef.set(prompt);

    return {
      success: true,
      data: prompt,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
});
