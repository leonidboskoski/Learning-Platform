import React, { useState } from "react";
import { Link } from "react-router-dom";

const TeachPage: React.FC = () => {
    const faqs = [
        { q: "Каков тип на професори бараме?", a: "Професори со силно предметно знаење, јасна комуникација и желба да помогнат. Искуство е плус, но не е секогаш задолжително." },
        { q: "Кои предмети можам да ги предавам?", a: "Слободно понудете предмети за кои имате компетенции: математика, статистика, програмирање, јазици и др." },
        { q: "Како да станам онлајн професор?", a: "Креирајте профил, поднесете кратка апликација и бидете одобрени од нашиот тим (обично во неколку работни дена)." },
        { q: "Како побрзо да ми биде одобрен профилот?", a: "Пополнете детален опис, наведете предмети/нивоа, поставете јасна цена и додајте кратко видео претставување." },
        { q: "Зошто да предавам на нашата платформа?", a: "Стабилен проток на студенти, календар, видео училница, плаќања и поддршка — сè на едно место." },
        { q: "Кое опремување ми е потребно?", a: "Компјутер, стабилен интернет, микрофон и камера. Се препорачуваат слушалки." },
        { q: "Дали креирањето профил е бесплатно?", a: "Да, отворањето профил е бесплатно. Платформата задржува провизија по час." },
        { q: "Колку можам да заработам?", a: "Одредувате сопствена цена по час. Заработката зависи од вашата цена и број на часови." },
    ];
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="w-full bg-white">
            {/* Full-width fixed header (unchanged) */}
            <header className="fixed inset-x-0 top-0 z-50 bg-[#ff6ca3]">
                <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10 text-[#0a0a0a]">
                    <div className="flex items-center gap-3">
                        <div className="text-[28px] font-extrabold tracking-tight leading-none">Професори</div>
                        <svg width="26" height="26" viewBox="0 0 24 24" className="opacity-80 -mt-[2px]">
                            <path d="M4 7h10a4 4 0 0 1 0 8H8l-4 3V7z" fill="currentColor" />
                        </svg>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-[17px] font-semibold">
                        <Link to="/apply" className="hover:opacity-80 text-black">
                            Креирај профил на професор
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="inline-flex items-center gap-2 rounded-[14px] border border-black/25 px-4 py-2 text-[15px] font-semibold bg-white/80 hover:bg-black hover:text-white transition">
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path d="M10 3a7 7 0 100 14h1v4l6-4h-1a7 7 0 000-14h-6z" fill="currentColor" />
                            </svg>
                            Најави се
                        </button>
                    </div>
                </div>
            </header>
            <div className="h-[72px]" />

            {/* ===== Centered content wrapper ===== */}
            <main className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
                {/* HERO */}
                <section className="pt-12 md:pt-16 pb-8 md:pb-10">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        {/* left copy */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
                                Заработувај предавајќи на најголемата заедница на студенти
                                ширум светот
                            </h1>

                            {/* steps */}
                            <div className="mt-8">
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-md bg-black text-white text-lg font-extrabold">1</span>
                                        <div>
                                            <p className="font-extrabold text-xl">Sign up</p>
                                            <p className="text-sm text-slate-600">креирај го твојот профил</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-px flex-1 bg-slate-200" />
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-200 text-black text-lg font-extrabold">2</span>
                                        <div>
                                            <p className="font-extrabold text-xl">Get approved</p>
                                            <p className="text-sm text-slate-600">обично во 3–5 работни дена</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-px flex-1 bg-slate-200" />
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-200 text-black text-lg font-extrabold">3</span>
                                        <div>
                                            <p className="font-extrabold text-xl">Start earning</p>
                                            <p className="text-sm text-slate-600">предавај студенти онлајн</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 inline-flex h-12 items-center rounded-xl bg-emerald-400 px-5 text-base md:text-lg font-semibold text-slate-900 hover:bg-emerald-300">
                                Креирај профил на професор
                            </button>
                        </div>

                        {/* right placeholders */}
                        <div className="relative mx-auto grid place-items-center">
                            <div className="absolute left-8 top-10 h-[380px] w-[300px] rounded-xl bg-slate-100 shadow-xl ring-1 ring-black/10" />
                            <div className="absolute left-16 top-16 h-[380px] w-[300px] rounded-xl bg-slate-100 shadow-xl ring-1 ring-black/10" />
                            <div className="relative z-10 h-[420px] w-[340px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/10" />
                        </div>
                    </div>
                </section>

                {/* Three features */}
                <section className="py-12 md:py-16">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <h3 className="text-2xl font-extrabold">Постави сопствена цена</h3>
                            <p className="mt-2 text-slate-700">
                                Одредувај ја цената и менувај ја кога сакаш. Просечно, цените се 15–25$ по час (пример за јазични тутори).
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold">Предавај било кога</h3>
                            <p className="mt-2 text-slate-700">
                                Ти бираш кога и колку часови ќе држиш. Нема фиксни обврски — работи од каде било.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold">Професионален раст</h3>
                            <p className="mt-2 text-slate-700">
                                По одобрување можеш веднаш да почнеш. Вклучи се во заедница со ресурси, обуки и поддршка.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Global reach + checklist */}
                <section className="py-12 md:py-16">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Предавај студенти од над 180 земји</h2>
                            <p className="mt-4 text-slate-700">
                                Ќе имаш сè што ти е потребно: календар, онлајн училница, плаќања и сигурна поддршка.
                            </p>

                            <ul className="mt-6 space-y-3 text-slate-800">
                                {[
                                    "Постојан прилив на нови студенти",
                                    "Паметен календар и потсетници",
                                    "Интерактивна училница",
                                    "Лесни и сигурни плаќања",
                                    "Вебинари за професионален развој",
                                    "Поддржувачка заедница на професори",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-emerald-900">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute right-10 top-10 h-[260px] w-[380px] rounded-xl bg-slate-100 shadow-md ring-1 ring-slate-200" />
                            <div className="relative h-[300px] w-[420px] rounded-2xl bg-white shadow-xl ring-1 ring-slate-200" />
                        </div>
                    </div>
                </section>

                {/* Testimonial */}
                <section className="py-16">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div className="relative h-[360px]">
                            <div className="absolute left-0 top-10 h-[280px] w-[200px] rounded-xl bg-slate-100 shadow ring-1 ring-black/10" />
                            <div className="absolute left-16 top-6 h-[300px] w-[220px] rounded-xl bg-slate-100 shadow ring-1 ring-black/10" />
                            <div className="absolute left-32 top-0 h-[320px] w-[240px] rounded-xl bg-white shadow-2xl ring-1 ring-black/10" />
                        </div>
                        <div>
                            <p className="text-4xl md:text-5xl font-extrabold leading-tight">
                                „Платформата ми овозможи да предавам и да заработувам од дома!“
                            </p>
                            <p className="mt-4 text-slate-600">Криста А. · Професор по англиски</p>
                            <button className="mt-8 inline-flex h-12 items-center rounded-xl bg-emerald-400 px-5 text-lg font-semibold text-slate-900 hover:bg-emerald-300">
                                Креирај профил на професор
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ (narrower but still centered within main) */}
                <section className="py-14 md:py-18">
                    <div className="mx-auto w-full max-w-[900px]">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Најчесто поставувани прашања</h2>

                        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                            {faqs.map((item, i) => {
                                const isOpen = open === i;
                                return (
                                    <div key={item.q}>
                                        <button
                                            className="flex w-full items-center justify-between px-5 py-5 text-left"
                                            onClick={() => setOpen(isOpen ? null : i)}
                                        >
                                            <span className="text-lg font-semibold">{item.q}</span>
                                            <span
                                                className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition ${isOpen ? "rotate-180" : ""}`}
                                                aria-hidden
                                            >
                        ▾
                      </span>
                                        </button>
                                        <div className={`px-5 pb-5 text-slate-700 transition-all ${isOpen ? "block" : "hidden"}`}>
                                            {item.a}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="mt-6 text-slate-600">
                            Имате повеќе прашања?{" "}
                            <a className="text-slate-900 underline" href="#">
                                Контактирајте го нашиот тим
                            </a>.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TeachPage;
