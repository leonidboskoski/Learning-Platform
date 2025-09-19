import React, { useEffect, useId, useRef, useState } from "react";

type Mode = "signin" | "signup";

type Props = {
    label?: string; // Button label
    className?: string;
    onAuthSuccess?: (payload: { mode: Mode; name?: string; email: string }) => void;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthButton: React.FC<Props> = ({
                                         label = "Најави се",
                                         className = "",
                                         onAuthSuccess,
                                     }) => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("signin");

    // Sign in
    const [inEmail, setInEmail] = useState("");
    const [inPassword, setInPassword] = useState("");
    const [inSubmitted, setInSubmitted] = useState(false);

    // Sign up
    const [upName, setUpName] = useState("");
    const [upEmail, setUpEmail] = useState("");
    const [upPassword, setUpPassword] = useState("");
    const [upConfirm, setUpConfirm] = useState("");
    const [upAgree, setUpAgree] = useState(false);
    const [upSubmitted, setUpSubmitted] = useState(false);

    // a11y
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);
    const titleId = useId();
    const descId = useId();

    const signinValid = emailRe.test(inEmail.trim()) && inPassword.length >= 6;
    const signupValid =
        upName.trim().split(/\s+/).length >= 2 &&
        emailRe.test(upEmail.trim()) &&
        upPassword.length >= 6 &&
        upPassword === upConfirm &&
        upAgree;

    const openDialog = (m: Mode) => {
        setMode(m);
        setOpen(true);
    };
    const closeDialog = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setTimeout(() => firstFieldRef.current?.focus(), 0);
        return () => {
            document.body.style.overflow = prev;
            triggerRef.current?.focus();
        };
    }, [open, mode]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDialog();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const inputCls = (invalid?: boolean) =>
        `w-full rounded-xl border px-3 py-2 text-sm outline-none ${
            invalid
                ? "border-pink-500 ring-1 ring-pink-500"
                : "border-slate-300 focus:border-slate-400"
        }`;

    async function handleSignin(e: React.FormEvent) {
        e.preventDefault();
        setInSubmitted(true);
        if (!signinValid) return;

        const payload = { mode: "signin" as const, email: inEmail.trim() };
        console.log("Sign in →", payload);
        onAuthSuccess?.(payload);
        closeDialog();
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setUpSubmitted(true);
        if (!signupValid) return;

        const payload = {
            mode: "signup" as const,
            name: upName.trim(),
            email: upEmail.trim(),
        };
        console.log("Sign up →", payload);
        onAuthSuccess?.(payload);
        closeDialog();
    }

    return (
        <>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => openDialog("signin")}
                className={`inline-flex items-center gap-2 rounded-[14px] border border-black/25 px-4 py-2 text-[15px] font-semibold bg-white/80 hover:bg-black hover:text-white transition ${className}`}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path d="M10 3a7 7 0 100 14h1v4l6-4h-1a7 7 0 000-14h-6z" fill="currentColor" />
                </svg>
                {label}
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={descId}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={closeDialog} aria-hidden />

                    {/* Panel */}
                    <div className="relative z-[101] w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl">
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 id={titleId} className="text-xl font-extrabold">
                                    {mode === "signin" ? "Најави се" : "Креирај профил"}
                                </h2>
                                <p id={descId} className="text-sm text-slate-600">
                                    {mode === "signin"
                                        ? "Внеси е-пошта и лозинка за пристап."
                                        : "Внеси ги податоците за да креираш сметка."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDialog}
                                className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                                aria-label="Затвори дијалог"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
                            <button
                                type="button"
                                onClick={() => setMode("signin")}
                                className={`rounded-lg py-2 ${mode === "signin" ? "bg-white shadow" : "opacity-70"}`}
                                aria-selected={mode === "signin"}
                            >
                                Најави се
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("signup")}
                                className={`rounded-lg py-2 ${mode === "signup" ? "bg-white shadow" : "opacity-70"}`}
                                aria-selected={mode === "signup"}
                            >
                                Регистрирај се
                            </button>
                        </div>

                        {/* Forms */}
                        {mode === "signin" ? (
                            <form onSubmit={handleSignin} noValidate>
                                <label htmlFor="auth-in-email" className="block text-sm font-medium">
                                    Е-пошта
                                </label>
                                <input
                                    id="auth-in-email"
                                    ref={firstFieldRef}
                                    type="email"
                                    autoComplete="email"
                                    className={inputCls(inSubmitted && !emailRe.test(inEmail.trim()))}
                                    value={inEmail}
                                    onChange={(e) => setInEmail(e.target.value)}
                                    placeholder="name@example.com"
                                />
                                {inSubmitted && !emailRe.test(inEmail.trim()) && (
                                    <p className="mt-1 text-xs text-pink-600">Внесете валидна е-пошта.</p>
                                )}

                                <label htmlFor="auth-in-pass" className="mt-4 block text-sm font-medium">
                                    Лозинка
                                </label>
                                <input
                                    id="auth-in-pass"
                                    type="password"
                                    autoComplete="current-password"
                                    className={inputCls(inSubmitted && inPassword.length < 6)}
                                    value={inPassword}
                                    onChange={(e) => setInPassword(e.target.value)}
                                    placeholder="Минимум 6 карактери"
                                />
                                {inSubmitted && inPassword.length < 6 && (
                                    <p className="mt-1 text-xs text-pink-600">Лозинката треба да има најмалку 6 карактери.</p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-6 w-full rounded-xl bg-black px-4 py-2.5 text-white font-semibold hover:bg-black/90"
                                >
                                    Најави се
                                </button>

                                <p className="mt-4 text-center text-sm text-slate-600">
                                    Немаш сметка?{" "}
                                    <button
                                        type="button"
                                        className="font-semibold underline"
                                        onClick={() => setMode("signup")}
                                    >
                                        Регистрирај се
                                    </button>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleSignup} noValidate>
                                <label htmlFor="auth-up-name" className="block text-sm font-medium">
                                    Име и презиме
                                </label>
                                <input
                                    id="auth-up-name"
                                    ref={firstFieldRef}
                                    className={inputCls(upSubmitted && upName.trim().split(/\s+/).length < 2)}
                                    value={upName}
                                    onChange={(e) => setUpName(e.target.value)}
                                    placeholder="пр. Ана Петровска"
                                />
                                {upSubmitted && upName.trim().split(/\s+/).length < 2 && (
                                    <p className="mt-1 text-xs text-pink-600">Внесете најмалку две зборови (име и презиме).</p>
                                )}

                                <label htmlFor="auth-up-email" className="mt-4 block text-sm font-medium">
                                    Е-пошта
                                </label>
                                <input
                                    id="auth-up-email"
                                    type="email"
                                    autoComplete="email"
                                    className={inputCls(upSubmitted && !emailRe.test(upEmail.trim()))}
                                    value={upEmail}
                                    onChange={(e) => setUpEmail(e.target.value)}
                                    placeholder="name@example.com"
                                />
                                {upSubmitted && !emailRe.test(upEmail.trim()) && (
                                    <p className="mt-1 text-xs text-pink-600">Внесете валидна е-пошта.</p>
                                )}

                                <label htmlFor="auth-up-pass" className="mt-4 block text-sm font-medium">
                                    Лозинка
                                </label>
                                <input
                                    id="auth-up-pass"
                                    type="password"
                                    autoComplete="new-password"
                                    className={inputCls(upSubmitted && upPassword.length < 6)}
                                    value={upPassword}
                                    onChange={(e) => setUpPassword(e.target.value)}
                                    placeholder="Минимум 6 карактери"
                                />
                                {upSubmitted && upPassword.length < 6 && (
                                    <p className="mt-1 text-xs text-pink-600">Лозинката треба да има најмалку 6 карактери.</p>
                                )}

                                <label htmlFor="auth-up-confirm" className="mt-4 block text-sm font-medium">
                                    Потврди лозинка
                                </label>
                                <input
                                    id="auth-up-confirm"
                                    type="password"
                                    autoComplete="new-password"
                                    className={inputCls(upSubmitted && upConfirm !== upPassword)}
                                    value={upConfirm}
                                    onChange={(e) => setUpConfirm(e.target.value)}
                                    placeholder="Повторно внеси лозинка"
                                />
                                {upSubmitted && upConfirm !== upPassword && (
                                    <p className="mt-1 text-xs text-pink-600">Лозинките не се совпаѓаат.</p>
                                )}

                                <label className="mt-4 flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300"
                                        checked={upAgree}
                                        onChange={(e) => setUpAgree(e.target.checked)}
                                    />
                                    Се согласувам со Условите за користење и Политиката за приватност.
                                </label>
                                {upSubmitted && !upAgree && (
                                    <p className="mt-1 text-xs text-pink-600">Мора да се согласите со условите.</p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-white font-semibold hover:bg-emerald-500"
                                    onClick={() => setUpSubmitted(true)}
                                >
                                    Креирај сметка
                                </button>

                                <p className="mt-4 text-center text-sm text-slate-600">
                                    Веќе имаш сметка?{" "}
                                    <button
                                        type="button"
                                        className="font-semibold underline"
                                        onClick={() => setMode("signin")}
                                    >
                                        Најави се
                                    </button>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthButton;
