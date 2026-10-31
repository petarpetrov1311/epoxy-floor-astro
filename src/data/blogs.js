// Compatibility data for the original server-rendered Blogs component.
// The Markdown collection remains the single source of published articles.
import { publishedBlogEntries } from '../lib/blog-content.mjs';
export const blogPosts = publishedBlogEntries.map(entry => ({
  slug: entry.data.slug,
  url: entry.url,
  title: entry.data.title,
  category: entry.category,
  readTime: entry.readTime,
  image: entry.image?.src,
  excerpt: entry.data.description,
}));
