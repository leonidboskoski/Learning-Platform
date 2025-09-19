import React, { useMemo, useState } from "react";
import { TUTORS } from "../data/tutors";
import type { Availability, Tutor } from "../types";
import TutorCard from "../components/TutorCard";

const availabilityOptions: { value: Availability | "any"; label: string }[] = [
    { value: "any", label: "Any time" },
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
    { value: "weekend", label: "Weekend" },
];

const TutorsPage: React.FC = () => {
    const [subject, setSubject] = useState<string>("");
    const [q, setQ] = useState<string>("");
    const [availability, setAvailability] = useState<Availability | "any">("any");

    // derive price bounds from data
    const prices = useMemo(() => TUTORS.map((t) => t.price), []);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const [priceMin, setPriceMin] = useState<number>(minPrice);
    const [priceMax, setPriceMax] = useState<number>(maxPrice);

    const allSubjects = useMemo(
        () => Array.from(new Set(TUTORS.flatMap((t) => t.subjects))).sort(),
        []
    );

    const filtered: Tutor[] = useMemo(() => {
        return TUTORS.filter((t) => {
            if (subject && !t.subjects.some((s) => s.toLowerCase().includes(subject.toLowerCase()))) {
                return false;
            }
            if (t.price < priceMin || t.price > priceMax) return false;
            if (availability !== "any" && !t.availability.includes(availability)) return false;
            const hay = [t.name, t.bio ?? "", ...t.subjects].join(" ").toLowerCase();
            if (q && !hay.includes(q.toLowerCase())) return false;
            return true;
        });
    }, [subject, priceMin, priceMax, availability, q]);

    return (
        <div className="w-full bg-white">
            {/* FULL-WIDTH PINK BAR (sticky) */}
            <div className="sticky top-0 z-40 w-full bg-[#ff6ca3] text-[#0a0a0a]">
                <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10">
                    <div className="flex items-center gap-3">
                        <div className="text-[28px] font-extrabold leading-none tracking-tight">Професори</div>
                        <svg width="26" height="26" viewBox="0 0 24 24" className="-mt-[2px] opacity-80" aria-hidden>
                            <path d="M4 7h10a4 4 0 0 1 0 8H8l-4 3V7z" fill="currentColor" />
                        </svg>
                    </div>

                    <nav className="hidden items-center gap-8 text-[17px] font-semibold md:flex">
                        <a className="text-black hover:opacity-80" href="/tutors">Пронајди професор</a>
                        <a className="text-black hover:opacity-80" href="/teach">Започни како професор</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="inline-flex items-center gap-2 rounded-[14px] border border-black/25 bg-white/80 px-4 py-2 text-[15px] font-semibold transition hover:bg-black hover:text-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                                <path d="M10 3a7 7 0 100 14h1v4l6-4h-1a7 7 0 000-14h-6z" fill="currentColor" />
                            </svg>
                            Најави се
                        </button>
                    </div>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
                <h1 className="text-2xl font-extrabold md:text-3xl">Професори и приватни часови</h1>

                {/* Filters */}
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
                    <div className="md:col-span-3">
                        <label htmlFor="f-subject" className="mb-1 block text-xs font-semibold text-slate-600">
                            Предмет што ќе го учам
                        </label>
                        <input
                            id="f-subject"
                            list="subjects"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Предмет (пр. Математика 1)"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                        <datalist id="subjects">
                            {allSubjects.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="f-price-min" className="mb-1 block text-xs font-semibold text-slate-600">
                            Најниска цена
                        </label>
                        <input
                            id="f-price-min"
                            type="number"
                            min={minPrice}
                            max={priceMax}
                            value={priceMin}
                            onChange={(e) => setPriceMin(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="f-price-max" className="mb-1 block text-xs font-semibold text-slate-600">
                            Највисока цена
                        </label>
                        <input
                            id="f-price-max"
                            type="number"
                            min={priceMin}
                            max={maxPrice}
                            value={priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="f-avail" className="mb-1 block text-xs font-semibold text-slate-600">
                            Слободно време за учење
                        </label>
                        <select
                            id="f-avail"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value as Availability | "any")}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        >
                            {availabilityOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label htmlFor="f-search" className="mb-1 block text-xs font-semibold text-slate-600">
                            Пребарувај преку име на предмет
                        </label>
                        <div className="relative">
                            <input
                                id="f-search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Дискретни Структури, Python…"
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-slate-400"
                            />
                            {q && (
                                <button
                                    onClick={() => setQ("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
                                    aria-label="Clear"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Count */}
                <div className="mt-6 text-sm text-slate-600">
                    {filtered.length} tutors that match your filters
                </div>

                {/* Results list */}
                <div className="mt-4 space-y-4">
                    {filtered.map((t, idx) => (
                        <TutorCard key={`${t.id}-${idx}`} tutor={t} />
                    ))}

                    {filtered.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                            No tutors match your filters. Try widening your price range or clearing the subject.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorsPage;
