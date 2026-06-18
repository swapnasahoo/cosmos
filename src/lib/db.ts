import { createClient } from "@/utils/supabase/server";

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "writer";
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorRole: "admin" | "writer";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mapper: TypeScript camelCase -> PostgreSQL snake_case
function mapPostToDb(post: Partial<BlogPost>) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage,
    author_id: post.authorId,
    author_name: post.authorName,
    author_role: post.authorRole,
    published: post.published,
    updated_at: new Date().toISOString(),
  };
}

// Mapper: PostgreSQL snake_case -> TypeScript camelCase
function mapDbToPost(dbPost: any): BlogPost {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    coverImage: dbPost.cover_image,
    authorId: dbPost.author_id,
    authorName: dbPost.author_name,
    authorRole: dbPost.author_role,
    published: dbPost.published,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
  };
}

// --- USER ACCESS ---
export async function getUsers(): Promise<User[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, name, role")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users from Supabase:", error);
      return [];
    }
    return (data || []) as User[];
  } catch (err) {
    console.error("getUsers failed:", err);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, name, role")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as User;
  } catch {
    return undefined;
  }
}

// --- BLOG ACCESS ---
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts from Supabase:", error);
      return [];
    }
    return (data || []).map(mapDbToPost);
  } catch (err) {
    console.error("getPosts failed:", err);
    return [];
  }
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapDbToPost(data);
  } catch {
    return undefined;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapDbToPost(data);
  } catch {
    return undefined;
  }
}

export async function createPost(post: BlogPost): Promise<void> {
  const supabase = await createClient();
  const dbData = mapPostToDb(post);
  const { error } = await supabase.from("posts").insert(dbData);
  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePost(post: BlogPost): Promise<void> {
  const supabase = await createClient();
  const dbData = mapPostToDb(post);
  const { error } = await supabase.from("posts").update(dbData).eq("id", post.id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}
