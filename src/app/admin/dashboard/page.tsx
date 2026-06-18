import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPosts, getUsers, getSystemSettings } from "@/lib/db";
import DashboardView from "@/components/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Load database items on server side
  const posts = await getPosts();
  const users = session.role === "admin" ? await getUsers() : [];
  const settings = await getSystemSettings();

  return (
    <DashboardView 
      session={session} 
      initialPosts={posts} 
      initialUsers={users} 
      initialSettings={settings}
    />
  );
}
