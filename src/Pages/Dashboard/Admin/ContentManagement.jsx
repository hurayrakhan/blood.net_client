import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';
import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { AuthContext } from '../../../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';

const ContentManagement = () => {
  const { userRole } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const limit = 5;
  const imageHostKey = import.meta.env.VITE_IMAGEBB_API_KEY;

  const { data: blogData = { blogs: [], total: 0 }, isLoading, refetch } = useQuery({
    queryKey: ['adminBlogs', search, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/blogs?search=${search}&page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(blogData.total / limit);

  const handleAddBlog = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
          method: 'POST',
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        imageUrl = imgbbData?.data?.display_url;
      }

      const res = await axiosSecure.post('/blogs', {
        ...newBlog,
        image: imageUrl,
      });

      if (res.data.insertedId) {
        Swal.fire('Success', 'Blog added successfully', 'success');
        setNewBlog({ title: '', content: '' });
        setImageFile(null);
        setIsModalOpen(false);
        refetch();
      }
    } catch (err) {
      Swal.fire('Error', 'Could not add blog', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the blog.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/blogs/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
          refetch();
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    }
  };

  // --- NEW: Handle Edit Form Submit ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      let imageUrl = editingBlog.image || '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
          method: 'POST',
          body: formData,
        });

        const imgbbData = await imgbbRes.json();
        imageUrl = imgbbData?.data?.display_url;
      }

      const res = await axiosSecure.put(`/blogs/${editingBlog._id}`, {
        title: editingBlog.title,
        content: editingBlog.content,
        image: imageUrl,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire('Success', 'Blog updated successfully', 'success');
        setEditModalOpen(false);
        setEditingBlog(null);
        setImageFile(null);
        refetch();
      }
    } catch (err) {
      Swal.fire('Error', 'Could not update blog', 'error');
    } finally {
      setUploading(false);
    }
  };

  // --- NEW: Handle input changes for editing ---
  const handleEditChange = (field, value) => {
    setEditingBlog({ ...editingBlog, [field]: value });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      <Helmet>
        <title>Blood.net | Content Management</title>
        <meta name="description" content="Manage blogs and other content on Blood.net." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#E63946] border-b pb-2">
          Manage Blog Content
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#E63946] text-white px-4 py-2 rounded hover:bg-[#A4161A]"
        >
          <FaPlus /> Add Blog
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-sm"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-[#E63946] py-6">Loading blogs...</p>
      ) : blogData.blogs.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No blogs found.</p>
      ) : (
        <div className="space-y-4">
          {blogData.blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
            >
              {blog.image && (
                <img src={blog.image} alt="blog" className="w-full h-48 object-cover rounded mb-3" />
              )}
              <h3 className="text-lg font-semibold text-[#1D1D1D]">
                {(page - 1) * limit + index + 1}. {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.content}</p>

              <div className="mt-3 flex gap-4 text-sm">
                {userRole === 'admin' && (
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingBlog(blog);
                    setEditModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded text-white font-medium ${page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Prev
            </button>
            <span className="flex items-center">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded text-white font-medium ${page === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#E63946]">
              Add New Blog
            </Dialog.Title>
            <form onSubmit={handleAddBlog} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <textarea
                placeholder="Content"
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="w-full border px-4 py-2 rounded h-32"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E63946] text-white rounded hover:bg-[#A4161A]"
                >
                  {uploading ? 'Uploading...' : 'Submit'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* --- Edit Blog Modal --- */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#E63946]">
              Edit Blog
            </Dialog.Title>
            {editingBlog && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={editingBlog.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <textarea
                  placeholder="Content"
                  value={editingBlog.content}
                  onChange={(e) => handleEditChange('content', e.target.value)}
                  className="w-full border px-4 py-2 rounded h-32"
                  required
                />
                <div>
                  <p className="mb-1 font-semibold">Current Image:</p>
                  {editingBlog.image ? (
                    <img src={editingBlog.image} alt="blog" className="w-full h-48 object-cover rounded mb-3" />
                  ) : (
                    <p className="italic text-gray-500">No image uploaded</p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalOpen(false);
                      setEditingBlog(null);
                      setImageFile(null);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E63946] text-white rounded hover:bg-[#A4161A]"
                    disabled={uploading}
                  >
                    {uploading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ContentManagement;
