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
import { Pencil, Camera, X } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
};

type Stack = { id: string; name: string };

type ExperienceItem = {
  id: string;
  type: string;
  title: string;
  org: string;
  years: string;
  current: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

const emptyExperience = {
  type: "",
  title: "",
  org: "",
  years: "",
  current: false,
  summary: "",
  highlightsText: "",
  stackText: "",
};

// Shared look for every input in the edit dialog
const field =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500";
const labelClass = "font-mono text-xs text-muted-foreground";
const chipClass =
  "flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground";

// Only keep real items that have an id, and drop duplicates
function cleanList<T extends { id?: string }>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return (value as T[]).filter((item) => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function getJson(url: string) {
  try {
    const res = await fetch(url);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Resize + compress an image file to a small JPEG data URL
function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image failed"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas failed"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function EditableHero({ bio, name: initialName }: { bio: string; name: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileRef = useRef<HTMLInputElement>(null);

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

  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [expForm, setExpForm] = useState(emptyExperience);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [savingExp, setSavingExp] = useState(false);

  useEffect(() => {
    setBioText(bio);
    setName(initialName);
  }, [bio, initialName]);

  useEffect(() => {
    if (!open || !session) return;
    fetchAll();
  }, [open, session]);

  const fetchAll = async () => {
    const [fe, be, proj, bioData, exp] = await Promise.all([
      getJson("/api/frontend-stack"),
      getJson("/api/backend-stack"),
      getJson("/api/projects"),
      getJson("/api/bio"),
      getJson("/api/experience"),
    ]);
    setFrontendStacks(cleanList<Stack>(fe));
    setBackendStacks(cleanList<Stack>(be));
    setProjects(cleanList<Project>(proj));
    setExperiences(cleanList<ExperienceItem>(exp));
    if (bioData && !bioData.error) {
      setBioText(bioData.bio || "");
      setName(bioData.name || "");
      setImageUrl(bioData.imageUrl || "");
      setImagePreview(bioData.imageUrl || "");
    }
  };

  // Profile photo is now compressed too, so it never gets stored as a huge string
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    try {
      const dataUrl = await compressImage(file, 900);
      setImageUrl(dataUrl);
      setImagePreview(dataUrl);
    } catch {
      toast.error("Could not read that image");
    }
  };

  const handleProjectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      setNewProject((p) => ({ ...p, imageUrl: dataUrl }));
    } catch {
      toast.error("Could not read that image");
    }
  };

  const saveBio = async () => {
    const res = await fetch("/api/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio: bioText, imageUrl }),
    });
    if (!res.ok) {
      toast.error("Failed to save bio");
      return;
    }
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
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio: bioText, imageUrl }),
      });
      if (!res.ok) throw new Error("save failed");
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
    const created = await res.json().catch(() => null);
    if (!res.ok || !created?.id) {
      toast.error("Failed to add frontend stack");
      return;
    }
    setFrontendStacks((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
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
    const created = await res.json().catch(() => null);
    if (!res.ok || !created?.id) {
      toast.error("Failed to add backend stack");
      return;
    }
    setBackendStacks((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
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
    if (!newProject.imageUrl) {
      toast.error("Please choose a project image");
      return;
    }
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    const created = await res.json().catch(() => null);
    if (!res.ok || !created?.id) {
      toast.error("Failed to add project");
      return;
    }
    setProjects((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
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

  const resetExpForm = () => {
    setExpForm(emptyExperience);
    setEditingExpId(null);
  };

  const startEditExperience = (item: ExperienceItem) => {
    setEditingExpId(item.id);
    setExpForm({
      type: item.type,
      title: item.title,
      org: item.org,
      years: item.years,
      current: item.current,
      summary: item.summary,
      highlightsText: item.highlights.join("\n"),
      stackText: item.stack.join(", "),
    });
  };

  const saveExperience = async () => {
    if (!expForm.title.trim() || !expForm.org.trim() || !expForm.years.trim()) {
      toast.error("Title, organization and years are required");
      return;
    }
    setSavingExp(true);
    try {
      const payload = {
        type: expForm.type,
        title: expForm.title,
        org: expForm.org,
        years: expForm.years,
        current: expForm.current,
        summary: expForm.summary,
        highlights: expForm.highlightsText.split("\n").map((h) => h.trim()).filter(Boolean),
        stack: expForm.stackText.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const editing = editingExpId;
      const res = await fetch(editing ? `/api/experience/${editing}` : "/api/experience", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await res.json().catch(() => null);
      if (!res.ok || !saved?.id) {
        toast.error(saved?.error || "Failed to save experience");
        return;
      }
      setExperiences((prev) =>
        editing
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [saved, ...prev.filter((x) => x.id !== saved.id)]
      );
      resetExpForm();
      toast.success(editing ? "Experience updated!" : "Experience added!");
      router.refresh();
    } catch {
      toast.error("Failed to save experience");
    } finally {
      setSavingExp(false);
    }
  };

  const deleteExperience = async (id: string) => {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete experience");
      return;
    }
    setExperiences((prev) => prev.filter((x) => x.id !== id));
    if (editingExpId === id) resetExpForm();
    toast.success("Experience deleted!");
    router.refresh();
  };

  return (
    <>
      <div>
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl">Hi, I’m {name}</h1>
        <p className="max-w-xl py-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{bioText}</p>
      </div>

      {session && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed right-4 top-20 z-50 rounded-full"
              size="icon"
              variant="outline"
              aria-label="Edit portfolio"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-sm">Edit portfolio</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="bio">
              <TabsList className="w-full">
                <TabsTrigger value="bio">Bio</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="stack">Tech stack</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>

              {/* Bio Tab */}
              <TabsContent value="bio" className="mt-4 flex flex-col gap-3">
                <label htmlFor="e-name" className={labelClass}>Name</label>
                <input id="e-name" className={field} value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="e-bio" className={labelClass}>Bio</label>
                <textarea
                  id="e-bio"
                  className={`${field} h-32 resize-none`}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                />
                <Button onClick={saveBio}>Save bio</Button>
              </TabsContent>

              {/* Image Tab */}
              <TabsContent value="image" className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Choose a profile picture"
                    className="group relative h-32 w-32 overflow-hidden rounded-full border-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    <img
                      src={imagePreview || "/images/nopp.png"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Camera className="h-5 w-5" />
                      <span className="text-xs font-medium">Change</span>
                    </span>
                  </button>
                  <p className="font-mono text-xs text-muted-foreground">Click the photo to upload · Max 5MB · JPG, PNG, WEBP</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="e-url" className={labelClass}>Or paste an image URL</label>
                  <input
                    id="e-url"
                    className={field}
                    placeholder="https://..."
                    value={imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                  />
                </div>

                <Button onClick={saveImage} disabled={uploading}>
                  {uploading ? "Saving..." : "Save profile picture"}
                </Button>
              </TabsContent>

              {/* Stack Tab */}
              <TabsContent value="stack" className="mt-4 flex flex-col gap-6">
                <div>
                  <p className={`${labelClass} mb-2`}>Frontend</p>
                  <div className="mb-3 flex gap-2">
                    <input
                      className={`${field} flex-1`}
                      placeholder="e.g. React"
                      aria-label="New frontend skill"
                      value={newFrontend}
                      onChange={(e) => setNewFrontend(e.target.value)}
                    />
                    <Button onClick={addFrontend}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frontendStacks.map((s) => (
                      <span key={s.id} className={chipClass}>
                        {s.name}
                        <button
                          onClick={() => deleteFrontend(s.id)}
                          aria-label={`Remove ${s.name}`}
                          className="text-red-500 transition hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`${labelClass} mb-2`}>Backend & database</p>
                  <div className="mb-3 flex gap-2">
                    <input
                      className={`${field} flex-1`}
                      placeholder="e.g. Node.js"
                      aria-label="New backend skill"
                      value={newBackend}
                      onChange={(e) => setNewBackend(e.target.value)}
                    />
                    <Button onClick={addBackend}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {backendStacks.map((s) => (
                      <span key={s.id} className={chipClass}>
                        {s.name}
                        <button
                          onClick={() => deleteBackend(s.id)}
                          aria-label={`Remove ${s.name}`}
                          className="text-red-500 transition hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-4 flex flex-col gap-4">
                <p className={labelClass}>Add new project</p>
                <input
                  className={field}
                  placeholder="Title"
                  aria-label="Project title"
                  value={newProject.title}
                  onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                />
                <textarea
                  className={`${field} h-20 resize-none`}
                  placeholder="Description"
                  aria-label="Project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                />

                <div className="flex flex-col gap-2">
                  <span className={labelClass}>Project image</span>
                  <button
                    type="button"
                    onClick={() => projectFileRef.current?.click()}
                    aria-label="Choose a project image"
                    className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    {newProject.imageUrl ? (
                      <>
                        <img src={newProject.imageUrl} alt="Project preview" className="h-full w-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                          Change image
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        Click to choose an image · Max 5MB · JPG, PNG, WEBP
                      </span>
                    )}
                  </button>
                  <input
                    ref={projectFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleProjectFileChange}
                  />
                </div>

                <select
                  className={field}
                  aria-label="Project category"
                  value={newProject.category}
                  onChange={(e) => setNewProject((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="other">Other</option>
                </select>
                <Button onClick={addProject}>Add project</Button>

                <hr />
                <p className={labelClass}>Existing projects</p>
                <div className="flex flex-col gap-2">
                  {projects.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                      <span>{p.title}</span>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="font-mono text-xs text-red-500 transition hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="mt-4 flex flex-col gap-4">
                <p className={labelClass}>{editingExpId ? "Edit experience" : "Add experience"}</p>

                <input
                  className={field}
                  placeholder="Type (e.g. Project, Work, Internship)"
                  aria-label="Experience type"
                  value={expForm.type}
                  onChange={(e) => setExpForm((f) => ({ ...f, type: e.target.value }))}
                />

                <input
                  className={field}
                  placeholder="Title (e.g. Thesis Management System)"
                  aria-label="Experience title"
                  value={expForm.title}
                  onChange={(e) => setExpForm((f) => ({ ...f, title: e.target.value }))}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={field}
                    placeholder="Organization"
                    aria-label="Organization"
                    value={expForm.org}
                    onChange={(e) => setExpForm((f) => ({ ...f, org: e.target.value }))}
                  />
                  <input
                    className={field}
                    placeholder="Years (e.g. 2024 — Present)"
                    aria-label="Years"
                    value={expForm.years}
                    onChange={(e) => setExpForm((f) => ({ ...f, years: e.target.value }))}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={expForm.current}
                    onChange={(e) => setExpForm((f) => ({ ...f, current: e.target.checked }))}
                  />
                  Ongoing
                </label>

                <textarea
                  className={`${field} h-20 resize-none`}
                  placeholder="Short summary"
                  aria-label="Summary"
                  value={expForm.summary}
                  onChange={(e) => setExpForm((f) => ({ ...f, summary: e.target.value }))}
                />
                <textarea
                  className={`${field} h-28 resize-none`}
                  placeholder={"What I did (one per line)"}
                  aria-label="Highlights, one per line"
                  value={expForm.highlightsText}
                  onChange={(e) => setExpForm((f) => ({ ...f, highlightsText: e.target.value }))}
                />
                <input
                  className={field}
                  placeholder="Tech used, comma separated (e.g. Next.js, Prisma)"
                  aria-label="Tech used"
                  value={expForm.stackText}
                  onChange={(e) => setExpForm((f) => ({ ...f, stackText: e.target.value }))}
                />

                <div className="flex gap-2">
                  <Button onClick={saveExperience} disabled={savingExp} className="flex-1">
                    {savingExp ? "Saving..." : editingExpId ? "Save changes" : "Add experience"}
                  </Button>
                  {editingExpId && (
                    <Button variant="outline" onClick={resetExpForm}>
                      Cancel
                    </Button>
                  )}
                </div>

                <hr />
                <p className={labelClass}>Existing experience</p>
                <div className="flex flex-col gap-2">
                  {experiences.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nothing added yet.</p>
                  )}
                  {experiences.map((x) => (
                    <div
                      key={x.id}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
                        editingExpId === x.id ? "border-cyan-500" : ""
                      }`}
                    >
                      <span className="min-w-0 truncate">
                        {x.title}
                        <span className="ml-2 font-mono text-xs text-muted-foreground">{x.years}</span>
                      </span>
                      <span className="flex shrink-0 gap-3">
                        <button
                          onClick={() => startEditExperience(x)}
                          className="font-mono text-xs text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExperience(x.id)}
                          className="font-mono text-xs text-red-500 transition hover:text-red-400"
                        >
                          Delete
                        </button>
                      </span>
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