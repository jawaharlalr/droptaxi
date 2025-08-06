import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Mail,
  ShieldCheck,
  FileText,
  AlertTriangle,
  UserCheck,
  CarFront,
  CheckCircle2,
  ArrowUp,
  Home,
} from 'lucide-react';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-12 text-white bg-black">
      {/* Page Header with Home Button */}
      <div className="flex justify-between w-full max-w-5xl mb-6">
        <h2 className="flex items-center gap-2 text-3xl font-bold text-yellow-300">
          <ShieldCheck className="w-7 h-7" />
          Terms and Conditions
        </h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-black transition bg-yellow-400 rounded hover:bg-yellow-300"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>

      <section className="w-full max-w-5xl p-6 shadow-lg md:p-12 bg-black/80 rounded-2xl">
        <div className="space-y-8 text-base leading-relaxed text-white/80">
          {/* 1 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              1. Service Scope
            </h3>
            <p>
              Pranav Drop Taxi offers intercity travel services across Tamil Nadu and neighboring states. We connect passengers with reliable drivers for safe and convenient transportation.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
              2. Booking & Confirmation
            </h3>
            <p>
              All bookings must be made via our website or customer support. Bookings are confirmed based on availability. We reserve the right to cancel or modify bookings in rare cases.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <CarFront className="w-5 h-5 mr-2 text-yellow-400" />
              3. Pricing & Payments
            </h3>
            <p>
              Fares are based on distance, vehicle type, and trip type. Tolls, parking, or waiting time may incur additional charges. Payments must be made in full before or at the start or before end of the journey.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              4. Cancellations
            </h3>
            <p>Cancel free up to 2 days before pickup. Late cancellations may incur a fee.</p>
          </div>

          {/* 5 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <UserCheck className="w-5 h-5 mr-2 text-purple-400" />
              5. Passenger Responsibilities
            </h3>
            <p>
              Passengers must provide accurate information. Any damage to the vehicle caused by the passenger will be chargeable. Misconduct, illegal behavior, or intoxication will not be tolerated.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <UserCheck className="w-5 h-5 mr-2 text-purple-400" />
              6. Driver Conduct
            </h3>
            <p>
              Our drivers follow professional standards. Any issues can be reported to our support team for prompt resolution.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              7. Liability
            </h3>
            <p>
              We are not liable for delays caused by traffic, weather, or force majeure events. Please ensure your belongings are safe during travel.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <ShieldCheck className="w-5 h-5 mr-2 text-blue-400" />
              8. Privacy
            </h3>
            <p>
              Your data is handled securely and used only to improve services. We do not share your data without consent.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              9. Modifications
            </h3>
            <p>
              We may update these terms at any time. Continued use of our services implies acceptance of the changes.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h3 className="flex items-center mb-2 text-lg font-semibold text-yellow-200">
              <Mail className="w-5 h-5 mr-2 text-green-400" />
              10. Contact Us
            </h3>

            <p className="flex items-center mb-2">
              <PhoneCall className="w-4 h-4 mr-2 text-yellow-300" />
              <strong className="mr-1">Phone:</strong>
              <a
                href="tel:+919884609789"
                className="text-white transition-colors hover:text-yellow-400"
              >
                +91 9884609789
              </a>
            </p>

            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-yellow-300" />
              <strong className="mr-1">Email:</strong>
              <a
                href="mailto:droptaxipranav@gmail.com"
                className="text-white transition-colors hover:text-yellow-400"
              >
                droptaxipranav@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Back to Top Button at Bottom */}
        <div className="flex justify-center mt-10">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-black transition bg-yellow-400 rounded-full hover:bg-yellow-300"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      </section>
    </main>
  );
}
