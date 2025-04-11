import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryData {
  name: string;
  color: string;
}

const CATEGORIES_COLLECTION = "categories";

// Get all categories for a user
export const getUserCategories = async (
  userId: string
): Promise<Category[]> => {
  try {
    const categoriesQuery = query(
      collection(db, CATEGORIES_COLLECTION),
      where("userId", "==", userId)
    );

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      categoriesQuery
    );

    console.log(
      `Found ${querySnapshot.docs.length} categories for user ${userId}`
    );

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        color: data.color,
        userId: data.userId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Category;
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (
  userId: string,
  categoryData: CategoryData
): Promise<string> => {
  try {
    console.log("Creating new category in Firestore:", {
      userId,
      ...categoryData,
    });

    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...categoryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Successfully created category with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(docRef);
    console.log("Successfully deleted category:", categoryId);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
