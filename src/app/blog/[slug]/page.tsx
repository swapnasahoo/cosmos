import { getPostBySlug, getCommentsForPost } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseMarkdown } from "@/lib/markdown";
import Header from "@/components/Header";
import Starfield from "@/components/Starfield";
import CommentForm from "@/components/CommentForm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft, AlertCircle } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Preview validation: allow draft view only for the author or admins
  if (!post.published) {
    const session = await getSession();
    const canPreview = session && (session.role === "admin" || session.userId === post.authorId);
    if (!canPreview) {
      notFound();
    }
  }

  const comments = await getCommentsForPost(post.id);

  // Calculate reading time
  const words = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Render markdown content to html safely on server
  const htmlContent = parseMarkdown(post.content);

  return (
    <>
      <Starfield />
      <Header />
      <main className="relative z-10 min-h-screen pt-28 pb-24 max-w-[800px] mx-auto px-6">
        {/* Preview Banner */}
        {!post.published && (
          <div className="mb-8 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-xs font-semibold flex items-center gap-2 font-heading shadow-[0_0_15px_rgba(234,179,8,0.05)] animate-pulse animate-duration-1000">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-400" />
            <span>PREVIEW MODE — This article is currently a Draft/Stalled and is hidden from the public timeline.</span>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-widest uppercase text-cyan-400 hover:text-cyan-300 transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to Chronicle
        </Link>

        {/* Article Container */}
        <article className="w-full flex flex-col gap-6">
          {/* Cover Image banner */}
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={post.coverImage}
              alt={`Cover image for ${post.title}`}
              fill
              priority
              className="object-cover select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight uppercase leading-tight mt-2">
              {post.title}
            </h1>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-neutral-400 border-b border-white/5 pb-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {post.authorName} ({post.authorRole})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {readingTime} min read
              </span>
            </div>
          </div>

          {/* Rendered Markdown Body */}
          <div 
            className="prose prose-invert max-w-none font-light leading-relaxed my-4 space-y-6"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {/* Comments Section */}
        <div className="mt-16 border-t border-white/5 pt-12 flex flex-col gap-8">
          <h3 className="text-xl font-bold font-heading uppercase text-white tracking-wide flex items-center gap-2">
            Discussion ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <p className="text-xs text-neutral-500 font-light italic bg-white/2 p-5 rounded-2xl border border-white/5 text-center">
              No comments yet. Share your insights below to start the conversation!
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {comments.map((comment) => (
                <div key={comment.id} className="p-5 rounded-2xl border border-white/5 bg-[#0b071e]/10 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white tracking-wide">{comment.authorName}</span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <CommentForm postId={post.id} />
        </div>

        {/* Footer info box */}
        <div className="mt-16 p-6 rounded-2xl border border-white/5 bg-[#0b071e]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-xs text-neutral-400 font-light">Published by</span>
            <span className="text-sm font-bold text-white tracking-wide mt-0.5">{post.authorName}</span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5">{post.authorRole}</span>
          </div>
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 transition-all font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Explore More Articles
          </Link>
        </div>
      </main>
    </>
  );
}
