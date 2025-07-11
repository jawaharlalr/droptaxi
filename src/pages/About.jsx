import React from 'react';

const About = () => {
  return (
    <div className="max-w-3xl p-6 mx-auto text-gray-800">
      <h1 className="mb-4 text-3xl font-bold text-center text-black">About Pranav Drop Taxi</h1>

      <p className="mb-4 leading-relaxed">
        At <strong>Pranav Drop Taxi</strong>, we specialize in offering one-way and round-trip taxi services that are both 
        affordable and dependable. Based in Tamil Nadu, our mission is to redefine long-distance travel by eliminating 
        return fare charges and delivering a truly customer-centric experience.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Why Choose Us?</h2>
      <ul className="space-y-2 list-disc list-inside">
        <li><strong>One-Way Drop Taxi:</strong> Pay only for the distance you travel – no return fare.</li>
        <li><strong>Transparent Pricing:</strong> No hidden charges. All fares are calculated clearly based on distance and vehicle type.</li>
        <li><strong>Professional Drivers:</strong> Our experienced drivers ensure a safe and pleasant ride every time.</li>
        <li><strong>Clean & Sanitized Vehicles:</strong> Hygiene is our top priority, with regular cleaning and maintenance.</li>
        <li><strong>Multiple Vehicle Options:</strong> Choose from Sedans, MUVs, and Innovas based on your comfort and group size.</li>
        <li><strong>24/7 Customer Support:</strong> We’re just a call or message away, anytime you need assistance.</li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Service Coverage</h2>
      <p className="leading-relaxed">
        We provide reliable taxi services across Tamil Nadu and to major cities like Chennai, Coimbatore, Madurai, 
        Trichy, and more. Whether it's an airport transfer, business trip, or family outing – we've got you covered.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Book with Confidence</h2>
      <p className="leading-relaxed">
        Booking with Pranav Drop Taxi is quick, secure, and simple. With just a few clicks, you can plan your trip and 
        get a confirmed ride. We also offer direct WhatsApp booking to make your experience even smoother.
      </p>

      <p className="mt-6 font-semibold text-center text-black">
        Experience the difference with Pranav Drop Taxi – Your journey, our priority.
      </p>
    </div>
  );
};

export default About;
