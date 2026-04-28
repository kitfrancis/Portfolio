"use client";
import { useState, useEffect } from "react";
import { ProjectsList } from "./projects-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "web"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
        setFormData({ title: "", description: "", imageUrl: "", category: "web" });
        setShowAddForm(false);
      } else {
        console.error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter(
          (project) => project.category === activeFilter
        );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen scroll-smooth">
      <div className="lg:ml-64 mt-1 lg:mt-13 max-h-auto lg:px-5">
        <div className="max-w-full mx-auto py-5 p-6">
          <h1 className="flex justify-center items-center font-bold sm:text-4xl text-3xl">Projects</h1>
          <p className="flex justify-center items-center font-medium text-center px-0 md:px-40 mt-3 text-muted-foreground">
            Welcome to my online portfolio. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. I'm taking on freelance work at the moment. Want some help building your software?
          </p>

          <hr className="w-full border-solid border-gray-300 mt-10" />
          {/* <div className="flex justify-center mt-6">
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add New Project"}
            </Button>
          </div> */}

          {/* {showAddForm && (
            <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                  <input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                  >
                    <option value="web">Web App</option>
                    <option value="mobile">Mobile App</option>
                  </select>
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Project"}
                </Button>
              </form>
            </div>
          )} */}

         




          <div className="flex flex-row gap-10 items-center justify-center mt-10 ">
            {["all", "web", "mobile"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative pb-2 text-md font-semibold capitalize transition-colors
                  ${activeFilter === filter ? "text-foreground" : "text-gray-500 hover:text-gray-300"}
                `}
              >
                {filter === "all"
                  ? "All"
                  : filter === "web"
                  ? "Web App"
                  : "Mobile App"}

                {activeFilter === filter && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-500 transition-all duration-300"></span>
                )}
              </button>
            ))}
          </div>
          <ProjectsList projects={filteredProjects} />
        </div>
      </div>
    </main>
  );
}