import { useState, useEffect } from "react";
import { getAgencyBookings } from "../services/carService";

const BookedCars = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAgencyBookings().then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = bookings.reduce((acc, b) => acc + parseFloat(b.total_rent), 0);

  const filtered = bookings.filter(b =>
    b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.carModel?.toLowerCase().includes(search.toLowerCase()) ||
    b.carNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner" />
        <p className="text-sm text-gray-500 font-medium">Loading bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Booking Dashboard</h1>
            <p className="section-sub">Track all customer rentals for your fleet</p>
          </div>
          {bookings.length > 0 && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Total Revenue</p>
              <p className="text-2xl font-extrabold text-primary">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">Once customers rent your vehicles, all booking details will appear here.</p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-4 relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customer, car..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-2.5 text-sm"
              />
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reg. No.</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">{b.customerName?.[0]?.toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{b.customerName}</p>
                              <p className="text-xs text-gray-400">{b.customerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-700">{b.carModel}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold border border-gray-200">
                            {b.carNumber}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-sm">
                          {new Date(b.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                            {b.days} {b.days === 1 ? "Day" : "Days"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="font-extrabold text-primary">₹{parseFloat(b.total_rent).toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">No results for "{search}"</div>
              )}
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filtered.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{b.customerName?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{b.customerName}</p>
                        <p className="text-xs text-gray-400">{b.customerEmail}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-primary">₹{parseFloat(b.total_rent).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 font-medium mb-0.5">Vehicle</p>
                      <p className="font-semibold text-gray-700">{b.carModel}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 font-medium mb-0.5">Reg. No.</p>
                      <p className="font-semibold text-gray-700">{b.carNumber}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 font-medium mb-0.5">Start Date</p>
                      <p className="font-semibold text-gray-700">
                        {new Date(b.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-gray-400 font-medium mb-0.5">Duration</p>
                      <p className="font-semibold text-gray-700">{b.days} {b.days === 1 ? "Day" : "Days"}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-400">No results for "{search}"</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookedCars;
