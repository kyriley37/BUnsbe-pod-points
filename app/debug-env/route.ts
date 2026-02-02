import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

  return NextResponse.json({
    hasApiKey: apiKey.length > 0,
    apiKeyLen: apiKey.length,
    apiKeyStartsWithAIza: apiKey.startsWith("AIza"),
    hasAuthDomain: authDomain.length > 0,
    hasProjectId: projectId.length > 0,
  });
}
