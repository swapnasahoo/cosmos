import { createClient } from "@/utils/supabase/server";

export interface SessionPayload {
  userId: string;
  username: string;
  role: "admin" | "writer";
  name: string;
}

// Retrieve the current authenticated Supabase session and user profile
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Fetch the user's role and details from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, name, username")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.warn("User profile not found in profiles table:", user.id);
      return null;
    }

    return {
      userId: user.id,
      username: profile.username,
      role: profile.role as "admin" | "writer",
      name: profile.name,
    };
  } catch (err) {
    console.error("getSession failed:", err);
    return null;
  }
}
