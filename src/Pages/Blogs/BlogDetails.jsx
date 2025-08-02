import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import axiosSecure from '../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blogDetails', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/${id}`);
      return res.data;
    },
  });

  const {
    data: relatedBlogs = [],
    isLoading: relatedLoading,
  } = useQuery({
    queryKey: ['relatedBlogs', blog?.title],
    enabled: !!blog?.title,
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs?search=${blog.title.split(' ')[0]}`);
      return res.data.blogs.filter((b) => b._id !== id).slice(0, 3);
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-[#E63946] font-medium py-20">
        Loading blog details...
      </div>
    );
  }

  if (!blog?._id) {
    return (
      <div className="text-center text-gray-500 font-medium py-20">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-10 py-10">

      <Helmet>
        <title>Blood.net | Blog Details</title>
        <meta name="description" content="Explore detailed insights and stories from our Blood.net blog." />
      </Helmet>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[#E63946] font-semibold hover:underline"
      >
        ← Back
      </button>

      <motion.img
        src={blog.image || 'https://via.placeholder.com/800x400?text=No+Image'}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-xl shadow"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <h1 className="text-3xl md:text-4xl font-bold text-[#E63946] mt-8 mb-4 text-center">
        {blog.title}
      </h1>

      <p className="text-gray-700 leading-relaxed text-justify mb-10">{blog.content}</p>

      {/* Related Blogs */}
      <div>
        <h3 className="text-2xl font-semibold text-[#E63946] mb-4">Related Blogs</h3>
        {relatedLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : relatedBlogs.length === 0 ? (
          <p className="text-gray-500">No related blogs found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {relatedBlogs.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.03 }}
                className="border rounded-lg shadow p-4 cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/blogs/${item._id}`)}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/300x200'}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h4 className="font-semibold text-[#A4161A] text-lg mb-1">
                  {item.title.length > 40 ? item.title.slice(0, 40) + '...' : item.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
