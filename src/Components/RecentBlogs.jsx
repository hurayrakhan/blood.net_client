import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Fade } from 'react-awesome-reveal';
import axiosSecure from '../api/axiosSecure';

const RecentBlogs = () => {
  const navigate = useNavigate();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['recentBlogs'],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs?limit=3&page=1`); 
      // adjust backend to sort by createdAt for latest
      return res.data.blogs;
    },
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-10/12 mx-auto text-center">
        {/* Heading with Fade animation */}
        <Fade cascade>
          <h2 className="text-4xl font-bold text-[#E63946] mb-6">
            Recent Blogs
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Stay updated with our latest stories, insights, and tips from the community.
          </p>
        </Fade>

        {isLoading ? (
          <p className="text-center text-[#E63946]">Loading recent blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-gray-200 shadow-md hover:shadow-lg bg-white overflow-hidden cursor-pointer"
                onClick={() => navigate(`/blogs/${blog._id}`)}
              >
                <img
                  src={blog.image || 'https://via.placeholder.com/600x300?text=No+Image'}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#E63946]">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {blog.content}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blogs/${blog._id}`);
                    }}
                    className="mt-3 text-sm text-[#A4161A] hover:underline font-medium"
                  >
                    Read More →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* See All Blogs Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/blogs')}
            className="px-6 py-2 bg-[#E63946] hover:bg-[#A4161A] text-white rounded-lg shadow"
          >
            See All Blogs
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogs;
