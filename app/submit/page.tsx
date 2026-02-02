"use client";

export default function SubmitPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/15 bg-black/40 backdrop-blur-md p-8">
        <h1 className="text-3xl font-semibold">Submit Points</h1>
        <p className="mt-2 text-sm text-white/65">
          We’ll connect this to Firestore next so E-Board can submit points fast.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="text-sm text-white/70">Coming next:</div>
            <ul className="mt-2 list-disc pl-5 text-white/80 text-sm space-y-1">
              <li>Select Pod</li>
              <li>Select Action (auto-fills points)</li>
              <li>Optional notes + event name</li>
              <li>Submit → Firestore</li>
            </ul>
          </div>

          <a
            href="/login"
            className="inline-block rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
