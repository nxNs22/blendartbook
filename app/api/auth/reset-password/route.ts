import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, redirectTo } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: `Server config error: URL=${!!supabaseUrl}, KEY=${!!supabaseAnonKey}` },
        { status: 500 }
      );
    }

    // Use raw fetch instead of Supabase client to avoid any client-side issues
    const recoverUrl = `${supabaseUrl}/auth/v1/recover`;
    
    const response = await fetch(recoverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        email: email.trim(),
        gotrue_meta_security: {},
        ...(redirectTo ? { redirectTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Supabase returned ${response.status}: ${errorData}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // Capture as much detail as possible
    const message = err instanceof Error 
      ? `${err.name}: ${err.message}` 
      : "An unexpected error occurred";
    const cause = err instanceof Error && err.cause 
      ? String(err.cause) 
      : "no cause";
    
    return NextResponse.json(
      { error: message, cause, supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET" },
      { status: 500 }
    );
  }
}
