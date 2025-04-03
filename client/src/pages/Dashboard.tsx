import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiSave, FiTag, FiX, FiEdit } from "react-icons/fi";

interface Prompt {
  id: string;
  title: string;
  content: string;
  output?: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const Dashboard = () => {
  // State management
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "General", color: "#3498db" },
    { id: "2", name: "Writing", color: "#2ecc71" },
    { id: "3", name: "Code", color: "#9b59b6" },
    { id: "4", name: "Images", color: "#e74c3c" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

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

  // Demo data
  useEffect(() => {
    // In a real app, you would fetch from an API
    const demoPrompts: Prompt[] = [
      {
        id: "1",
        title: "Blog Introduction",
        content:
          "Write an engaging introduction for a blog post about {topic}.",
        output: "Here's an engaging introduction about AI tools...",
        description: "Creates captivating blog post openings",
        category: "1",
        tags: ["writing", "blog", "content"],
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-06-15"),
      },
      {
        id: "2",
        title: "React Component",
        content:
          "Create a React functional component for {component_name} with these features: {features}",
        output: "import React from 'react';\n\nconst Button = () => {...}",
        description: "Generates React components with TypeScript",
        category: "3",
        tags: ["coding", "react", "typescript"],
        createdAt: new Date("2023-07-22"),
        updatedAt: new Date("2023-07-22"),
      },
      {
        id: "3",
        title: "Image Description",
        content: "Describe an image of {subject} with {style} style",
        description: "Creates detailed image descriptions for generation",
        category: "4",
        tags: ["images", "creative", "description"],
        createdAt: new Date("2023-08-05"),
        updatedAt: new Date("2023-09-12"),
      },
    ];
    setPrompts(demoPrompts);
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

  const handleNewCategory = () => {
    if (newCategory.trim()) {
      const newId = (categories.length + 1).toString();
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

      setCategories([
        ...categories,
        {
          id: newId,
          name: newCategory,
          color: randomColor,
        },
      ]);
      setNewCategory("");
      setIsAddingCategory(false);
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

  const handleSavePrompt = () => {
    const newPrompt: Prompt = {
      id: editMode ? formData.id : Date.now().toString(),
      title: formData.title,
      content: formData.content,
      output: formData.output,
      description: formData.description,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: editMode
        ? prompts.find((p) => p.id === formData.id)!.createdAt
        : new Date(),
      updatedAt: new Date(),
    };

    if (editMode) {
      setPrompts(prompts.map((p) => (p.id === newPrompt.id ? newPrompt : p)));
    } else {
      setPrompts([...prompts, newPrompt]);
    }

    setIsFormVisible(false);
  };

  const handleCloseViewPrompt = () => {
    setViewingPrompt(null);
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
          <button
            onClick={() => handleEditPrompt(viewingPrompt)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FiEdit size={18} />
            Edit Prompt
          </button>
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
              <button
                key={category.id}
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
            {filteredPrompts.length}{" "}
            {filteredPrompts.length === 1 ? "Prompt" : "Prompts"} Found
          </h2>

          <button
            className="md:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddPrompt}
          >
            <FiPlus className="text-sm" />
            Add
          </button>
        </div>

        {filteredPrompts.length === 0 ? (
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
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewPrompt(prompt)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{prompt.title}</h3>
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

                  <p className="text-gray-600 text-sm mb-3">
                    {prompt.description}
                  </p>

                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Prompt:</div>
                    <div className="bg-gray-50 p-2 rounded text-sm max-h-16 overflow-hidden">
                      {prompt.content}
                    </div>
                  </div>

                  {prompt.output && (
                    <div className="mb-3">
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
                onClick={() => setIsFormVisible(false)}
                className="text-gray-500 hover:text-gray-700"
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
                  disabled={!formData.title || !formData.content}
                >
                  Save Prompt
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 order-1 sm:order-2"
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
