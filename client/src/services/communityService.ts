import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const sharePromptWithCommunity = async (
  userId: string,
  promptId: string,
  communityId: number
): Promise<void> => {
  try {
    await addDoc(collection(db, "communityPosts"), {
      userId,
      promptId,
      communityId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sharing prompt with community:", error);
    throw error;
  }
};
