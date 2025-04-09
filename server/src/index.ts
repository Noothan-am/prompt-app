import { initializeApp, cert } from "firebase-admin/app";
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
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Firebase
const firebaseConfig = {
  // When running as Firebase Function, we use the default config
  // For local development, these values can be set in .env
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialize with default credentials when running as a Firebase function
// Or use the provided credentials for local development
if (
  process.env.NODE_ENV === "development" &&
  firebaseConfig.projectId &&
  firebaseConfig.clientEmail &&
  firebaseConfig.privateKey
) {
  initializeApp({
    credential: cert(firebaseConfig as any),
  });
} else {
  initializeApp();
}

// Get Firebase services
const db = getFirestore();
const auth = getAuth();

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

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

// If running directly (not as Firebase function)
if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

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
