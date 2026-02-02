"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-black/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md p-8">

        {/* Banner */}
        <Image
          src="/bu-nsbe-fam-pod-logo.png"
          alt="BU NSBE Family Pods"
          width={1400}
          height={500}
          priority
          className="w-full rounded-2xl mb-6"
        />

        {/* Subheader row */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="/bu-nsbe-logo.png"
            alt="BU NSBE"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <div className="text-sm text-white/70">
            Boston University NSBE
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Family Pod Points
        </h1>

        <p className="mt-2 text-sm text-white/65">
          Sign in to submit points and view the leaderboard.
        </p>

        <div className="mt-7">
          {!user ? (
            <button
              onClick={handleLogin}
              className="w-full rounded-2xl bg-[#CC0000] py-3 font-medium hover:bg-[#9B0000] transition"
            >
              Sign in with Google
            </button>
          ) : (
            <>
              <div className="text-sm text-white/80">
                Signed in as <span className="font-medium">{user.email}</span>
              </div>

              <div className="mt-5 flex gap-3">
                <a
                  href="/submit"
                  className="flex-1 text-center rounded-2xl bg-white/10 py-3 font-medium hover:bg-white/15 transition"
                >
                  Submit points
                </a>

                <a
                  href="/leaderboard"
                  className="flex-1 text-center rounded-2xl bg-white/10 py-3 font-medium hover:bg-white/15 transition"
                >
                  View leaderboard
                </a>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 w-full rounded-2xl border border-white/15 py-3 hover:bg-white/5 transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


