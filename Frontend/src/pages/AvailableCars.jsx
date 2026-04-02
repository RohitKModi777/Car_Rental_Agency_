import { useState, useEffect } from "react";
import { getCars, rentCar, resolveCarImage } from "../services/carService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "../components/Toast";
import CAR_CATALOG, { FUEL_COLORS } from "../data/carData";

const SeatIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [bookingForms, setBookingForms] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
      const forms = {};
      data.forEach(car => { forms[car.id] = { startDate: "", days: "1" }; });
      setBookingForms(forms);
      setLoading(false);
    });
  }, []);

  const updateForm = (carId, field, value) =>
    setBookingForms(prev => ({ ...prev, [carId]: { ...prev[carId], [field]: value } }));

  const handleRent = async (car) => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "agency") { addToast("Agencies cannot book cars.", "error"); return; }
    const form = bookingForms[car.id];
    if (!form?.startDate) { addToast("Please select a start date.", "info"); return; }
    setLoadingId(car.id);
    const res = await rentCar({
      car_id: car.id,
      start_date: form.startDate,
      days: parseInt(form.days),
      total_rent: car.rent * parseInt(form.days),
    });
    setLoadingId(null);
    if (res.success) {
      addToast(`${car.model} booked for ${form.days} day(s)!`, "success");
      updateForm(car.id, "startDate", "");
      updateForm(car.id, "days", "1");
    } else {
      addToast(res.message || "Booking failed. Try again.", "error");
    }
  };

  const filtered = cars.filter(c =>
    c.model.toLowerCase().includes(search.toLowerCase()) ||
    c.number.toLowerCase().includes(search.toLowerCase()) ||
    c.agencyName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="spinner" />
        <p className="text-sm text-gray-500 font-medium">Loading fleet...</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="page-inner">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Available Cars</h1>
            <p className="section-sub">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} available
              {search && ` for "${search}"`}
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by model, plate, agency..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Guest banner */}
        {!user && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-indigo-700 font-medium">Sign in to book a car and see pricing details.</p>
            </div>
            <button onClick={() => navigate("/login")} className="btn-primary text-xs py-2 px-4 shrink-0">
              Sign In
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">No vehicles found{search ? ` for "${search}"` : ""}.</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-3 text-primary text-sm font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => {
              const form = bookingForms[car.id] || { startDate: "", days: "1" };
              const totalCost = car.rent * parseInt(form.days || 1);
              const imgSrc = resolveCarImage(car.image);
              // Enrich with catalog metadata if available
              const catalogEntry = CAR_CATALOG.find(c => c.id === car.image || c.name === car.model);

              return (
                <div key={car.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={car.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Plate badge */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                        {car.number}
                      </span>
                      {catalogEntry && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-sm ${FUEL_COLORS[catalogEntry.fuel] || 'bg-gray-100 text-gray-600'}` }>
                          {catalogEntry.fuel}
                        </span>
                      )}
                    </div>
                    {/* Available dot */}
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight">{car.model}</h3>
                        <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                          <span className="flex items-center gap-1">
                            <SeatIcon />
                            {car.capacity} seats
                          </span>
                          <span>·</span>
                          <span className="truncate max-w-[100px]">{car.agencyName}</span>
                        </div>
                        {catalogEntry && (
                          <p className="text-[11px] text-gray-400 mt-1 truncate">{catalogEntry.engine}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xl font-extrabold text-primary">₹{Number(car.rent).toLocaleString()}</div>
                        <div className="text-xs text-gray-400 font-medium">/ day</div>
                      </div>
                    </div>

                    {/* Feature pills from catalog */}
                    {catalogEntry && catalogEntry.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {catalogEntry.features.map(f => (
                          <span key={f} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-full text-[10px] font-semibold">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-50">
                      {user?.role === "customer" ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                              <input
                                type="date"
                                min={today}
                                value={form.startDate}
                                onChange={e => updateForm(car.id, "startDate", e.target.value)}
                                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Duration</label>
                              <select
                                value={form.days}
                                onChange={e => updateForm(car.id, "days", e.target.value)}
                                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(d => (
                                  <option key={d} value={d}>{d} {d === 1 ? "Day" : "Days"}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 px-0.5">
                            <span>Total</span>
                            <span className="font-extrabold text-primary text-sm">₹{totalCost.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => handleRent(car)}
                            disabled={loadingId === car.id}
                            className="w-full btn-primary py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loadingId === car.id ? (
                              <span className="flex items-center gap-2 justify-center">
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Booking...
                              </span>
                            ) : "Book Now"}
                          </button>
                        </div>
                      ) : user?.role === "agency" ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-xs font-semibold text-gray-400">Agency view only</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate("/login")}
                          className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all active:scale-95"
                        >
                          Sign In to Book
                        </button>
                      )}
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

export default AvailableCars;
