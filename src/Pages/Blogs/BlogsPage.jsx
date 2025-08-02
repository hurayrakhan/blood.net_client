import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosSecure from '../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

const BlogsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data: blogData = { blogs: [], total: 0 },
    isLoading,
  } = useQuery({
    queryKey: ['publicBlogs', search, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/blogs?search=${search}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(blogData.total / limit);

  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      <Helmet>
        <title>Blood.net | Blogs</title>
        <meta name="description" content="Read insightful blogs about blood donation, health tips, and community stories on Blood.net." />
      </Helmet>

      <h2 className="text-3xl font-bold text-center text-[#E63946] mb-10">Blogs</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-[#E63946] py-6">Loading blogs...</p>
      ) : blogData.blogs.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.blogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-gray-200 shadow-md hover:shadow-lg bg-white overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              <img
                src={blog.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                alt={blog.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#E63946]">{blog.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
                <button className="mt-3 text-sm text-[#A4161A] hover:underline font-medium">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end gap-3 pt-6">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded text-white bg-[#E63946] hover:bg-[#A4161A] disabled:bg-gray-300"
        >
          Prev
        </button>
        <span className="flex items-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded text-white bg-[#E63946] hover:bg-[#A4161A] disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogsPage;
