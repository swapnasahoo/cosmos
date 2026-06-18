"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, Clock, ArrowRight, Globe } from "lucide-react";
import { BlogPost } from "@/lib/db";

interface BlogViewProps {
  initialPosts: BlogPost[];
}

export default function BlogView({ initialPosts }: BlogViewProps) {
  const [search, setSearch] = useState("");

  const filteredPosts = initialPosts.filter((post) => {
    const term = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.authorName.toLowerCase().includes(term)
    );
  });

  const getReadingTime = (content: string): number => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // ~200 WPM
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Blog Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 w-full flex flex-col gap-6 text-center items-center pb-12">
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
          COSMIC ARCHIVES
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-white tracking-tight uppercase leading-none">
          The Cosmic Chronicle
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-[620px] font-light leading-relaxed">
          Discover stories and papers about cosmology, astrophysics, the early universe, stellar accretion, and observations of the cosmic background.
        </p>

        {/* Search Input bar */}
        <div className="relative w-full max-w-[480px] mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search articles, topics, authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-full border border-white/5 bg-[#0b071e]/50 focus:border-cyan-500 focus:bg-[#0b071e]/70 focus:outline-none transition-all duration-300 text-sm font-heading tracking-wide placeholder-neutral-500 text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          />
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-[1200px] mx-auto px-6 w-full flex-1 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 glass-panel border-white/5">
            <p className="text-neutral-500 font-heading text-sm uppercase tracking-wider">
              No matching articles found
            </p>
            <p className="text-xs text-neutral-600 font-light mt-1">
              Try modifying your search keywords or parameters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const readingTime = getReadingTime(post.content);
              return (
                <article
                  key={post.id}
                  className="glass-panel border-white/5 overflow-hidden hover:border-cyan-500/20 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="flex flex-col">
                    {/* Card Cover image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/5">
                      <Image
                        src={post.coverImage}
                        alt={`Cover image for ${post.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="p-6 flex flex-col gap-3">
                      {/* Meta information row */}
                      <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readingTime} min read
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold font-heading text-white tracking-wide uppercase group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer row */}
                  <div className="px-6 pb-6 pt-4 border-t border-white/3 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {post.authorName}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5 tracking-wider">
                        {post.authorRole}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-[10px] font-heading font-black tracking-widest uppercase text-cyan-400 group-hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      Read Post <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="w-full border-t border-white/5 bg-[#030107] py-16 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading font-black tracking-wider text-white select-none"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              <span className="text-lg tracking-widest font-heading font-black">COSMOS</span>
            </Link>
            <p className="text-xs text-neutral-500 font-light text-center sm:text-right">
              &copy; 2026 Cosmos Explorations. Science and physics timeline blog.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
