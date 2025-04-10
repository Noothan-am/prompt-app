import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";
import { ApiResponse } from "../types";

// Define types
export interface CreatePromptData {
  title: string;
  content: string;
}

// Call getUserProfile function
export const callGetUserProfile = async (): Promise<ApiResponse<any>> => {
  try {
    const getUserProfileFunction = httpsCallable<void, ApiResponse<any>>(
      functions,
      "getUserProfile"
    );

    const result = await getUserProfileFunction();
    return result.data;
  } catch (error) {
    console.error("Error calling getUserProfile function:", error);
    throw error;
  }
};

// Call createPrompt function
export const callCreatePrompt = async (
  promptData: CreatePromptData
): Promise<ApiResponse<any>> => {
  try {
    const createPromptFunction = httpsCallable<
      CreatePromptData,
      ApiResponse<any>
    >(functions, "createPrompt");

    const result = await createPromptFunction(promptData);
    return result.data;
  } catch (error) {
    console.error("Error calling createPrompt function:", error);
    throw error;
  }
};
