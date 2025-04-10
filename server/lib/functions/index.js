import * as functions from "firebase-functions";
import { admin } from "../config/firebase";
// Example function to get user profile
export const getUserProfile = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
        }
        const userRecord = await admin.auth().getUser(context.auth.uid);
        const response = {
            success: true,
            data: {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
            },
        };
        return response;
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
        return response;
    }
});
// Example function to create a prompt
export const createPrompt = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
        }
        const { title, content } = data;
        if (!title || !content) {
            throw new functions.https.HttpsError("invalid-argument", "Title and content are required");
        }
        const promptRef = admin.firestore().collection("prompts").doc();
        const prompt = {
            id: promptRef.id,
            userId: context.auth.uid,
            title,
            content,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await promptRef.set(prompt);
        const response = {
            success: true,
            data: prompt,
        };
        return response;
    }
    catch (error) {
        const response = {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
        return response;
    }
});
