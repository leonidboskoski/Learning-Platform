import React, { useMemo, useState } from "react";
import { TUTORS } from "../data/tutors";

type Course = {
    id: string;
    title: string;
    duration?: string;
};

const slug = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold leading-tight">{course.title}</h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">{course.duration}</span>
                <button className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90">
                    Најди професор
                </button>
            </div>
        </div>
    );
};

const CoursesSection: React.FC<{ title?: string }> = ({ title = "Курсеви" }) => {
    // Build unique subjects from tutors
    const subjects = useMemo(() => {
        const set = new Set<string>();
        for (const t of TUTORS) {
            for (const s of t.subjects) {
                const v = (s ?? "").trim();
                if (v) set.add(v);
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, []);

    // Build courses & ensure IDs are unique even if slugs collide
    const courses: Course[] = useMemo(() => {
        const seen = new Set<string>();
        const arr: Course[] = [];
        for (const s of subjects) {
            const base = slug(s) || "course";
            let id = base;
            let i = 1;
            // if two different subjects slug to same string, make it unique
            while (seen.has(id)) id = `${base}-${i++}`;
            seen.add(id);
            arr.push({
                id,
                title: s,
                duration: "Препорачано времетраење :12h",
            });
        }
        return arr;
    }, [subjects]);

    const [q, setQ] = useState("");

    const allNames = useMemo(
        () => Array.from(new Set(courses.map((c) => c.title))).sort(),
        [courses]
    );

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return courses;
        return courses.filter((c) => c.title.toLowerCase().includes(needle));
    }, [courses, q]);

    return (
        <section className="w-full bg-white">
            <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>

                    <div className="w-full md:w-[560px]">
                        <label htmlFor="courseSearch" className="mb-2 block text-sm font-medium text-slate-700">
                            Пронајди предмет
                        </label>
                        <div className="relative">
                            <input
                                id="courseSearch"
                                name="courseSearch"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Име на предметот"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-[15px] outline-none ring-0 focus:border-slate-400"
                            />
                            {q && (
                                <button
                                    type="button"
                                    onClick={() => setQ("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
                                    aria-label="Clear"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {allNames.slice(0, 6).map((name, idx) => (
                                <button
                                    key={`chip-${slug(name)}-${idx}`}   // <-- prefixed + index to avoid collisions
                                    type="button"
                                    onClick={() => setQ(name)}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.length === 0 ? (
                        <div className="col-span-full rounded-xl bg-slate-50 p-8 text-center text-slate-600">
                            Нема пронајдени курсеви “{q}”.
                        </div>
                    ) : (
                        filtered.map((c, idx) => (
                            <CourseCard key={`course-${c.id}-${idx}`} course={c} />  // <-- composite key
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;
