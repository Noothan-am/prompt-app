import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface PromptData {
  title: string;
  content: string;
}

export interface Prompt extends PromptData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PROMPTS_COLLECTION = "prompts";

// Get all prompts for a user
export const getUserPrompts = async (userId: string): Promise<Prompt[]> => {
  try {
    const promptsQuery = query(
      collection(db, PROMPTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      promptsQuery
    );

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        userId: data.userId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Prompt;
    });
  } catch (error) {
    console.error("Error getting prompts:", error);
    throw error;
  }
};

// Get single prompt by ID
export const getPromptById = async (
  promptId: string
): Promise<Prompt | null> => {
  try {
    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      content: data.content,
      userId: data.userId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Prompt;
  } catch (error) {
    console.error("Error getting prompt:", error);
    throw error;
  }
};

// Create a new prompt
export const createPrompt = async (
  userId: string,
  promptData: PromptData
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PROMPTS_COLLECTION), {
      ...promptData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating prompt:", error);
    throw error;
  }
};

// Update an existing prompt
export const updatePrompt = async (
  promptId: string,
  promptData: Partial<PromptData>
): Promise<void> => {
  try {
    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(docRef, {
      ...promptData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw error;
  }
};

// Delete a prompt
export const deletePrompt = async (promptId: string): Promise<void> => {
  try {
    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting prompt:", error);
    throw error;
  }
};
