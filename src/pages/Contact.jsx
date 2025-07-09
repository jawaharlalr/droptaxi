import React from 'react';
import { FiMapPin, FiPhone, FiNavigation2 } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen px-4 py-10 text-black bg-white">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        {/* Company Name */}
        <h1 className="text-3xl font-bold">Pranav Drop Taxi</h1>

        {/* Address */}
        <div className="flex items-start justify-center gap-2 text-left text-gray-800">
          <FiMapPin className="mt-1 text-black" />
          <span>
            28A, Karmel St, opposite V Cure Hospital,<br />
            Pallikaranai, Chennai, Tamil Nadu 600100
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <FiPhone className="text-black" />
          <a href="tel:+919884609789" className="text-black hover:text-red-600">
            +91 9884609789
          </a>
        </div>

        {/* Map Preview */}
        <div className="overflow-hidden border rounded shadow-md aspect-video">
          <iframe
            title="Office Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3895.1872866385777!2d80.19788149999999!3d12.9292783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c3add581025%3A0x5afe35915936ea80!2s28A%2C%20Karmel%20St%2C%20opposite%20V%20Cure%20Hospital%2C%20Pallikaranai%2C%20Chennai%2C%20Tamil%20Nadu%20600100!5e0!3m2!1sen!2sin!4v1720537612457!5m2!1sen!2sin"
          ></iframe>
        </div>

        {/* Directions Button */}
        <div className="mt-4">
          <a
            href="https://www.google.com/maps/place/28A,+Karmel+St,+opposite+V+Cure+Hospital,+Pallikaranai,+Chennai,+Tamil+Nadu+600100"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-black rounded hover:bg-red-600"
          >
            <FiNavigation2 /> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
