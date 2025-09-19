import React from "react";

/* ---------- Small UI bits ---------- */
const StepBadge: React.FC<{ n: number; className?: string }> = ({ n, className }) => (
  <span
    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-[15px] font-extrabold ${className}`}
    aria-hidden
  >
    {n}
  </span>
);

const Avatar: React.FC<{ name: string; bg?: string }> = ({ name, bg = "bg-emerald-200" }) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`grid h-12 w-12 place-items-center rounded-full ${bg} text-slate-800 font-bold ring-1 ring-black/10`}
      aria-hidden
    >
      {initials}
    </div>
  );
};

const MiniTutorRow: React.FC<{ name: string; langs: string; rating?: string }> = ({
  name,
  langs,
  rating = "4.9",
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
    <Avatar name={name} />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold">{name}</p>
      
      </div>
      <p className="truncate text-xs text-slate-600">{langs}</p>
    </div>
  </div>
);

/* ---------- Main Section ---------- */
const HowItWorks: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-12 md:py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Како да започнете
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1 */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm overflow-hidden">
            <StepBadge n={1} className="bg-emerald-300 text-slate-900" />
            <h3 className="mt-4 text-3xl md:text-[34px] font-extrabold leading-tight">
              Најдете го вашиот предмет
            </h3>
            <p className="mt-3 text-slate-700">
             Пребарувајте според името на предметот
            </p>

            {/* stacked mini tutor cards */}
            <div className="relative mt-5">
              <div className="relative z-20">
                <MiniTutorRow
                  name="Математика 1."
                  
                />
              </div>
              <div className="relative z-10 -mt-3 translate-x-10">
                <MiniTutorRow
                  name=" Дискретни структури 2"
                 
                />
              </div>
              <div className="relative -mt-3 translate-x-20">
                <MiniTutorRow
                  name=" Статистика"
                  
                />
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm">
            <StepBadge n={2} className="bg-yellow-300 text-slate-900" />
            <h3 className="mt-4 text-3xl md:text-[34px] font-extrabold leading-tight">
              Оберете професор и закажете час и започнете со учење
            </h3>
            <p className="mt-3 text-slate-700">
              Одредете го најпогодното време за учење. Вашиот професор ќе ве води низ лекциите и планира вашите заеднички следни чекори
            </p>

            {/* video-call style placeholder */}
            <div className="relative mt-5 h-[220px] w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm">
              <div className="absolute inset-0 grid place-items-center text-slate-400 font-semibold">
                Lesson preview
              </div>
              {/* PiP bubble */}
              <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-xl bg-white p-2 shadow-md ring-1 ring-black/10">
                <Avatar name="Student" bg="bg-sky-200" />
                <div className="pr-1">
                  <p className="text-xs font-semibold">You</p>
                  <p className="text-[11px] text-slate-600">Connected</p>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm">
            <StepBadge n={3} className="bg-sky-400 text-white" />
            <h3 className="mt-4 text-3xl md:text-[34px] font-extrabold leading-tight">
              Вежбање! Напредување! Повторување!
            </h3>
            <p className="mt-3 text-slate-700">
              Одберете колку часови неделно ќе одржување. Следете како напредувате и што сте совладале
            </p>

            {/* stacked lessons preview */}
            <div className="relative mt-5 h-[220px]">
              {/* far card */}
              <div className="absolute right-0 top-10 h-[170px] w-[70%] rounded-xl bg-white shadow-md ring-1 ring-slate-200" />
              {/* mid card */}
              <div className="absolute right-6 top-6 h-[180px] w-[78%] rounded-xl bg-white shadow-md ring-1 ring-slate-200" />
              {/* main card */}
              <div className="absolute left-0 top-0 h-[190px] w-[86%] rounded-xl bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-lg ring-1 ring-slate-200" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
