import { getPosts } from "@/lib/db";
import Header from "@/components/Header";
import BlogView from "@/components/BlogView";
import Starfield from "@/components/Starfield";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  // Retrieve only published articles
  const allPosts = await getPosts();
  const posts = allPosts.filter((p) => p.published);

  return (
    <>
      <Starfield />
      <Header />
      <main className="relative z-10 min-h-screen pt-28">
        <BlogView initialPosts={posts} />
      </main>
    </>
  );
}
