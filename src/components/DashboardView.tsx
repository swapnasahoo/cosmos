"use client";

import React, { useState } from "react";
import { 
  logoutAction, 
  savePostAction, 
  deletePostAction, 
  saveUserAction, 
  deleteUserAction, 
  changePasswordAction 
} from "@/app/admin/actions";
import { 
  FileText, 
  Users as UsersIcon, 
  Key, 
  LogOut, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Globe,
  Check,
  AlertCircle
} from "lucide-react";
import { SessionPayload } from "@/lib/auth";
import { BlogPost, User } from "@/lib/db";

interface DashboardViewProps {
  session: SessionPayload;
  initialPosts: BlogPost[];
  initialUsers: User[];
}

export default function DashboardView({ session, initialPosts, initialUsers }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "users" | "password">("posts");
  
  // Data list states
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Post Modal states
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  // User Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // Password tab states
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Handle Logout
  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      window.location.href = "/admin/login";
    }
  };

  // --- POST FORM HANDLERS ---
  const openNewPostModal = () => {
    setEditingPost(null);
    setPostError("");
    setPostSuccess("");
    setPostModalOpen(true);
  };

  const openEditPostModal = (post: BlogPost) => {
    setEditingPost(post);
    setPostError("");
    setPostSuccess("");
    setPostModalOpen(true);
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostLoading(true);
    setPostError("");
    setPostSuccess("");

    const formData = new FormData(e.currentTarget);
    if (editingPost) {
      formData.append("id", editingPost.id);
    }

    const res = await savePostAction(null, formData);
    if (res.error) {
      setPostError(res.error);
      setPostLoading(false);
    } else {
      setPostSuccess(res.message || "Operation successful!");
      // Reload page state or update list
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await deletePostAction(id);
    if (res.error) {
      alert(res.error);
    } else {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  // --- USER FORM HANDLERS ---
  const openNewUserModal = () => {
    setEditingUser(null);
    setUserError("");
    setUserSuccess("");
    setUserModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserError("");
    setUserSuccess("");
    setUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError("");
    setUserSuccess("");

    const formData = new FormData(e.currentTarget);
    if (editingUser) {
      formData.append("id", editingUser.id);
    }

    const res = await saveUserAction(null, formData);
    if (res.error) {
      setUserError(res.error);
      setUserLoading(false);
    } else {
      setUserSuccess(res.message || "Operation successful!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUserAction(id);
    if (res.error) {
      alert(res.error);
    } else {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // --- PASSWORD CHANGE HANDLER ---
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPassLoading(true);
    setPassError("");
    setPassSuccess("");

    const formData = new FormData(e.currentTarget);
    const res = await changePasswordAction(null, formData);

    if (res.error) {
      setPassError(res.error);
      setPassLoading(false);
    } else {
      setPassSuccess(res.message || "Success!");
      setPassLoading(false);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#04020a]/80 backdrop-blur-md">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#09061c]/80 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 font-heading font-black tracking-wider text-white select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f2fe]" />
            <span className="text-xl tracking-widest font-heading font-black">COSMOS</span>
            <span className="text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md ml-1 font-heading uppercase">
              Portal
            </span>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest font-heading mb-3">
              User Profile
            </p>
            <p className="text-sm font-bold text-white tracking-wide truncate">{session.name}</p>
            <p className="text-xs text-cyan-400 font-medium tracking-wide mt-0.5 capitalize font-mono">
              Role: {session.role}
            </p>
          </div>

          {/* Nav Tabs */}
          <nav className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "posts"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              Blog Posts
            </button>

            {session.role === "admin" && (
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <UsersIcon className="w-4 h-4" />
                Writers / Users
              </button>
            )}

            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "password"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/5 pt-4">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider font-heading hover:bg-white/5 mb-2 transition-all"
          >
            <Globe className="w-4 h-4" />
            Main Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider font-heading hover:bg-red-500/10 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* TAB 1: POSTS MANAGER */}
        {activeTab === "posts" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black font-heading tracking-wide uppercase text-white">
                  Blog Articles
                </h1>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Create, edit, and publish cosmic articles for the public blog feed.
                </p>
              </div>
              <button
                onClick={openNewPostModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-500 text-black hover:bg-cyan-400 font-heading font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                <Plus className="w-3.5 h-3.5" /> New Article
              </button>
            </div>

            {/* Posts Table */}
            <div className="glass-panel border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-white/2">
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-500 font-light font-heading">
                          No articles found. Click &quot;New Article&quot; to write your first post.
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-white text-sm block tracking-wide">{post.title}</span>
                            <span className="text-[10px] text-neutral-500 font-mono block mt-0.5 select-all">/{post.slug}</span>
                          </td>
                          <td className="p-4 font-medium text-neutral-300">
                            {post.authorName}
                            <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono block w-fit mt-0.5 uppercase tracking-wider text-neutral-500">
                              {post.authorRole}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-heading uppercase border ${
                                post.published
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-400 font-mono">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditPostModal(post)}
                                className="p-2 rounded-lg border border-white/5 hover:border-cyan-500/20 bg-white/3 text-neutral-400 hover:text-cyan-400 cursor-pointer transition-all"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="p-2 rounded-lg border border-white/5 hover:border-red-500/20 bg-white/3 text-neutral-400 hover:text-red-400 cursor-pointer transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGER (Admin only) */}
        {activeTab === "users" && session.role === "admin" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black font-heading tracking-wide uppercase text-white">
                  Writers & Administrators
                </h1>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Manage accounts for writers and editors who write articles.
                </p>
              </div>
              <button
                onClick={openNewUserModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-500 text-black hover:bg-cyan-400 font-heading font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)]"
              >
                <Plus className="w-3.5 h-3.5" /> Add New User
              </button>
            </div>

            {/* Users Table */}
            <div className="glass-panel border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-white/2">
                      <th className="p-4 pl-6">Full Name</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 pl-6">
                          <span className="font-bold text-white text-sm block tracking-wide">{user.name}</span>
                        </td>
                        <td className="p-4 text-neutral-300 font-mono select-all">
                          {user.username}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-heading uppercase border ${
                              user.role === "admin"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="p-2 rounded-lg border border-white/5 hover:border-cyan-500/20 bg-white/3 text-neutral-400 hover:text-cyan-400 cursor-pointer transition-all"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={session.userId === user.id}
                              className="p-2 rounded-lg border border-white/5 hover:border-red-500/20 bg-white/3 text-neutral-400 hover:text-red-400 cursor-pointer transition-all disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:border-white/5"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PASSWORD TAB */}
        {activeTab === "password" && (
          <div className="max-w-[480px]">
            <h1 className="text-2xl font-black font-heading tracking-wide uppercase text-white mb-2">
              Update Password
            </h1>
            <p className="text-xs text-neutral-400 font-light mb-6">
              Change the password you use to authenticate into this Cosmic panel.
            </p>

            <div className="glass-panel border-white/5 p-8 relative overflow-hidden">
              {passError && (
                <div className="mb-6 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center font-heading">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="mb-6 p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-semibold text-center font-heading">
                  {passSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none transition-all duration-300 text-sm font-heading placeholder-neutral-600 text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none transition-all duration-300 text-sm font-heading placeholder-neutral-600 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passLoading}
                  className="mt-2 w-full py-3 rounded-xl bg-cyan-500 text-black font-heading font-black text-xs hover:bg-cyan-400 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {passLoading ? "SAVING..." : "UPDATE PASSWORD"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* --- MODEL WINDOWS (OVERLAYS) --- */}

      {/* 1. Article Form Overlay */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[720px] max-h-[90vh] overflow-y-auto glass-panel border-white/5 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 custom-scrollbar bg-[#09061c]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold font-heading uppercase text-white tracking-wider">
                {editingPost ? "Edit Blog Article" : "Write New Article"}
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postError && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center font-heading">
                {postError}
              </div>
            )}
            {postSuccess && (
              <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-semibold text-center font-heading">
                {postSuccess}
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="post-title">
                    Article Title
                  </label>
                  <input
                    id="post-title"
                    name="title"
                    type="text"
                    required
                    defaultValue={editingPost?.title || ""}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white"
                    placeholder="e.g. The Quantum Foam of Singularity"
                  />
                </div>

                {/* Cover Image */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="post-cover">
                    Cover Image Path
                  </label>
                  <select
                    id="post-cover"
                    name="coverImage"
                    defaultValue={editingPost?.coverImage || "/images/galaxy.jpg"}
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#09061c] focus:border-cyan-500 focus:outline-none text-sm text-white cursor-pointer"
                  >
                    <option value="/images/galaxy.jpg">Cosmic Galaxy (Default)</option>
                    <option value="/images/cmb.jpg">Cosmic Microwave Background</option>
                    <option value="/images/hero.jpg">Deep Space Graphic</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="post-excerpt">
                  Short Excerpt
                </label>
                <input
                  id="post-excerpt"
                  name="excerpt"
                  type="text"
                  required
                  defaultValue={editingPost?.excerpt || ""}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white"
                  placeholder="Summarize the core premise of the article in one sentence."
                />
              </div>

              {/* Content (Markdown Textarea) */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="post-content">
                    Markdown Content
                  </label>
                  <span className="text-[10px] text-neutral-500 font-light">
                    Supports headers (#, ##), **bold**, *italics*, and lists.
                  </span>
                </div>
                <textarea
                  id="post-content"
                  name="content"
                  required
                  rows={8}
                  defaultValue={editingPost?.content || ""}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white font-mono leading-relaxed custom-scrollbar resize-y"
                  placeholder="# Enter your Markdown article content here..."
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading">
                  Publication Status:
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-heading font-semibold text-white">
                    <input
                      type="radio"
                      name="published"
                      value="true"
                      defaultChecked={editingPost ? editingPost.published : true}
                      className="accent-cyan-500"
                    />
                    Publish Immediately
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-heading font-semibold text-neutral-400 hover:text-white">
                    <input
                      type="radio"
                      name="published"
                      value="false"
                      defaultChecked={editingPost ? !editingPost.published : false}
                      className="accent-cyan-500"
                    />
                    Keep as Draft
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white font-heading font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {postLoading ? "SAVING..." : "SAVE ARTICLE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. User Form Overlay (Admin only) */}
      {userModalOpen && session.role === "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[480px] glass-panel border-white/5 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 bg-[#09061c]">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold font-heading uppercase text-white tracking-wider">
                {editingUser ? "Edit User Details" : "Create New User"}
              </h3>
              <button
                onClick={() => setUserModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userError && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center font-heading">
                {userError}
              </div>
            )}
            {userSuccess && (
              <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-semibold text-center font-heading">
                {userSuccess}
              </div>
            )}

            <form onSubmit={handleUserSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="user-name">
                  Full Name
                </label>
                <input
                  id="user-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingUser?.name || ""}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white"
                  placeholder="e.g. Dr. Carl Sagan"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="user-username">
                  Username
                </label>
                <input
                  id="user-username"
                  name="username"
                  type="text"
                  required
                  defaultValue={editingUser?.username || ""}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white font-mono"
                  placeholder="e.g. csagan"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="user-role">
                  System Role
                </label>
                <select
                  id="user-role"
                  name="role"
                  defaultValue={editingUser?.role || "writer"}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#09061c] focus:border-cyan-500 focus:outline-none text-sm text-white cursor-pointer"
                >
                  <option value="writer">Writer (Can write/edit own articles)</option>
                  <option value="admin">Admin (Can manage users & all articles)</option>
                </select>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest font-heading" htmlFor="user-pass">
                    Password
                  </label>
                  {editingUser && (
                    <span className="text-[9px] text-neutral-500 font-light">
                      Leave blank to keep current password
                    </span>
                  )}
                </div>
                <input
                  id="user-pass"
                  name="password"
                  type="password"
                  required={!editingUser}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:outline-none text-sm text-white"
                  placeholder={editingUser ? "••••••••" : "At least 6 characters"}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white font-heading font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userLoading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {userLoading ? "SAVING..." : "SAVE USER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
