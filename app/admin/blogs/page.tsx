"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  Filter,
  PenSquare,
  Trash2,
  Eye,
  Globe,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "draft" | "published";
  tags: string[];
  views: number;
  createdAt: string;
  coverImage: string;
}

const CATEGORIES = [
  "all", "General", "Technology", "Travel", "Food",
  "Lifestyle", "Health", "Business", "Science", "Culture", "Other",
];

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState<"table" | "card">("table");
  const limit = 10;

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      });
      const res = await fetch(`/api/blogs?${params}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchBlogs(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function deleteBlog(id: string) {
    setDeleting(true);
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      setDeleteId(null);
      fetchBlogs();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  }

  async function toggleStatus(blog: Blog) {
    const newStatus = blog.status === "published" ? "draft" : "published";
    await fetch(`/api/blogs/${blog._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchBlogs();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-page">
      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon-wrap">
              <AlertTriangle size={28} className="modal-icon-danger" />
            </div>
            <h3 className="modal-title">Delete Blog?</h3>
            <p className="modal-desc">
              This action cannot be undone. The blog post will be permanently deleted.
            </p>
            <div className="modal-actions">
              <button
                className="btn-ghost"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => deleteBlog(deleteId)}
                disabled={deleting}
              >
                {deleting ? <span className="btn-spinner" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BookOpen size={22} className="page-title-icon" /> Manage Blogs
          </h1>
          <p className="page-subtitle">{total} blog post{total !== 1 ? "s" : ""} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost-sm" onClick={fetchBlogs} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <Link href="/admin/create" className="btn-primary">
            <PenSquare size={15} /> New Blog
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-search">
          <Search size={15} className="filter-search-icon" />
          <input
            className="filter-search-input"
            placeholder="Search by title, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-select-wrap">
            <Filter size={14} />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
            ))}
          </select>

          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === "table" ? "view-active" : ""}`}
              onClick={() => setView("table")}
              title="Table view"
            >
              ☰
            </button>
            <button
              className={`view-toggle-btn ${view === "card" ? "view-active" : ""}`}
              onClick={() => setView("card")}
              title="Card view"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="table-loading">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton-row-lg" />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="empty-icon" />
          <p className="empty-title">No blogs found</p>
          <p className="empty-desc">
            {search || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first blog post to get started"}
          </p>
          <Link href="/admin/create" className="btn-primary">
            <PenSquare size={14} /> Create Blog
          </Link>
        </div>
      ) : view === "table" ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Blog</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div className="table-blog-cell">
                      {blog.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={blog.coverImage} alt="" className="table-blog-thumb" />
                      )}
                      <div>
                        <p className="table-blog-title">{blog.title}</p>
                        <p className="table-blog-desc">
                          {blog.description?.slice(0, 60)}
                          {(blog.description?.length || 0) > 60 ? "..." : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td><span className="category-chip">{blog.category}</span></td>
                  <td>
                    <button
                      className={`status-badge status-${blog.status} status-clickable`}
                      onClick={() => toggleStatus(blog)}
                      title="Click to toggle status"
                    >
                      {blog.status === "published" ? <Globe size={11} /> : <FileText size={11} />}
                      {blog.status}
                    </button>
                  </td>
                  <td className="table-views"><Eye size={13} /> {blog.views}</td>
                  <td className="table-date">{format(new Date(blog.createdAt), "MMM d, yyyy")}</td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/blogs/${blog._id}/edit`} className="action-btn action-edit" title="Edit">
                        <PenSquare size={14} />
                      </Link>
                      <button className="action-btn action-delete" onClick={() => setDeleteId(blog._id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="blogs-card-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card-item">
              {blog.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.coverImage} alt={blog.title} className="blog-card-img" />
              ) : (
                <div className="blog-card-img-placeholder">
                  <BookOpen size={32} />
                </div>
              )}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="category-chip">{blog.category}</span>
                  <span className={`status-badge status-${blog.status}`}>{blog.status}</span>
                </div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-desc">
                  {blog.description?.slice(0, 80)}{(blog.description?.length || 0) > 80 ? "..." : ""}
                </p>
                <div className="blog-card-footer">
                  <span className="blog-card-date">
                    {format(new Date(blog.createdAt), "MMM d, yyyy")}
                  </span>
                  <div className="table-actions">
                    <Link href={`/admin/blogs/${blog._id}/edit`} className="action-btn action-edit">
                      <PenSquare size={13} />
                    </Link>
                    <button className="action-btn action-delete" onClick={() => setDeleteId(blog._id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`pagination-btn ${page === i + 1 ? "pagination-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
