// src/components/TutorCard.tsx
import React from "react";
import type {Tutor} from "../types";

const InitialsAvatar: React.FC<{ name: string; color?: string }> = ({
                                                                        name,
                                                                        color,
                                                                    }) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            className="grid h-24 w-24 place-items-center rounded-xl text-lg font-bold text-slate-800 ring-1 ring-black/10"
            style={{ background: color ?? "#e5e7eb" }}
            aria-hidden
        >
            {initials}
        </div>
    );
};

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
    {children}
  </span>
);

/**
 * TutorCard with a hover/focus preview panel on the RIGHT that shows the full biography.
 * - Uses Tutor.bioFull (if present) or falls back to Tutor.bio.
 * - The preview panel appears on desktop (md+). Hidden on mobile.
 * - Ensure no parent container has `overflow-hidden` so the panel can overflow to the right.
 */
const TutorCard: React.FC<{ tutor: Tutor }> = ({ tutor }) => {
    const longBio = tutor.bioFull ?? tutor.bio ?? "";

    return (
        <div className="relative group">
            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md">
                <div className="flex gap-4">
                    <InitialsAvatar name={tutor.name} color={tutor.avatarColor} />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-bold leading-tight">{tutor.name}</h3>

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    {tutor.badges?.map((b) => (
                                        <Badge key={b}>{b}</Badge>
                                    ))}
                                </div>

                                <div className="mt-2 text-sm text-slate-700">
                                    {tutor.subjects.join(" • ")}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                    ⭐ {tutor.rating} · {tutor.reviews} рецензии
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <div className="text-2xl font-extrabold">${tutor.price}</div>
                                <div className="text-xs text-slate-500">50-мин час</div>
                            </div>
                        </div>

                        {/* brief bio (truncated in the card) */}
                        <p className="mt-3 text-sm text-slate-700 line-clamp-2">
                            {tutor.bio}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600">
                                Закажи пробен час
                            </button>
                            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                                Прати порака
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover/Focus preview panel (desktop) */}
            {/* ZA NA TELEFON pod kartickata od prefesorot:
            izbrisi: hidden md:block
            zameni: md:absolute md:left-full so absolute left-0 top-full mt-3
            */}

            <div
                className={`
          hidden md:block
          absolute top-0 left-full ml-4 z-50
          w-[490px] max-w-[90vw]
          opacity-0 translate-y-2 scale-[0.98]
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100
          transition-all duration-200 ease-out
          pointer-events-auto
        `}
            >
                <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl">
                    {/* arrow */}
                    <span className="absolute -left-2 top-6 h-4 w-4 rotate-45 bg-white border-l border-t border-slate-200" />

                    <div className="p-5">
                        <h4 className="text-base font-extrabold">{tutor.name}</h4>
                        <div className="mt-1 text-xs text-slate-500">
                            Предмети: {tutor.subjects.join(", ")}
                        </div>

                        <div className="mt-3 max-h-[260px] overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                            {longBio || "Биографијата ќе биде прикажана тука."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorCard;
