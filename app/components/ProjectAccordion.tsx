"use client";

import { useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category?: string | null;
};

export default function ProjectAccordion({
  projects,
  showFilter = false,
  seeAllLink = false,
}: {
  projects: Item[];
  showFilter?: boolean;
  seeAllLink?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))];
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      {showFilter && categories.length > 2 && (
        <div className="mb-5 flex gap-2" role="group" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                filter === c
                  ? "border-foreground bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="border-t">
        {visible.map((p, i) => {
          const open = openId === p.id;
          return (
            <li key={p.id} className="border-b">
              <button
                onClick={() => setOpenId(open ? null : p.id)}
                aria-expanded={open}
                aria-controls={`proj-${p.id}`}
                className="group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-1 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-px bg-cyan-500 transition-all duration-300 ${
                    open ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-lg font-bold tracking-tight sm:text-xl">{p.title}</span>
                  {!open && (
                    <span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">{p.description}</span>
                  )}
                </span>
                <span
                  aria-hidden
                  className={`font-mono text-2xl text-muted-foreground transition-transform duration-300 ${
                    open ? "rotate-45 text-cyan-500" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <div
                id={`proj-${p.id}`}
                className={`grid transition-all duration-300 ease-in-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-5 pb-7 pl-0 sm:grid-cols-[1fr_12rem] sm:pl-14">
                    <div>
                      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{p.description}</p>
                      {p.category && (
                        <span className="mt-4 inline-block rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground">
                          {p.category}
                        </span>
                      )}
                    </div>
                    <img
                      src={p.imageUrl || "/images/nopp.png"}
                      alt={`${p.title} cover`}
                      loading="lazy"
                      className="aspect-video w-full rounded-xl border object-cover sm:h-28 sm:aspect-auto"
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {seeAllLink && (
        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-lg border px-4 py-2 font-mono text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          See all projects
        </Link>
      )}
    </div>
  );
}