import { Mail, Phone, MapPin, LocateFixed, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      phone: form.phone,
      message: form.message,
      company: "Pranav Drop Taxi",
    };

    try {
      await emailjs.send(
        "service_8qzt88m",       // Replace with your actual EmailJS Service ID
        "template_v322l08",      // Replace with your actual Template ID
        templateParams,
        "vwfMkbQDSmOyqu0VG"      // Replace with your EmailJS Public Key
      );

      toast.success(
        <>
          Submitted successfully! <br /> We will contact you soon.
        </>,
        {
          duration: 4000,
          position: "top-right",
          icon: <CheckCircle2 className="text-green-500" />,
        }
      );

      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("EmailJS Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] text-white px-4 py-12">
      <Toaster />
      <h1 className="mb-1 text-sm font-semibold text-center text-yellow-400 uppercase">
        Contact Us
      </h1>
      <h2 className="mb-10 text-4xl font-bold text-center">Pranav Drop Taxi</h2>

      <div className="grid max-w-6xl gap-10 mx-auto md:grid-cols-2">
        {/* Contact Info + Map */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <p className="text-gray-300">
                28A, Karmel St, opposite V Cure Hospital,<br />
                Pallikaranai, Chennai, Tamil Nadu 600100
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-400" />
              <a href="tel:+919884609789" className="text-white hover:underline">
                +91 9884609789
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <a href="mailto:droptaxipravan@gmail.com" className="text-white hover:underline">
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

        {/* Enquiry Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 border shadow-lg bg-white/5 backdrop-blur-md rounded-2xl border-white/10"
        >
          <h3 className="text-2xl font-semibold text-white">Send an Enquiry</h3>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Name</label>
            <input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required
              className="w-full px-4 py-2 text-black rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Email</label>
            <input
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full px-4 py-2 text-black rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Phone</label>
            <input
              name="phone"
              placeholder="Your phone number"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              required
              className="w-full px-4 py-2 text-black rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Message</label>
            <textarea
              name="message"
              placeholder="Eg: From Chennai to Coimbatore on 27th July, 3 members"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2 text-black rounded-lg resize-none focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2 text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path
                  d="M4 12a8 8 0 018-8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
