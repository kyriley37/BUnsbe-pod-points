"use client";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-black/40 backdrop-blur-md p-8">
        <h1 className="text-3xl font-semibold">Leaderboard</h1>
        <p className="mt-2 text-sm text-white/65">
          This will pull totals from Firestore and sort pods automatically.
        </p>

        <div className="mt-8 rounded-2xl bg-white/5 p-4 text-sm text-white/80">
          Next: we’ll compute totals and show Pod name + points + last updated.
        </div>

        <a
          href="/login"
          className="mt-6 inline-block rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}
