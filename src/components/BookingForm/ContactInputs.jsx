import React from 'react';

const ContactInputs = ({ name, phone, setName, setPhone }) => {
  // Handle name: allow only letters and spaces
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  // Handle phone: only 10 digits allowed, no characters
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Name Input */}
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={handleNameChange}
          required
          className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded"
        />
      </div>

      {/* Phone Input */}
      <div className="flex items-center">
        <span className="px-3 py-3 text-white bg-gray-700 border border-gray-600 rounded-l">+91</span>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          required
          pattern="[0-9]{10}"
          className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-r"
        />
      </div>
    </div>
  );
};

export default ContactInputs;
