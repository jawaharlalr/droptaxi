import { Mail, Phone, MapPin, LocateFixed, ArrowUp, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Show back-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] text-white px-4 py-12">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-sm rounded-lg shadow transition"
      >
        <Home className="w-4 h-4" />
        Home
      </Link>

      <h1 className="mb-1 text-sm font-semibold text-center text-yellow-400 uppercase">
        Contact Us
      </h1>
      <h2 className="mb-10 text-4xl font-bold text-center">Pranav Drop Taxi</h2>

      <div className="grid max-w-5xl gap-10 mx-auto md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <p className="text-gray-300">
                28A, Karmel St, opposite V Cure Hospital,
                <br />
                Pallikaranai, Chennai, Tamil Nadu 600100
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-400" />
              <a
                href="tel:+919884609789"
                className="text-white hover:text-yellow-400"
              >
                +91 9884609789
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <a
                href="mailto:droptaxipravan@gmail.com"
                className="text-white hover:text-yellow-400"
              >
                droptaxipravan@gmail.com
              </a>
            </div>
          </div>

          <div className="overflow-hidden shadow-lg rounded-2xl">
            <iframe
              title="Pranav Drop Taxi Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.3162371084387!2d80.19787147595075!3d12.929278287378076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c3add581025%3A0x5afe35915936ea80!2s28A%2C%20Karmel%20St%2C%20opposite%20V%20Cure%20Hospital%2C%20Pallikaranai%2C%20Chennai%2C%20Tamil%20Nadu%20600100!5e0!3m2!1sen!2sin!4v1721902800000!5m2!1sen!2sin"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full border-0 h-80"
            ></iframe>
          </div>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=28A,+Karmel+St,+Pallikaranai,+Chennai,+Tamil+Nadu+600100"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
          >
            <LocateFixed className="w-4 h-4 mr-2" />
            Get Directions
          </a>
        </div>
      </div>

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed p-3 text-black transition bg-yellow-500 rounded-full shadow-lg bottom-6 right-6 hover:bg-yellow-600"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
