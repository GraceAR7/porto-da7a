"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Category, ProjectRecord, Tech, fromProjectRecord, techLabels } from "@/lib/projects";
import { supabase } from "@/lib/supabase";
import { CloseIcon } from "@/components/Icons";

const categories: { id: Category; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "desktop", label: "Desktop Apps" },
  { id: "games", label: "Games" },
  { id: "mobile", label: "Mobile Apps" },
];
const techOptions = Object.entries(techLabels) as [Tech, string][];
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 1 * 1024 * 1024;
const maxProjectImagePayload = 5 * 1024 * 1024;
const inputClass = "w-full border border-black/20 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-black";
const buttonClass = "bg-black px-4 py-2 font-mono text-xs font-bold text-white transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50";

interface EditorState {
  id?: string;
  category: Category;
  name: string;
  desc_en: string;
  desc_id: string;
  long_desc_en: string;
  long_desc_id: string;
  highlights_en: string[];
  highlights_id: string[];
  status_en: string;
  status_id: string;
  created_date: string;
  updated_date: string;
  tech: Tech[];
  images: string[];
  live_url: string;
  repo_url: string;
  collab_with: string[];
  collabEnabled: boolean;
}

const emptyEditor = (): EditorState => ({
  category: "websites",
  name: "",
  desc_en: "",
  desc_id: "",
  long_desc_en: "",
  long_desc_id: "",
  highlights_en: [],
  highlights_id: [],
  status_en: "In progress",
  status_id: "Sedang dikerjakan",
  created_date: new Date().toISOString().slice(0, 10),
  updated_date: new Date().toISOString().slice(0, 10),
  tech: [],
  images: [],
  live_url: "",
  repo_url: "",
  collab_with: [],
  collabEnabled: false,
});

function editorFromRecord(record: ProjectRecord): EditorState {
  const project = fromProjectRecord(record);
  return {
    id: project.id,
    category: project.category,
    name: project.name,
    desc_en: project.desc.en,
    desc_id: project.desc.id,
    long_desc_en: project.longDesc.en,
    long_desc_id: project.longDesc.id,
    highlights_en: project.highlights.en,
    highlights_id: project.highlights.id,
    status_en: project.status.en,
    status_id: project.status.id,
    created_date: project.created,
    updated_date: project.updated,
    tech: project.tech,
    images: project.images,
    live_url: project.links?.live ?? "",
    repo_url: project.links?.repo ?? "",
    collab_with: project.collabWith ?? [],
    collabEnabled: !!project.collabWith?.length,
  };
}

async function readProjectRecords(): Promise<ProjectRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectRecord[];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-xs font-bold">{label}</span>
      {children}
    </label>
  );
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read image."));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const client = supabase;
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [records, setRecords] = useState<ProjectRecord[]>([]);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!client) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    client.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setAuthLoading(false);
      }
    });
    const { data: authListener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthorized(null);
      setRecords([]);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!client || !session) {
      setAuthorized(null);
      return;
    }

    let active = true;
    const verifyAdmin = async () => {
      setAuthorized(null);
      setBusy(true);
      const { data, error } = await client
        .from("project_admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!active) return;
      if (error || !data) {
        setAuthorized(false);
        setBusy(false);
        return;
      }

      setAuthorized(true);
      try {
        setRecords(await readProjectRecords());
      } catch (loadError) {
        setNotice(loadError instanceof Error ? loadError.message : "Could not load projects.");
      } finally {
        if (active) setBusy(false);
      }
    };

    void verifyAdmin();
    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    if (!editor) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !uploading) discardEditor();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [Boolean(editor), uploading]);

  const updateEditor = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
    setEditor((current) => (current ? { ...current, [key]: value } : current));
  };

  const discardEditor = () => {
    setEditor(null);
  };

  const uploadImages = async (fileList: FileList | null) => {
    if (!fileList || !editor) return;
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setNotice("");
    const imageDataUrls: string[] = [];
    const failures: string[] = [];
    let totalImagePayload = editor.images.reduce((total, image) => total + image.length, 0);

    for (const file of files) {
      if (!allowedImageTypes.has(file.type)) {
        failures.push(`${file.name}: gunakan JPG, PNG, WebP, atau GIF.`);
        continue;
      }
      if (file.size > maxImageSize) {
        failures.push(`${file.name}: ukuran maksimal 1 MB.`);
        continue;
      }

      try {
        const dataUrl = await readImageAsDataUrl(file);
        if (totalImagePayload + dataUrl.length > maxProjectImagePayload) {
          failures.push(`${file.name}: total data gambar per proyek maksimal 8 MB.`);
          continue;
        }
        totalImagePayload += dataUrl.length;
        imageDataUrls.push(dataUrl);
      } catch (error) {
        failures.push(`${file.name}: ${error instanceof Error ? error.message : "gagal membaca gambar."}`);
        continue;
      }
    }

    if (imageDataUrls.length > 0) {
      setEditor((current) => current ? { ...current, images: [...current.images, ...imageDataUrls] } : current);
    }
    setNotice(failures.length > 0 ? failures.join(" ") : `${imageDataUrls.length} foto siap disimpan ke database.`);
    setUploading(false);
  };

  const refreshProjects = async () => {
    setRecords(await readProjectRecords());
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setNotice("");
    const { error } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setNotice(error.message);
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client || !editor) return;
    const collaborators = editor.collabEnabled ? editor.collab_with.map((name) => name.trim()).filter(Boolean) : [];
    if (editor.collabEnabled && collaborators.length === 0) {
      setNotice("Isi setidaknya satu nama kolaborator, atau nonaktifkan pilihan Collab with.");
      return;
    }

    const payload = {
      category: editor.category,
      name: editor.name.trim(),
      desc_en: editor.desc_en.trim(),
      desc_id: editor.desc_id.trim(),
      long_desc_en: editor.long_desc_en.trim(),
      long_desc_id: editor.long_desc_id.trim(),
      highlights_en: editor.highlights_en.map((item) => item.trim()).filter(Boolean),
      highlights_id: editor.highlights_id.map((item) => item.trim()).filter(Boolean),
      status_en: editor.status_en.trim(),
      status_id: editor.status_id.trim(),
      created_date: editor.created_date,
      updated_date: editor.updated_date,
      tech: editor.tech,
      images: editor.images.map((image) => image.trim()).filter(Boolean),
      live_url: editor.live_url.trim() || null,
      repo_url: editor.repo_url.trim() || null,
      collab_with: collaborators,
    };

    setBusy(true);
    setNotice("");
    const result = editor.id
      ? await client.from("projects").update(payload).eq("id", editor.id)
      : await client.from("projects").insert(payload);
    if (result.error) {
      setNotice(result.error.message);
      setBusy(false);
      return;
    }

    try {
      await refreshProjects();
      setEditor(null);
      setNotice(editor.id ? "Project updated." : "Project added.");
    } catch (loadError) {
      setNotice(loadError instanceof Error ? loadError.message : "Project saved, but the list could not refresh.");
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (record: ProjectRecord) => {
    if (!client || !window.confirm(`Delete "${record.name}"? This cannot be undone.`)) return;
    setBusy(true);
    setNotice("");
    const { error } = await client.from("projects").delete().eq("id", record.id);
    if (error) {
      setNotice(error.message);
      setBusy(false);
      return;
    }
    try {
      await refreshProjects();
      setNotice("Project deleted.");
    } catch (loadError) {
      setNotice(loadError instanceof Error ? loadError.message : "Project deleted, but the list could not refresh.");
    } finally {
      setBusy(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesName = record.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesName && (categoryFilter === "all" || record.category === categoryFilter);
  });

  if (!client) {
    return <main className="min-h-screen bg-cream p-6 font-mono">Configure the Supabase URL and anon key first.</main>;
  }

  if (authLoading) {
    return <main className="min-h-screen bg-cream p-6 font-mono">Checking session...</main>;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
        <form onSubmit={signIn} className="w-full max-w-md border-t-4 border-sky bg-white p-6 shadow-card sm:p-8">
          <p className="font-mono text-xs font-bold uppercase text-neutral-600">Da7A / Project admin</p>
          <h1 className="mt-2 font-sans text-2xl font-bold">Sign in</h1>
          <p className="mt-2 font-mono text-xs leading-relaxed text-neutral-600">Use the admin account authorized in Supabase.</p>
          <div className="mt-6 space-y-4">
            <Field label="Email">
              <input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Password">
              <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
            </Field>
            {notice && <p role="alert" className="font-mono text-xs text-red-700">{notice}</p>}
            <button disabled={busy} className={`${buttonClass} w-full`}>{busy ? "Signing in..." : "Sign in"}</button>
            <a href="/" className="block text-center font-mono text-xs underline">Back to portfolio</a>
          </div>
        </form>
      </main>
    );
  }

  if (authorized === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
        <div className="w-full max-w-lg border-t-4 border-sun bg-white p-6 shadow-card sm:p-8">
          <h1 className="font-sans text-2xl font-bold">Access not authorized</h1>
          <p className="mt-3 font-mono text-sm leading-relaxed">This account is not listed in the project admin allowlist.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => void client.auth.signOut()} className={buttonClass}>Sign out</button>
            <a href="/" className="border border-black px-4 py-2 font-mono text-xs font-bold">Back to portfolio</a>
          </div>
        </div>
      </main>
    );
  }

  if (authorized !== true) {
    return <main className="min-h-screen bg-cream p-6 font-mono">Verifying admin access...</main>;
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-black px-4 py-4 text-white sm:px-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase text-sky">Da7A / Private</p>
          <h1 className="mt-1 font-sans text-xl font-bold sm:text-2xl">Project admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-mono text-xs underline underline-offset-4">View portfolio</a>
          <button type="button" onClick={() => void client.auth.signOut()} className="bg-sun px-3 py-2 font-mono text-xs font-bold text-black">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/15 pb-4">
          <div>
            <p className="font-mono text-xs text-neutral-600">{records.length} projects</p>
            <h2 className="mt-1 font-sans text-xl font-bold">Portfolio projects</h2>
          </div>
          <button type="button" onClick={() => { setNotice(""); setEditor(emptyEditor()); }} className={buttonClass}>+ Add project</button>
        </div>

        {notice && <p role="status" className="mt-4 border-l-4 border-sky bg-white px-3 py-2 font-mono text-xs">{notice}</p>}

        <div className="grid gap-3 border-b border-black/15 py-4 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-center">
          <label className="block">
            <span className="sr-only">Search projects by name</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search project name..."
              className={inputClass}
            />
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by category">
            {([
              ["all", "All"],
              ["websites", "Web"],
              ["desktop", "Desktop"],
              ["games", "Games"],
              ["mobile", "Mobile"],
            ] as [Category | "all", string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={categoryFilter === value}
                onClick={() => setCategoryFilter(value)}
                className={`px-3 py-2 font-mono text-xs transition-colors ${categoryFilter === value ? "bg-sun font-bold" : "bg-white hover:bg-sun/40"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {editor && (
          <div
            className="fixed inset-0 z-[100] flex items-end bg-black/55"
            role="presentation"
            onClick={(event) => {
              if (!uploading && event.target === event.currentTarget) discardEditor();
            }}
          >
          <form
            onSubmit={saveProject}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-editor-title"
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-md border-t-4 border-sky bg-cream p-4 shadow-card animate-[admin-sheet-up_250ms_ease-out] sm:px-8 sm:pb-8 sm:pt-6"
          >
            <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
              <h2 id="project-editor-title" className="font-sans text-lg font-bold">{editor.id ? "Edit project" : "New project"}</h2>
              <button type="button" disabled={uploading} onClick={discardEditor} className="border border-black px-3 py-2 font-mono text-xs font-bold disabled:opacity-50">Close</button>
            </div>

            {notice && <p role="status" className="border-l-4 border-sky bg-white px-3 py-2 font-mono text-xs">{notice}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name">
                <input required value={editor.name} onChange={(event) => updateEditor("name", event.target.value)} className={inputClass} />
              </Field>
              <Field label="Category">
                <select value={editor.category} onChange={(event) => updateEditor("category", event.target.value as Category)} className={inputClass}>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                </select>
              </Field>
            </div>

            <section className="space-y-4">
              <h3 className="border-b border-black/10 pb-2 font-mono text-xs font-bold uppercase">Card descriptions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Short description (EN)"><textarea required rows={3} value={editor.desc_en} onChange={(event) => updateEditor("desc_en", event.target.value)} className={inputClass} /></Field>
                <Field label="Short description (ID)"><textarea required rows={3} value={editor.desc_id} onChange={(event) => updateEditor("desc_id", event.target.value)} className={inputClass} /></Field>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-b border-black/10 pb-2 font-mono text-xs font-bold uppercase">Project details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full description (EN)"><textarea rows={5} value={editor.long_desc_en} onChange={(event) => updateEditor("long_desc_en", event.target.value)} className={inputClass} /></Field>
                <Field label="Full description (ID)"><textarea rows={5} value={editor.long_desc_id} onChange={(event) => updateEditor("long_desc_id", event.target.value)} className={inputClass} /></Field>
                <Field label="Highlights (EN), one per line"><textarea rows={4} value={editor.highlights_en.join("\n")} onChange={(event) => updateEditor("highlights_en", event.target.value.split("\n"))} className={inputClass} /></Field>
                <Field label="Highlights (ID), one per line"><textarea rows={4} value={editor.highlights_id.join("\n")} onChange={(event) => updateEditor("highlights_id", event.target.value.split("\n"))} className={inputClass} /></Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status (EN)"><input value={editor.status_en} onChange={(event) => updateEditor("status_en", event.target.value)} className={inputClass} /></Field>
                <Field label="Status (ID)"><input value={editor.status_id} onChange={(event) => updateEditor("status_id", event.target.value)} className={inputClass} /></Field>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-b border-black/10 pb-2 font-mono text-xs font-bold uppercase">Media and links</h3>
              <section className="space-y-3">
                <h3 className="border-b border-black/10 pb-2 font-mono text-xs font-bold uppercase">Project photos</h3>
                <Field label="Upload photos (JPG, PNG, WebP, GIF; max 1 MB each, 5 MB total)">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    disabled={uploading}
                    onChange={(event) => {
                      void uploadImages(event.currentTarget.files);
                      event.currentTarget.value = "";
                    }}
                    className={`${inputClass} file:mr-3 file:border-0 file:bg-sun file:px-3 file:py-1.5 file:font-mono file:text-xs file:font-bold`}
                  />
                </Field>
                {uploading && <p role="status" className="font-mono text-xs">Uploading photos...</p>}
                {editor.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {editor.images.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative aspect-video bg-[#d6d6d6]">
                        <img src={image} alt={`Project photo ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          disabled={uploading}
                          aria-label={`Remove photo ${index + 1}`}
                          title={`Remove photo ${index + 1}`}
                          onClick={() => updateEditor("images", editor.images.filter((_, imageIndex) => imageIndex !== index))}
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-black text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Field label="Or add existing image paths or URLs, one per line">
                  <textarea
                    rows={3}
                    placeholder="/images/projects/example-1.jpg"
                    value={editor.images.join("\n")}
                    onChange={(event) => updateEditor("images", event.target.value.split("\n"))}
                    className={inputClass}
                  />
                </Field>
              </section>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Live project URL"><input type="url" value={editor.live_url} onChange={(event) => updateEditor("live_url", event.target.value)} className={inputClass} /></Field>
                <Field label="Repository URL"><input type="url" value={editor.repo_url} onChange={(event) => updateEditor("repo_url", event.target.value)} className={inputClass} /></Field>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-b border-black/10 pb-2 font-mono text-xs font-bold uppercase">Project metadata</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Created"><input required type="date" value={editor.created_date} onChange={(event) => updateEditor("created_date", event.target.value)} className={inputClass} /></Field>
                <Field label="Last updated"><input required type="date" value={editor.updated_date} onChange={(event) => updateEditor("updated_date", event.target.value)} className={inputClass} /></Field>
              </div>
              <fieldset>
                <legend className="font-mono text-xs font-bold">Tech stack</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {techOptions.map(([tech, label]) => (
                    <label key={tech} className={`cursor-pointer border px-3 py-2 font-mono text-xs ${editor.tech.includes(tech) ? "border-black bg-sun font-bold" : "border-black/15 bg-white"}`}>
                      <input type="checkbox" checked={editor.tech.includes(tech)} onChange={(event) => updateEditor("tech", event.target.checked ? [...editor.tech, tech] : editor.tech.filter((item) => item !== tech))} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>

            <section className="space-y-3 border-t border-black/10 pt-4">
              <label className="flex items-center gap-2 font-mono text-sm font-bold">
                <input
                  type="checkbox"
                  checked={editor.collabEnabled}
                  onChange={(event) => updateEditor("collabEnabled", event.target.checked)}
                  className="h-4 w-4 accent-black"
                />
                Collab with:
              </label>
              {editor.collabEnabled && (
                <div className="space-y-2">
                  {editor.collab_with.map((name, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        required
                        aria-label={`Collaborator ${index + 1}`}
                        placeholder="Collaborator name"
                        value={name}
                        onChange={(event) => updateEditor("collab_with", editor.collab_with.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
                        className={inputClass}
                      />
                      <button type="button" aria-label="Remove collaborator" onClick={() => updateEditor("collab_with", editor.collab_with.filter((_, itemIndex) => itemIndex !== index))} className="border border-black px-3 font-mono text-sm">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateEditor("collab_with", [...editor.collab_with, ""])} className="border border-black px-3 py-2 font-mono text-xs font-bold">+ Add collaborator</button>
                </div>
              )}
            </section>

            <div className="flex flex-wrap gap-3 border-t border-black/10 pt-4">
              <button disabled={busy || uploading} className={buttonClass}>{uploading ? "Uploading photos..." : busy ? "Saving..." : editor.id ? "Save changes" : "Create project"}</button>
              <button type="button" disabled={uploading} onClick={discardEditor} className="border border-black px-4 py-2 font-mono text-xs font-bold disabled:opacity-50">Cancel</button>
            </div>
            </div>
          </form>
          </div>
        )}

        {busy && !editor && <p className="py-8 text-center font-mono text-sm">Loading projects...</p>}
        {!busy && records.length === 0 && <p className="py-8 font-mono text-sm text-neutral-600">No projects found.</p>}
        {records.length > 0 && filteredRecords.length === 0 && <p className="py-8 font-mono text-sm text-neutral-600">No projects match these filters.</p>}
        <div className="mt-5 divide-y divide-black/10 border-y border-black/10">
          {filteredRecords.map((record) => (
            <article key={record.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">{categories.find((category) => category.id === record.category)?.label}</p>
                <h3 className="mt-1 truncate font-sans text-base font-bold">{record.name}</h3>
                {!!record.collab_with?.length && <p className="mt-1 font-mono text-xs text-neutral-600">Collab with: {record.collab_with.join(", ")}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => { setNotice(""); setEditor(editorFromRecord(record)); }} className="border border-black px-3 py-2 font-mono text-xs font-bold">Edit</button>
                <button type="button" disabled={busy} onClick={() => void deleteProject(record)} className="border border-red-700 px-3 py-2 font-mono text-xs font-bold text-red-700 disabled:opacity-50">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}