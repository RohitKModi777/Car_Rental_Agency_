import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addCar, getMyCars, deleteCar, resolveCarImage } from "../services/carService";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, useToast } from "../components/Toast";
import EditCarModal from "../components/EditCarModal";
import CAR_CATALOG, { CATEGORIES, FUEL_COLORS } from "../data/carData";

// ── Small icon helpers ────────────────────────────────────────────────────────
const Icon = ({ path, className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const PLUS     = "M12 4v16m8-8H4";
const EDIT     = "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
const TRASH    = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
const BOOK     = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2";
const SPEED    = "M13 10V3L4 14h7v7l9-11h-7z";
const SEAT     = "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z";
const CHECK    = "M5 13l4 4L19 7";
const SEARCH   = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
const CLOSE    = "M6 18L18 6M6 6l12 12";
const ENGINE   = "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18";

// ── Car Picker Modal ──────────────────────────────────────────────────────────
const CarPickerModal = ({ onSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const filtered = CAR_CATALOG.filter(car => {
    const matchCat = activeCategory === "all" || car.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || car.name.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Choose a Vehicle Model</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} models available</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Icon path={SEARCH} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search brand or model…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-56"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Icon path={CLOSE} className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
              <Icon path={CLOSE} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-100 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Car grid */}
        <div className="overflow-y-auto flex-1 p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon path={SEARCH} className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No models found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(car => (
                <button
                  key={car.id}
                  onClick={() => onSelect(car)}
                  onMouseEnter={() => setHovered(car.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="text-left bg-gray-50 hover:bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg rounded-2xl overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${FUEL_COLORS[car.fuel] || "bg-gray-100 text-gray-600"}`}>
                        {car.fuel}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-bold text-gray-700 capitalize">
                        {car.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <p className="font-bold text-gray-900 text-sm leading-tight">{car.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{car.brand} · {car.year}</p>

                    <div className="flex gap-3 mt-2.5">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Icon path={SEAT} className="w-3 h-3" />
                        {car.seats} seats
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Icon path={SPEED} className="w-3 h-3" />
                        {car.topSpeed} km/h
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {car.features.slice(0, 3).map(f => (
                        <span key={f} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AddCar = () => {
  const { user } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [form, setForm] = useState({ number: "", capacity: "", rent: "" });
  const [loading, setLoading] = useState(false);
  const [myCars, setMyCars] = useState([]);
  const [editCar, setEditCar] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchMyCars = async () => {
    const data = await getMyCars();
    setMyCars(data);
  };

  useEffect(() => { fetchMyCars(); }, []);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setForm(prev => ({ ...prev, capacity: String(car.seats) }));
    setShowPicker(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar) { addToast("Please choose a vehicle model first.", "info"); return; }
    setLoading(true);
    const res = await addCar({
      model:    selectedCar.name,
      image:    selectedCar.image,   // store URL directly
      number:   form.number,
      capacity: parseInt(form.capacity),
      rent:     parseFloat(form.rent),
    });
    setLoading(false);
    if (res.success) {
      addToast("Vehicle listed successfully!", "success");
      setSelectedCar(null);
      setForm({ number: "", capacity: "", rent: "" });
      fetchMyCars();
    } else {
      addToast(res.message || "Failed to add car.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this vehicle from your fleet?")) return;
    const res = await deleteCar(id);
    if (res.success) {
      addToast("Vehicle removed.", "success");
      fetchMyCars();
    } else {
      addToast(res.message || "Delete failed.", "error");
    }
  };

  return (
    <div className="page-wrapper">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {showPicker && (
        <CarPickerModal onSelect={handleSelectCar} onClose={() => setShowPicker(false)} />
      )}

      {editCar && (
        <EditCarModal
          car={editCar}
          onClose={() => setEditCar(null)}
          onUpdated={fetchMyCars}
          addToast={addToast}
        />
      )}

      <div className="page-inner">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Fleet Management</h1>
            <p className="section-sub">Add and manage your rental vehicles</p>
          </div>
          <Link to="/bookings" className="btn-outline text-sm gap-2 self-start sm:self-auto">
            <Icon path={BOOK} />
            View Bookings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Add Car Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon path={PLUS} className="w-3.5 h-3.5 text-primary" />
                </div>
                Add New Vehicle
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Car picker trigger */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Model</label>
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                      selectedCar
                        ? "border-primary/40 bg-primary/5 text-gray-900"
                        : "border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    {selectedCar ? (
                      <div className="flex items-center justify-between">
                        <span>{selectedCar.name}</span>
                        <span className="text-xs text-gray-400">{selectedCar.brand} · {selectedCar.year}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Icon path={SEARCH} className="w-4 h-4 shrink-0" />
                        Browse & select from {CAR_CATALOG.length} models…
                      </div>
                    )}
                  </button>
                </div>

                {/* Preview card — shows once a car is selected */}
                {selectedCar && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={selectedCar.image}
                        alt={selectedCar.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Overlayed badges */}
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${FUEL_COLORS[selectedCar.fuel] || "bg-gray-100 text-gray-600"}`}>
                          {selectedCar.fuel}
                        </span>
                        <span className="px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-bold text-gray-700 capitalize">
                          {selectedCar.category}
                        </span>
                      </div>
                      {/* Car name bottom-left */}
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-white font-bold text-sm">{selectedCar.name}</p>
                        <p className="text-white/70 text-[11px] mt-0.5">{selectedCar.engine}</p>
                      </div>
                      {/* Change button */}
                      <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 hover:bg-white rounded-lg text-[10px] font-bold text-gray-700 transition-all shadow-sm"
                      >
                        Change
                      </button>
                    </div>

                    {/* Specs row */}
                    <div className="bg-gray-50 grid grid-cols-3 divide-x divide-gray-100 text-center py-2">
                      <div className="px-2">
                        <p className="text-[10px] text-gray-400 font-medium">Seats</p>
                        <p className="text-xs font-bold text-gray-900">{selectedCar.seats}</p>
                      </div>
                      <div className="px-2">
                        <p className="text-[10px] text-gray-400 font-medium">Top Speed</p>
                        <p className="text-xs font-bold text-gray-900">{selectedCar.topSpeed} km/h</p>
                      </div>
                      <div className="px-2">
                        <p className="text-[10px] text-gray-400 font-medium">Drive</p>
                        <p className="text-xs font-bold text-gray-900">{selectedCar.transmission}</p>
                      </div>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 px-3 py-2.5 bg-white border-t border-gray-100">
                      {selectedCar.features.map(f => (
                        <span key={f} className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Icon path={CHECK} className="w-2.5 h-2.5" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reg, Seats, Rent */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Reg. Number</label>
                    <input
                      name="number"
                      value={form.number}
                      placeholder="KA-01-XX-1234"
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Seats</label>
                    <input
                      name="capacity"
                      type="number"
                      min="1"
                      max="20"
                      value={form.capacity}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent Per Day (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                    <input
                      name="rent"
                      type="number"
                      min="1"
                      value={form.rent}
                      placeholder="2500"
                      onChange={handleChange}
                      className="input-field pl-8"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedCar}
                  className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Adding…
                    </span>
                  ) : "List Vehicle"}
                </button>
              </form>
            </div>
          </div>

          {/* ── Fleet List ── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                My Fleet
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                  {myCars.length}
                </span>
              </h2>
            </div>

            {myCars.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon path={PLUS} className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No vehicles listed yet.</p>
                <p className="text-xs text-gray-400 mt-1">Add your first car using the form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myCars.map(car => {
                  const imgSrc = resolveCarImage(car.image);
                  // Try to find catalog entry for extra details
                  const catalogEntry = CAR_CATALOG.find(c => c.id === car.image || c.name === car.model);
                  return (
                    <div key={car.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={car.model}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{car.model}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{car.number}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-xs text-gray-500">{car.capacity} seats</span>
                          {catalogEntry && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${FUEL_COLORS[catalogEntry.fuel] || "bg-gray-100 text-gray-600"}`}>
                              {catalogEntry.fuel}
                            </span>
                          )}
                          <span className="text-xs font-bold text-primary">₹{Number(car.rent).toLocaleString()}/day</span>
                        </div>
                        {catalogEntry && (
                          <p className="text-[11px] text-gray-400 mt-1 truncate">{catalogEntry.engine}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditCar(car)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Icon path={EDIT} />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Icon path={TRASH} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
