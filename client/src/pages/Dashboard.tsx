import React, { useState, useEffect, FormEvent, useRef } from "react";
import {
  FiSearch,
  FiPlus,
  FiSave,
  FiTag,
  FiX,
  FiEdit,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
  getUserPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  Prompt as FirebasePrompt,
  PromptData,
} from "../services/promptService";
import { toast } from "react-hot-toast";
import { sharePromptWithCommunity } from "../services/communityService";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  getUserCategories,
  createCategory,
  deleteCategory,
  Category as FirebaseCategory,
} from "../services/categoryService";

interface Prompt extends FirebasePrompt {
  output?: string;
  description: string;
  category: string;
  tags: string[];
}

interface Category extends FirebaseCategory {}

// Add Community interface to match the one in CommunitiesPage
interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  joined: boolean;
  icon: string;
  posts: any[]; // Simplified as we don't need the full Post type here
}

const Dashboard = () => {
  const { user } = useAuth();
  // State management
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "General",
      color: "#3498db",
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityToShare, setSelectedCommunityToShare] = useState<
    number | null
  >(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    output: "",
    description: "",
    category: "",
    tags: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Add isSaving state to track when prompt is being saved
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;

      try {
        setIsCategoryLoading(true);
        const firebaseCategories = await getUserCategories(user.uid);

        // If there are no categories, keep the default General category
        if (firebaseCategories.length > 0) {
          setCategories(firebaseCategories);
        } else {
          // Create the default category in Firestore if none exists
          const defaultCategory = {
            name: "General",
            color: "#3498db",
          };

          try {
            const categoryId = await createCategory(user.uid, defaultCategory);
            setCategories([
              {
                id: categoryId,
                ...defaultCategory,
                userId: user.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]);
          } catch (err) {
            console.error("Error creating default category:", err);
            // Keep the default local category
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // If there's an error, we keep using the default categories
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  // Fetch prompts from Firebase
  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get prompts from Firestore
        const firebasePrompts = await getUserPrompts(user.uid);

        // Transform Firebase prompts to match our interface
        const transformedPrompts = firebasePrompts.map((prompt) => ({
          ...prompt,
          // Use existing values from Firestore if available, otherwise use defaults
          output: prompt.output || "",
          description: prompt.description || "",
          category: prompt.category || "1",
          tags: prompt.tags || [],
        }));

        console.log("Fetched prompts from Firestore:", transformedPrompts);
        setPrompts(transformedPrompts);
      } catch (err) {
        console.error("Error fetching prompts:", err);

        // Check if it's an index error
        if (
          err instanceof Error &&
          err.toString().includes("requires an index")
        ) {
          setError(
            "Database index needs to be created. Click the 'Create Index' button below to automatically set up the database."
          );
        } else {
          setError("Failed to load prompts. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [user]);

  // Fetch communities for sharing
  useEffect(() => {
    // In a real app, fetch from API
    // Using mock data similar to CommunitiesPage
    const mockCommunities: Community[] = [
      {
        id: 1,
        name: "AI Enthusiasts",
        description:
          "A community for AI enthusiasts to share and discuss the latest AI trends and tools.",
        members: 2453,
        joined: true,
        icon: "🤖",
        posts: [],
      },
      {
        id: 2,
        name: "Prompt Crafters",
        description:
          "Share your best prompts and collaborate with others to create better results.",
        members: 1856,
        joined: true,
        icon: "✍️",
        posts: [],
      },
      {
        id: 3,
        name: "Tech Innovations",
        description:
          "Discussing the latest tech innovations and their implications.",
        members: 3241,
        joined: true,
        icon: "💡",
        posts: [],
      },
      {
        id: 4,
        name: "Developersworld",
        description:
          "A community for developers to share knowledge and collaborate.",
        members: 4521,
        joined: true,
        icon: "👨‍💻",
        posts: [],
      },
    ];
    setCommunities(mockCommunities);
  }, []);

  // Filtered prompts based on search, category and tags
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = selectedCategory
      ? prompt.category === selectedCategory
      : true;

    const matchesTags =
      selectedTags.length > 0
        ? selectedTags.every((tag) => prompt.tags.includes(tag))
        : true;

    return matchesSearch && matchesCategory && matchesTags;
  });

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleNewCategory = async () => {
    if (!user) return;

    if (newCategory.trim()) {
      setIsCategoryLoading(true);

      // Generate random color
      const colors = [
        "#3498db",
        "#2ecc71",
        "#9b59b6",
        "#e74c3c",
        "#f39c12",
        "#1abc9c",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      try {
        // Create new category in Firestore
        const categoryData = {
          name: newCategory,
          color: randomColor,
        };

        const categoryId = await createCategory(user.uid, categoryData);

        const newCategoryObj = {
          id: categoryId,
          ...categoryData,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setCategories([...categories, newCategoryObj]);
        setNewCategory("");
        toast.success("Category added successfully!");
      } catch (err) {
        console.error("Error creating category:", err);
        toast.error("Failed to add category. Please try again.");
      } finally {
        setIsCategoryLoading(false);
        setIsAddingCategory(false);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;

    // Don't allow deleting the default General category
    if (categoryId === categories[0].id) {
      toast.error("Cannot delete the default category.");
      return;
    }

    // Confirm deletion
    if (
      !window.confirm(
        "Are you sure you want to delete this category? All prompts in this category will be moved to General."
      )
    ) {
      return;
    }

    try {
      setIsCategoryLoading(true);

      // Delete the category from Firestore
      await deleteCategory(categoryId);

      // Update prompts with this category to use the default category
      const updatedPrompts = prompts.map((p) => {
        if (p.category === categoryId) {
          return { ...p, category: categories[0].id };
        }
        return p;
      });
      setPrompts(updatedPrompts);

      // Remove the category from state
      setCategories(categories.filter((c) => c.id !== categoryId));

      // If we were filtering by this category, clear the filter
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }

      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddPrompt = () => {
    setFormData({
      id: "",
      title: "",
      content: "",
      output: "",
      description: "",
      category: categories[0].id,
      tags: "",
    });
    setEditMode(false);
    setIsFormVisible(true);
  };

  const handleViewPrompt = (prompt: Prompt) => {
    setViewingPrompt(prompt);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setFormData({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      output: prompt.output || "",
      description: prompt.description,
      category: prompt.category,
      tags: prompt.tags.join(", "),
    });
    setEditMode(true);
    setIsFormVisible(true);
    setViewingPrompt(null);
  };

  const handleSavePrompt = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const promptData: PromptData = {
        title: formData.title,
        content: formData.content,
        output: formData.output,
        description: formData.description,
        category: formData.category || "1",
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editMode) {
        // Update existing prompt
        await updatePrompt(formData.id, promptData);

        // Update the prompt in local state
        setPrompts((prevPrompts) =>
          prevPrompts.map((p) =>
            p.id === formData.id
              ? {
                  ...p,
                  ...promptData,
                  updatedAt: new Date(),
                }
              : p
          )
        );

        toast.success("Prompt updated successfully!");
      } else {
        // Create new prompt
        const promptId = await createPrompt(user.uid, promptData);

        // Add the new prompt to the local state immediately at the beginning of the array
        const newPrompt: Prompt = {
          ...promptData,
          id: promptId,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setPrompts((prevPrompts) => [newPrompt, ...prevPrompts]);
        toast.success("Prompt created successfully!");
      }

      // Reset form and close modal
      setIsFormVisible(false);
      setEditMode(false);
      setFormData({
        id: "",
        title: "",
        content: "",
        output: "",
        description: "",
        category: "",
        tags: "",
      });
    } catch (err) {
      toast.error("Failed to save prompt. Please try again.");
      console.error("Error saving prompt:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!user) return;

    try {
      await deletePrompt(promptId);

      // Update local state by filtering out the deleted prompt
      setPrompts((prevPrompts) => prevPrompts.filter((p) => p.id !== promptId));

      toast.success("Prompt deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete prompt. Please try again.");
      console.error("Error deleting prompt:", err);
    }
  };

  const handleCloseViewPrompt = () => {
    setViewingPrompt(null);
  };

  // Function to handle sharing prompt to community
  const handleSharePrompt = async () => {
    if (!user || !viewingPrompt || !selectedCommunityToShare) return;

    try {
      setShareLoading(true);
      await sharePromptWithCommunity(
        user.uid,
        viewingPrompt.id,
        selectedCommunityToShare
      );
      setShareSuccess(true);
      toast.success("Prompt shared successfully!");
    } catch (err) {
      toast.error("Failed to share prompt. Please try again.");
      console.error("Error sharing prompt:", err);
    } finally {
      setShareLoading(false);
      setTimeout(() => {
        setShowShareModal(false);
        setShareSuccess(false);
        setSelectedCommunityToShare(null);
      }, 2000);
    }
  };

  // Extract all unique tags from prompts
  const allTags = Array.from(new Set(prompts.flatMap((prompt) => prompt.tags)));

  if (viewingPrompt) {
    const category = categories.find((c) => c.id === viewingPrompt.category);

    return (
      <div className="flex flex-col h-full bg-gray-50 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleCloseViewPrompt}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Prompts
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiShare2 size={18} />
              Share to Community
            </button>
            <button
              onClick={() => handleEditPrompt(viewingPrompt)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiEdit size={18} />
              Edit Prompt
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{viewingPrompt.title}</h1>
            {category && (
              <span
                className="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{viewingPrompt.description}</p>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Prompt Content</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm">
              {viewingPrompt.content}
            </div>
          </div>

          {viewingPrompt.output && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Sample Output</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm">
                {viewingPrompt.output}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {viewingPrompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6 text-sm text-gray-500">
            <p>Created: {viewingPrompt.createdAt.toLocaleDateString()}</p>
            <p>Last Updated: {viewingPrompt.updatedAt.toLocaleDateString()}</p>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Share to Community</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                {shareSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      Shared Successfully!
                    </h4>
                    <p className="text-gray-600">
                      Your prompt has been shared to the community.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-700 text-sm mb-4">
                        Share your prompt "{viewingPrompt.title}" with a
                        community to get feedback and help others.
                      </div>
                    </div>
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Select a community:
                    </div>
                    <div className="max-h-60 overflow-y-auto mb-6 space-y-2">
                      {communities.map((community) => (
                        <div
                          key={community.id}
                          onClick={() =>
                            setSelectedCommunityToShare(community.id)
                          }
                          className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${
                            selectedCommunityToShare === community.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="mr-3 h-12 w-12 flex items-center justify-center text-3xl bg-gray-100 rounded-lg">
                            {community.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{community.name}</h4>
                            <p className="text-xs text-gray-500">
                              {community.members.toLocaleString()} members
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSharePrompt}
                        disabled={!selectedCommunityToShare || shareLoading}
                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center ${
                          !selectedCommunityToShare || shareLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-700 transition-colors"
                        }`}
                      >
                        {shareLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sharing...
                          </>
                        ) : (
                          "Share Prompt"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 md:p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6">Prompt Dashboard</h1>

        {/* Search and Add Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts, tags, or descriptions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            onClick={handleAddPrompt}
          >
            <FiPlus />
            Add New Prompt
          </button>
        </div>

        {/* Categories */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isAddingCategory ? "Cancel" : "+ Add Category"}
            </button>
          </div>

          {isAddingCategory && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="New category name"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                onClick={handleNewCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-1">
                <button
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? "bg-gray-100 border-gray-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  {category.name}
                </button>

                {/* Don't show delete button for the first/default category */}
                {category.id !== categories[0].id && (
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="ml-1 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                    title="Delete category"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <FiTag className="text-xs" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt List */}
      <div className="p-4 md:p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isLoading
              ? "Loading prompts..."
              : `${filteredPrompts.length} ${
                  filteredPrompts.length === 1 ? "Prompt" : "Prompts"
                } Found`}
          </h2>

          <button
            className="md:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddPrompt}
          >
            <FiPlus className="text-sm" />
            Add
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex flex-col items-center gap-3">
              {error.includes("index") ? (
                <a
                  href="https://console.firebase.google.com/v1/r/project/prompt-app-be1a2/firestore/indexes?create_composite=ClBwcm9qZWN0cy9wcm9tcHQtYXBwLWJlMWEyL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9wcm9tcHRzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-8" />
                    <path d="M18 2l-6 6" />
                    <path d="M14 2h4v4" />
                  </svg>
                  Create Index
                </a>
              ) : null}
              <button
                onClick={() => {
                  setIsLoading(true);
                  if (user) {
                    getUserPrompts(user.uid)
                      .then((prompts) => {
                        const transformedPrompts = prompts.map((prompt) => ({
                          ...prompt,
                          output: prompt.output || "",
                          description: prompt.description || "",
                          category: prompt.category || "1",
                          tags: prompt.tags || [],
                        }));
                        setPrompts(transformedPrompts);
                        setError(null);
                      })
                      .catch((err) => {
                        console.error("Error retrying fetch:", err);

                        if (
                          err instanceof Error &&
                          err.toString().includes("requires an index")
                        ) {
                          setError(
                            "Database index needs to be created. Click the 'Create Index' button above to automatically set up the database."
                          );
                        } else {
                          setError("Failed to load prompts. Please try again.");
                        }
                      })
                      .finally(() => setIsLoading(false));
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500">
            No prompts found. Try adjusting your filters or add a new prompt.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt) => {
              const category = categories.find((c) => c.id === prompt.category);

              return (
                <div
                  key={prompt.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                      onClick={() => handleViewPrompt(prompt)}
                    >
                      {prompt.title}
                    </h3>
                    {category && (
                      <span
                        className="px-2 py-1 text-xs rounded-full whitespace-nowrap"
                        style={{
                          backgroundColor: `${category.color}15`,
                          color: category.color,
                        }}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>

                  <p
                    className="text-gray-600 text-sm mb-3 cursor-pointer"
                    onClick={() => handleViewPrompt(prompt)}
                  >
                    {prompt.description}
                  </p>

                  <div
                    className="mb-3 cursor-pointer"
                    onClick={() => handleViewPrompt(prompt)}
                  >
                    <div className="text-xs text-gray-500 mb-1">Prompt:</div>
                    <div className="bg-gray-50 p-2 rounded text-sm max-h-16 overflow-hidden">
                      {prompt.content}
                    </div>
                  </div>

                  {prompt.output && (
                    <div
                      className="mb-3 cursor-pointer"
                      onClick={() => handleViewPrompt(prompt)}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        Sample Output:
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-sm max-h-16 overflow-hidden">
                        {prompt.output}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditPrompt(prompt)}
                      className="text-gray-600 hover:text-blue-600 text-sm flex items-center"
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingPrompt(prompt);
                        setShowShareModal(true);
                      }}
                      className="text-gray-600 hover:text-green-600 text-sm flex items-center"
                    >
                      <FiShare2 className="mr-1" /> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Prompt Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 overflow-y-auto">
          <div className="bg-white w-[90%] h-[70%] md:w-[95%] lg:w-[90%] md:max-w-2xl rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg md:text-xl font-bold">
                {editMode ? "Edit Prompt" : "Add New Prompt"}
              </h2>
              <button
                onClick={() => {
                  if (!isSaving) {
                    setIsFormVisible(false);
                    // Reset form data when closing the modal
                    setFormData({
                      id: "",
                      title: "",
                      content: "",
                      output: "",
                      description: "",
                      category: categories[0]?.id || "1",
                      tags: "",
                    });
                    setEditMode(false);
                  }
                }}
                disabled={isSaving}
                className={`text-gray-500 hover:text-gray-700 ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto flex-grow">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter prompt title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of what this prompt does"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-8"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter your prompt template here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20 md:h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Output (Optional)
                  </label>
                  <textarea
                    name="output"
                    value={formData.output}
                    onChange={handleInputChange}
                    placeholder="Example of the output this prompt generates..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20 md:h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="writing, blog, seo, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50 sticky bottom-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSavePrompt}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed order-2 sm:order-1"
                  disabled={!formData.title || !formData.content || isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Prompt
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSaving) {
                      setIsFormVisible(false);
                      // Reset form data when closing the modal
                      setFormData({
                        id: "",
                        title: "",
                        content: "",
                        output: "",
                        description: "",
                        category: categories[0]?.id || "1",
                        tags: "",
                      });
                      setEditMode(false);
                    }
                  }}
                  disabled={isSaving}
                  className={`flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 order-1 sm:order-2 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
