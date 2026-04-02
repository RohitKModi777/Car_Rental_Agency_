import { useState, useEffect } from "react";
import { getMyBookings, resolveCarImage } from "../services/carService";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const totalSpent = bookings.reduce((acc, b) => acc + parseFloat(b.total_rent), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner" />
        <p className="text-sm text-gray-500 font-medium">Loading your bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">My Bookings</h1>
            <p className="section-sub">Your rental history</p>
          </div>
          {bookings.length > 0 && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Total Spent</p>
              <p className="text-2xl font-extrabold text-primary">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">{bookings.length} rental{bookings.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-500 mb-5">Browse available cars and make your first booking.</p>
            <Link to="/cars" className="btn-primary text-sm px-6 py-2.5">
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map(b => {
              const imgSrc = resolveCarImage(b.carImage);
              const endDate = new Date(b.start_date);
              endDate.setDate(endDate.getDate() + b.days);

              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  {/* Car image */}
                  <div className="h-40 bg-gray-100 overflow-hidden relative">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={b.carModel}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Booking ID badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                        #{b.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Car info */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{b.carModel}</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{b.carNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-primary">₹{parseFloat(b.total_rent).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Start Date</p>
                        <p className="font-semibold text-gray-700">
                          {new Date(b.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-1">Duration</p>
                        <p className="font-semibold text-gray-700">{b.days} {b.days === 1 ? "Day" : "Days"}</p>
                      </div>
                    </div>

                    {/* Agency */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                      <span className="font-medium">{b.agencyName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
