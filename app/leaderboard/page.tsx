import { getAdminDb } from "@/lib/firebaseAdmin";

export const revalidate = 0;

type Pod = {
  id: string;
  name: string;
  points: number;
};

export default async function LeaderboardPage() {
  const db = getAdminDb();
  const snapshot = await db.collection("pods").orderBy("points", "desc").get();

  const pods: Pod[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { name: string; points: number }),
  }));

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600">
        BU NSBE Family Pod Leaderboard
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {pods.map((pod, index) => (
          <div
            key={pod.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-red-500">
                #{index + 1}
              </span>
              <span className="text-lg">{pod.name}</span>
            </div>
            <span className="text-xl font-semibold">
              {pod.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

