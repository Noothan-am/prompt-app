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
  output?: string;
  description: string;
  category: string;
  tags: string[];
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
    // Try to use the compound index query first
    try {
      console.log("Attempting to fetch prompts with compound index...");
      const promptsQuery = query(
        collection(db, PROMPTS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        promptsQuery
      );

      console.log(
        `Found ${querySnapshot.docs.length} prompts with compound index`
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          output: data.output || "",
          description: data.description || "",
          category: data.category || "1",
          tags: data.tags || [],
          userId: data.userId,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Prompt;
      });
    } catch (indexError) {
      // If the index error occurs, fallback to a simpler query without sorting
      if (
        indexError instanceof Error &&
        indexError.toString().includes("requires an index")
      ) {
        console.warn(
          "Index error detected, falling back to simple query",
          indexError
        );

        // Fallback query without ordering
        const simpleQuery = query(
          collection(db, PROMPTS_COLLECTION),
          where("userId", "==", userId)
        );

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
          simpleQuery
        );

        console.log(
          `Found ${querySnapshot.docs.length} prompts with simple query`
        );

        // Sort the results in memory instead
        const results = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            output: data.output || "",
            description: data.description || "",
            category: data.category || "1",
            tags: data.tags || [],
            userId: data.userId,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Prompt;
        });

        // Sort by createdAt in descending order
        return results.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      } else {
        // If it's not an index error, rethrow
        throw indexError;
      }
    }
  } catch (error) {
    console.error("Error getting prompts:", error);

    // Show a message about creating the index
    if (
      error instanceof Error &&
      error.toString().includes("requires an index")
    ) {
      console.error(
        "This query requires a Firestore index. Please create the index by visiting the URL in the error message above."
      );
    }

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
      output: data.output || "",
      description: data.description || "",
      category: data.category || "1",
      tags: data.tags || [],
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
    console.log("Creating new prompt in Firestore:", { userId, ...promptData });

    const docRef = await addDoc(collection(db, PROMPTS_COLLECTION), {
      ...promptData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Successfully created prompt with ID:", docRef.id);
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
    console.log("Updating prompt in Firestore:", { promptId, ...promptData });

    const docRef = doc(db, PROMPTS_COLLECTION, promptId);
    await updateDoc(docRef, {
      ...promptData,
      updatedAt: serverTimestamp(),
    });

    console.log("Successfully updated prompt:", promptId);
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
