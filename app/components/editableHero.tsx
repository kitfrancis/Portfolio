"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
};

type Stack = { id: string; name: string };

export default function EditableHero({ bio, name: initialName }: { bio: string; name: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bioText, setBioText] = useState(bio);
  const [name, setName] = useState(initialName);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [frontendStacks, setFrontendStacks] = useState<Stack[]>([]);
  const [backendStacks, setBackendStacks] = useState<Stack[]>([]);
  const [newFrontend, setNewFrontend] = useState("");
  const [newBackend, setNewBackend] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "web",
  });

  useEffect(() => {
    setBioText(bio);
    setName(initialName);
  }, [bio, initialName]);

  useEffect(() => {
    if (open && session) return;
    fetchAll();
  }, [open, session]);

  const fetchAll = async () => {
    const [fe, be, proj, bioData] = await Promise.all([
      fetch("/api/frontend-stack").then((r) => r.json()),
      fetch("/api/backend-stack").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/bio").then((r) => r.json()),
    ]);
    setFrontendStacks(fe);
    setBackendStacks(be);
    setProjects(proj);
    if (bioData) {
      setBioText(bioData.bio || "");
      setName(bioData.name || "");
      setImageUrl(bioData.imageUrl || "");
      setImagePreview(bioData.imageUrl || "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const saveBio = async () => {
    await fetch("/api/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio: bioText, imageUrl }),
    });
    toast.success("Bio saved!");
    router.refresh();
  };

  const saveImage = async () => {
    if (!imageUrl) {
      toast.error("Please select an image first");
      return;
    }
    setUploading(true);
    try {
      await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio: bioText, imageUrl }),
      });
      toast.success("Profile picture updated!");
      router.refresh();
    } catch {
      toast.error("Failed to save image");
    } finally {
      setUploading(false);
    }
  };

  const addFrontend = async () => {
    if (!newFrontend.trim()) return;
    const res = await fetch("/api/frontend-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFrontend }),
    });
    const created = await res.json();
    setFrontendStacks((prev) => [created, ...prev]);
    setNewFrontend("");
    toast.success("Frontend stack added!");
    router.refresh();
  };

  const deleteFrontend = async (id: string) => {
    await fetch(`/api/frontend-stack/${id}`, { method: "DELETE" });
    setFrontendStacks((prev) => prev.filter((s) => s.id !== id));
    await fetchAll();
    toast.success("Deleted!");
    router.refresh();
  };

  const addBackend = async () => {
    if (!newBackend.trim()) return;
    const res = await fetch("/api/backend-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBackend }),
    });
    const created = await res.json();
    setBackendStacks((prev) => [created, ...prev]);
    setNewBackend("");
    toast.success("Backend stack added!");
    router.refresh();
  };

  const deleteBackend = async (id: string) => {
    await fetch(`/api/backend-stack/${id}`, { method: "DELETE" });
    setBackendStacks((prev) => prev.filter((s) => s.id !== id));
    await fetchAll();
    toast.success("Deleted!");
    router.refresh();
  };

  const addProject = async () => {
    if (!newProject.title.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    const created = await res.json();
    setProjects((prev) => [created, ...prev]);
    setNewProject({ title: "", description: "", imageUrl: "", category: "web" });
    toast.success("Project added!");
    router.refresh();
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await fetchAll();
    toast.success("Project deleted!");
    router.refresh();
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl text-slate-800 dark:text-slate-100">
          Hi, I'm <span className="text-cyan-500">{name}</span>
        </h1>
        <p className="py-5 sm:py-6 text-sm text-muted-foreground sm:text-lg">
          {bioText}
        </p>
      </div>

      {session && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="fixed top-15 right-4 z-50" size="sm" variant="outline">
              ✏️
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Portfolio</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="bio">
              <TabsList className="w-full">
                <TabsTrigger value="bio">Bio</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="stack">Tech Stack</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* Bio Tab */}
              <TabsContent value="bio" className="flex flex-col gap-3 mt-4">
                <label className="font-semibold text-sm">Name</label>
                <input
                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className="font-semibold text-sm">Bio</label>
                <textarea
                  className="border rounded px-3 py-2 text-sm h-32 resize-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                />
                <Button onClick={saveBio}>Save Bio</Button>
              </TabsContent>

              {/* Image Tab */}
              <TabsContent value="image" className="flex flex-col gap-4 mt-4">
                {/* Avatar preview with click-to-upload */}
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 dark:border-zinc-700 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src={imagePreview || "/images/nopp.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <span className="text-white text-xl">📷</span>
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Click the avatar to upload · Max 2MB · JPG, PNG, WEBP
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Or paste URL fallback */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Or paste an image URL
                  </label>
                  <input
                    className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                    placeholder="https://..."
                    value={imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                  />
                </div>

                <Button onClick={saveImage} disabled={uploading}>
                  {uploading ? "Saving..." : "Save Profile Picture"}
                </Button>
              </TabsContent>

              {/* Stack Tab */}
              <TabsContent value="stack" className="flex flex-col gap-4 mt-4">
                <div>
                  <p className="font-semibold text-sm mb-2">Frontend</p>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="border rounded px-3 py-2 text-sm flex-1 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                      placeholder="e.g. React"
                      value={newFrontend}
                      onChange={(e) => setNewFrontend(e.target.value)}
                    />
                    <Button onClick={addFrontend}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frontendStacks.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1 border rounded px-2 py-1 text-xs bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-300"
                      >
                        {s.name}
                        <button onClick={() => deleteFrontend(s.id)} className="text-red-500 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-2">Backend & Database</p>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="border rounded px-3 py-2 text-sm flex-1 bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                      placeholder="e.g. Node.js"
                      value={newBackend}
                      onChange={(e) => setNewBackend(e.target.value)}
                    />
                    <Button onClick={addBackend}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {backendStacks.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1 border rounded px-2 py-1 text-xs bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-300"
                      >
                        {s.name}
                        <button onClick={() => deleteBackend(s.id)} className="text-red-500 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="flex flex-col gap-4 mt-4">
                <p className="font-semibold text-sm">Add New Project</p>
                <input
                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  placeholder="Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                />
                <textarea
                  className="border rounded px-3 py-2 text-sm h-20 resize-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                />
                <input
                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  placeholder="Image URL"
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject((p) => ({ ...p, imageUrl: e.target.value }))}
                />
                <select
                  className="border rounded px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100"
                  value={newProject.category}
                  onChange={(e) => setNewProject((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="other">Other</option>
                </select>
                <Button onClick={addProject}>Add Project</Button>

                <hr className="dark:border-zinc-700" />
                <p className="font-semibold text-sm">Existing Projects</p>
                <div className="flex flex-col gap-2">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border rounded px-3 py-2 text-sm dark:border-zinc-700 dark:text-slate-300"
                    >
                      <span>{p.title}</span>
                      <button onClick={() => deleteProject(p.id)} className="text-red-500 text-xs">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 