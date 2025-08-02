import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { Fade, Slide } from 'react-awesome-reveal';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function ContactSection() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_ua43ru7',
        'template_3poxd59',
        form.current,
        'Ul6q-W7l9ECokKJDv'
      )
      .then(
        () => {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: 'Message sent successfully!',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            color: '#E63946',
          });
          form.current.reset();
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#E63946',
          });
        }
      );
  };

  return (
    <motion.section
      className="bg-white text-gray-800 px-4 sm:px-6 lg:px-20 py-16 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#E63946] mb-2">
          Get in Touch
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 border border-[#E63946] rounded-xl">
        {/* Contact Info */}
        <Fade direction="left" triggerOnce>
          <div className="bg-[#FFDADA] flex flex-col justify-center h-full rounded-l-xl  px-8 shadow-md space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#E63946]">Contact Information</h3>

            <div className="flex items-start gap-3 text-gray-700">
              <MapPinIcon className="h-6 w-6 text-[#E63946]" />
              <span>123 Blood Street, Khulna, Bangladesh</span>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <PhoneIcon className="h-6 w-6 text-[#E63946]" />
              <span>+880 1601-770023</span>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <EnvelopeIcon className="h-6 w-6 text-[#E63946]" />
              <span>imhurayrakhan@gmail.com</span>
            </div>
          </div>
        </Fade>

        {/* Contact Form */}
        <Slide direction="right" triggerOnce>
          <form
            ref={form}
            onSubmit={sendEmail}
            className="bg-white p-8 rounded-r-xl shadow-md space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-[#E63946] mb-1">Name</label>
              <input
                type="text"
                name="user_name"
                placeholder="Your name"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-[#E63946] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#E63946] mb-1">Email</label>
              <input
                type="email"
                name="user_email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-[#E63946] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#E63946] mb-1">Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Type your message..."
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-[#E63946] focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#E63946] text-white w-full py-2 rounded hover:bg-red-600 transition text-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </Slide>
      </div>
    </motion.section>
  );
}
