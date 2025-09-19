import React, { useMemo, useState } from "react";
import SUBJECT_SUGGESTIONS from "../data/subjects.json";

type Duration = "45min" | "1h" | "1.5h" | "2h";

type SubjectEntry = {
    id: string;
    subject: string;
    duration: Duration;
    price: number;
};

const DURATIONS: { value: Duration; label: string }[] = [
    { value: "45min", label: "45 минути" },
    { value: "1h", label: "1 час" },
    { value: "1.5h", label: "1.5 часа" },
    { value: "2h", label: "2 часа" },
];

const PHONE_PREFIXES = [
    { code: "+389", country: "North Macedonia" },
    { code: "+381", country: "Serbia" },
    { code: "+385", country: "Croatia" },
    { code: "+387", country: "Bosnia & Herzegovina" },
    { code: "+359", country: "Bulgaria" },
    { code: "+355", country: "Albania" },
    { code: "+30",  country: "Greece" },
    { code: "+49",  country: "Germany" },
    { code: "+33",  country: "France" },
    { code: "+44",  country: "United Kingdom" },
    { code: "+1",   country: "USA / Canada" },
];

const ApplyTutorPage: React.FC = () => {
    // Basic info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");

    // Phone split
    const [phonePrefix, setPhonePrefix] = useState(PHONE_PREFIXES[0].code);
    const [phoneLocal, setPhoneLocal] = useState("");

    // Subjects
    const [items, setItems] = useState<SubjectEntry[]>([]);
    const [subjectInput, setSubjectInput] = useState("");
    const [durationInput, setDurationInput] = useState<Duration>("1h");
    const [priceInput, setPriceInput] = useState<number | "">("");

    // Bios
    const [bio, setBio] = useState("");
    const [bioFull, setBioFull] = useState("");

    // Validation state
    const [submitted, setSubmitted] = useState(false);

    // Derived validations
    const nameValid = useMemo(() => name.trim().split(/\s+/).length >= 2, [name]);
    const emailValid = useMemo(
        () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
        [email]
    );
    const phoneLocalDigits = useMemo(() => phoneLocal.replace(/\D/g, ""), [phoneLocal]);
    const phoneValid = useMemo(
        () => !!phonePrefix && phoneLocalDigits.length >= 6,
        [phonePrefix, phoneLocalDigits]
    );
    const itemsValid = useMemo(
        () => items.length > 0 && items.every((i) => i.subject.trim() && i.price > 0),
        [items]
    );
    const formValid = nameValid && emailValid && phoneValid && itemsValid;

    // Suggestions (avoid duplicates)
    const selectedSubjectsLC = useMemo(
        () => new Set(items.map((i) => i.subject.toLowerCase())),
        [items]
    );
    const filteredSuggestions = useMemo(() => {
        const q = subjectInput.trim().toLowerCase();
        return (SUBJECT_SUGGESTIONS as string[])
            .filter((s) => !selectedSubjectsLC.has(s.toLowerCase()))
            .filter((s) => (q ? s.toLowerCase().includes(q) : true))
            .slice(0, 8);
    }, [subjectInput, selectedSubjectsLC]);

    const inputClass = (invalid: boolean) =>
        `mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm outline-none border ${
            invalid
                ? "border-pink-500 focus:border-pink-500 ring-1 ring-pink-500"
                : "border-slate-300 focus:border-slate-400"
        }`;

    function addItem() {
        const subj = subjectInput.trim();
        const priceNum = typeof priceInput === "number" ? priceInput : Number(priceInput);
        if (!subj || !(priceNum > 0)) return;
        if (selectedSubjectsLC.has(subj.toLowerCase())) {
            setSubjectInput("");
            setPriceInput("");
            setDurationInput("1h");
            return;
        }
        setItems((prev) => [
            ...prev,
            { id: crypto.randomUUID(), subject: subj, duration: durationInput, price: priceNum },
        ]);
        setSubjectInput("");
        setPriceInput("");
        setDurationInput("1h");
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }

    function focusFirstInvalid() {
        if (!nameValid) return document.getElementById("name")?.focus();
        if (!emailValid) return document.getElementById("email")?.focus();
        if (!phoneValid) return document.getElementById("phoneLocal")?.focus();
        if (!itemsValid) return document.getElementById("subjectInput")?.focus();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);

        if (!formValid) {
            focusFirstInvalid();
            return;
        }

        // Build payload (ready for backend)
        const payload = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.trim(),
            phone: `${phonePrefix} ${phoneLocal.trim()}`,
            country: country || undefined,
            subjects: items.map((i) => i.subject),
            subjectPrices: items.map((i) => ({
                subject: i.subject,
                duration: i.duration,
                price: i.price,
            })),
            bio: bio || undefined,
            bioFull: bioFull || undefined,
            createdAt: new Date().toISOString(),
        };

        console.log("Tutor application payload (send to backend):", payload);

        // TODO: send to your backend:
        // await fetch("/api/tutors/apply", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload),
        // });

        alert("Вашата апликација е подготвена за праќање кон сервер.");
    }

    return (
        <div className="w-full">
            <header className="fixed inset-x-0 top-0 z-50 bg-[#ff6ca3]">
                <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10 text-[#0a0a0a]">
                    <div className="text-[28px] font-extrabold">Професори</div>
                    <div />
                </div>
            </header>
            <div className="h-[72px]" />

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-[900px] px-6 md:px-10 py-8 space-y-8" noValidate>
                <h1 className="text-3xl md:text-4xl font-extrabold">Апликација за професор</h1>

                {/* Name / Email */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                            Име и презиме <span className="text-pink-600">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="пр. Ана Петровска"
                            aria-invalid={submitted && !nameValid ? true : undefined}
                            className={inputClass(submitted && !nameValid)}
                            required
                        />
                        {submitted && !nameValid && (
                            <p className="mt-1 text-xs text-pink-600">Внесете најмалку две зборови (име и презиме).</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                            Е-пошта <span className="text-pink-600">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            aria-invalid={submitted && !emailValid ? true : undefined}
                            className={inputClass(submitted && !emailValid)}
                            required
                        />
                        {submitted && !emailValid && (
                            <p className="mt-1 text-xs text-pink-600">Внесете валидна е-пошта.</p>
                        )}
                    </div>
                </div>

                {/* Country */}
                <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-slate-700">
                        Земја
                    </label>
                    <input
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="пр. North Macedonia"
                        className={inputClass(false)}
                    />
                </div>

                {/* Phone */}
                <fieldset>
                    <legend className="block text-sm font-semibold text-slate-700">
                        Телефон <span className="text-pink-600">*</span>
                    </legend>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[12rem_1fr]">
                        <div>
                            <label htmlFor="phonePrefix" className="block text-xs font-semibold text-slate-600">
                                Префикс
                            </label>
                            <select
                                id="phonePrefix"
                                name="phonePrefix"
                                value={phonePrefix}
                                onChange={(e) => setPhonePrefix(e.target.value)}
                                className={inputClass(false)}
                            >
                                {PHONE_PREFIXES.map((p) => (
                                    <option key={p.code} value={p.code}>
                                        {p.code} — {p.country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="phoneLocal" className="block text-xs font-semibold text-slate-600">
                                Локален број
                            </label>
                            <input
                                id="phoneLocal"
                                name="phoneLocal"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel-national"
                                value={phoneLocal}
                                onChange={(e) => setPhoneLocal(e.target.value)}
                                placeholder="70123456"
                                aria-invalid={submitted && !phoneValid ? true : undefined}
                                className={inputClass(submitted && !phoneValid)}
                                required
                            />
                            {submitted && !phoneValid && (
                                <p className="mt-1 text-xs text-pink-600">Внесете најмалку 6 цифри за локалниот број.</p>
                            )}
                        </div>
                    </div>
                </fieldset>

                {/* Subjects row */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700">
                        Предмети (одберете од листата), времетраење и цена <span className="text-pink-600">*</span>
                    </label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_10rem_10rem_auto] sm:items-start">
                        <div className="relative">
                            <label htmlFor="subjectInput" className="sr-only">
                                Предмет
                            </label>
                            <input
                                id="subjectInput"
                                name="subjectInput"
                                list="subject-suggestions"
                                value={subjectInput}
                                onChange={(e) => setSubjectInput(e.target.value)}
                                placeholder="Почнете да пишувате (пр. Математика...)"
                                className={inputClass(submitted && !itemsValid && !subjectInput)}
                                autoComplete="off"
                            />
                            <datalist id="subject-suggestions">
                                {(SUBJECT_SUGGESTIONS as string[]).map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>

                            {/* Inline suggestions dropdown (optional UI) */}
                            {subjectInput && filteredSuggestions.length > 0 && (
                                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                    {filteredSuggestions.map((s) => (
                                        <li key={s}>
                                            <button
                                                type="button"
                                                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                                                onClick={() => setSubjectInput(s)}
                                            >
                                                {s}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label htmlFor="durationInput" className="sr-only">
                                Времетраење
                            </label>
                            <select
                                id="durationInput"
                                name="durationInput"
                                value={durationInput}
                                onChange={(e) => setDurationInput(e.target.value as Duration)}
                                className={inputClass(false)}
                            >
                                {DURATIONS.map((d) => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priceInput" className="sr-only">
                                Цена
                            </label>
                            <input
                                id="priceInput"
                                name="priceInput"
                                type="number"
                                min={1}
                                value={priceInput}
                                onChange={(e) => setPriceInput(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="Цена (USD)"
                                className={inputClass(submitted && !itemsValid && (priceInput === "" || Number(priceInput) <= 0))}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                        >
                            Додади
                        </button>
                    </div>

                    {/* Selected subjects */}
                    {items.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {items.map((it) => (
                                <div
                                    key={it.id}
                                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center"
                                >
                                    <div className="font-semibold text-slate-800 flex-1">{it.subject}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-600">Време:</span>
                                        <select
                                            value={it.duration}
                                            onChange={(e) =>
                                                setItems((prev) =>
                                                    prev.map((x) => (x.id === it.id ? { ...x, duration: e.target.value as Duration } : x))
                                                )
                                            }
                                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                                        >
                                            {DURATIONS.map((d) => (
                                                <option key={d.value} value={d.value}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-600">Цена (USD):</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={it.price}
                                            onChange={(e) =>
                                                setItems((prev) =>
                                                    prev.map((x) => (x.id === it.id ? { ...x, price: Number(e.target.value) } : x))
                                                )
                                            }
                                            className="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(it.id)}
                                        className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                                    >
                                        Отстрани
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {submitted && !itemsValid && (
                        <p className="mt-1 text-xs text-pink-600">Додадете барем еден предмет со валидна цена.</p>
                    )}
                </div>

                {/* Bios */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="bio" className="block text-sm font-semibold text-slate-700">
                            Кратка био
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Краток опис за тебе (до ~200 зборови)."
                            className={inputClass(false)}
                        />
                    </div>
                    <div>
                        <label htmlFor="bioFull" className="block text-sm font-semibold text-slate-700">
                            Детална био
                        </label>
                        <textarea
                            id="bioFull"
                            name="bioFull"
                            rows={4}
                            value={bioFull}
                            onChange={(e) => setBioFull(e.target.value)}
                            placeholder="Искуство, методологија, примери..."
                            className={inputClass(false)}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-500"
                    >
                        Поднеси апликација
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyTutorPage;
