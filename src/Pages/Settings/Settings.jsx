import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';

const Settings = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      Swal.fire('Error', 'New password and confirm password do not match.', 'error');
      return;
    }

    setSaving(true);

    try {
      // Simulate API call — replace with actual API request
      await new Promise((res) => setTimeout(res, 1000));

      Swal.fire('Success', 'Settings saved successfully!', 'success');
      // Reset password fields
      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      Swal.fire('Error', 'Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-lg shadow-md">

      <Helmet>
        <title>Blood.net | Settings</title>
        <meta name="description" content="Manage your Blood.net account settings including profile, security, and notification preferences." />
      </Helmet>

      <h2 className="text-2xl font-bold mb-6 text-[#E63946]">Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border px-4 py-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border px-4 py-2 rounded w-full"
              required
            />
          </div>
        </div>

        {/* Password Change */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="border px-4 py-2 rounded w-full"
            />
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="border px-4 py-2 rounded w-full"
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="border px-4 py-2 rounded w-full"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="notifications" className="text-gray-700">
            Enable email notifications
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded text-white font-semibold ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E63946] hover:bg-[#A4161A]'
            }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
