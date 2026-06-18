"use client";

import React, { useState } from "react";
import { submitCommentAction } from "@/app/admin/actions";
import { MessageSquare, Send } from "lucide-react";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    formData.append("postId", postId);

    const res = await submitCommentAction(null, formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Your comment has been posted successfully!");
      e.currentTarget.reset();
      // Reload page to show new comment
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="glass-panel border-white/5 p-6 sm:p-8 mt-12 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-500/5 blur-[25px] pointer-events-none" />

      <h3 className="text-lg font-bold font-heading uppercase text-white tracking-wider mb-2 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-cyan-400" />
        Leave a Comment
      </h3>
      <p className="text-xs text-neutral-400 font-light mb-6">
        Share your thoughts or questions about these cosmological concepts.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center font-heading animate-pulse">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-semibold text-center font-heading">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="authorName">
            Your Name
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            required
            className="w-full max-w-[320px] px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:bg-[#0b071e]/70 focus:outline-none transition-all duration-300 text-sm font-heading text-white placeholder-neutral-600"
            placeholder="e.g. Richard Feynman"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="content">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:bg-[#0b071e]/70 focus:outline-none transition-all duration-300 text-sm font-heading text-white custom-scrollbar resize-none leading-relaxed placeholder-neutral-600"
            placeholder="Type your comment here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
        >
          {loading ? "Posting..." : "Post Comment"}
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
