import React from "react";
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton.tsx";

const HeroBar: React.FC = () => {
  return (
      // FULL WIDTH hero background
      <div className="w-screen h-fit overflow-x-hidden bg-[#ff6ca3] text-[#0a0a0a] m-0 p-0">
        {/* NAVBAR */}
        <header className="w-full">
          <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10">
            {/* logo */}
            <div className="flex items-center gap-3">
              <div className="text-[28px] font-extrabold tracking-tight leading-none">Професори</div>
              <svg width="26" height="26" viewBox="0 0 24 24" className="opacity-80 -mt-[2px]">
                <path d="M4 7h10a4 4 0 0 1 0 8H8l-4 3V7z" fill="currentColor" />
              </svg>
            </div>

            {/* nav */}
            <nav className="hidden md:flex items-center gap-8 text-[17px] font-semibold">
              <Link
                  to="/tutors"
                  className="hover:opacity-80 text-black"
              >
                Пронајди професор

              </Link>
              <Link
                  to="/teach"
                  className="hover:opacity-80 text-black"
              >
                Започни како професор

              </Link>
            </nav>

            {/* right controls */}
            <div className="flex items-center gap-4">
              <AuthButton />
          </div>
      </div>
</header>

  {/* HERO (text only) */}
  <main>
    <div className="mx-auto max-w-[1320px] px-6 md:px-10 pb-24 pt-8">
      <h1 className="max-w-[820px] text-[56px] leading-[1.03] font-extrabold md:text-[88px]">
        Учете брзо
        <br />ефективно
        <br />со најдобрите професори
      </h1>

      <Link
          to="/tutors"
          className="mt-10 inline-flex h-[72px] items-center gap-3 rounded-[16px] bg-[#0a0a0a] px-8 text-[20px] font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition"
      >
        Започни
        <svg width="22" height="22" viewBox="0 0 24 24" className="translate-y-[1px]">
          <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  </main>
</div>
);
};

export default HeroBar;
