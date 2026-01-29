"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleLogin() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">NSBE Pod Points</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to submit points and view the leaderboard.
        </p>

        <div className="mt-6">
          {!user ? (
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-black text-white py-3"
            >
              Sign in with Google
            </button>
          ) : (
            <>
              <div className="text-sm">
                Signed in as <span className="font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full rounded-xl border py-3"
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
