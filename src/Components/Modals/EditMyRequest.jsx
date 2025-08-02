import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Swal from 'sweetalert2';
import axiosSecure from '../../api/axiosSecure';

export default function EditDonationModal({ isOpen, setIsOpen, donation, refetch }) {
  const [formData, setFormData] = useState({
    district: donation?.district || '',
    upazila: donation?.upazila || '',
    bloodGroup: donation?.bloodGroup || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.patch(`/donations/${donation._id}`, formData);
      Swal.fire('Success', 'Donation updated successfully!', 'success');
      refetch(); // Refresh data
      setIsOpen(false);
    } catch (error) {
      Swal.fire('Error', 'Failed to update donation', 'error');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
              <Dialog.Title className="text-xl font-semibold text-[#E63946] mb-4">
                Edit Donation Request
              </Dialog.Title>

              <div className="space-y-4">
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="District"
                />
                <input
                  type="text"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  placeholder="Upazila"
                />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <button
                  onClick={handleUpdate}
                  className="w-full bg-[#E63946] text-white py-2 rounded hover:bg-[#A4161A]"
                >
                  Update Request
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
