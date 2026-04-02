import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "bg-violet-100 text-violet-600",
    title: "Instant Booking",
    desc: "Reserve your car in seconds. No paperwork, no waiting — just pick and go.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
      </svg>
    ),
    color: "bg-emerald-100 text-emerald-600",
    title: "Verified Agencies",
    desc: "Every agency on our platform is verified. Your safety is our priority.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-blue-100 text-blue-600",
    title: "Transparent Pricing",
    desc: "What you see is what you pay. No hidden fees, no surprises at pickup.",
  },
];

const steps = [
  { step: "01", title: "Browse Fleet", desc: "Explore available cars from verified agencies near you." },
  { step: "02", title: "Pick Your Dates", desc: "Choose your start date and rental duration." },
  { step: "03", title: "Confirm & Go", desc: "Book instantly and hit the road with confidence." },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-white/80 uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Premium Car Rental Platform
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Your Next Drive
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Starts Here
            </span>
          </h1>

          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Browse hundreds of vehicles from trusted agencies. Transparent pricing, instant booking, zero hassle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cars"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/30 text-sm"
            >
              Browse Available Cars
            </Link>
            {!user && (
              <Link
                to="/register-agency"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all active:scale-95 text-sm"
              >
                List Your Fleet
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md">
            {[
              { value: "500+", label: "Vehicles" },
              { value: "50+", label: "Agencies" },
              { value: "24/7", label: "Support" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{value}</div>
                <div className="text-xs text-white/50 font-medium mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">Everything you need for a smooth rental experience, in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-sm">Three simple steps to get on the road.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-extrabold text-primary">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/cars" className="btn-primary px-8 py-3 text-sm">
              Start Browsing
            </Link>
          </div>
        </div>
      </section>

      {/* CTA for agencies */}
      {!user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-indigo-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Own a Car Rental Agency?</h2>
            <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
              List your fleet, manage bookings, and grow your business on our platform.
            </p>
            <Link
              to="/register-agency"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-lg text-sm"
            >
              Partner With Us
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">CarRental</span>
        </div>
        <p className="text-gray-500 text-xs">&copy; 2026 CarRental. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
