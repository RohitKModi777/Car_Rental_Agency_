import { useState } from "react";
import { updateCar, CAR_ASSETS } from "../services/carService";

const EditCarModal = ({ car, onClose, onUpdated, addToast }) => {
  const assetIndex = CAR_ASSETS.findIndex(a => a.name === car.model);
  const [form, setForm] = useState({
    model: car.model, image: car.image, number: car.number,
    capacity: car.capacity, rent: car.rent,
    assetIndex: assetIndex >= 0 ? assetIndex : 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "assetIndex") {
      const asset = CAR_ASSETS[e.target.value];
      setForm({ ...form, assetIndex: e.target.value, model: asset.name, image: asset.key });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateCar(car.id, {
      model: form.model, number: form.number,
      capacity: parseInt(form.capacity), rent: parseFloat(form.rent), image: form.image,
    });
    setLoading(false);
    if (res.success) { addToast("Car updated successfully!", "success"); onUpdated(); onClose(); }
    else { addToast(res.message || "Update failed.", "error"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 text-lg">Edit Vehicle</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Model</label>
            <select name="assetIndex" value={form.assetIndex} onChange={handleChange} className="input-field">
              {CAR_ASSETS.map((asset, i) => (
                <option key={i} value={i}>{asset.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reg. Number</label>
              <input name="number" value={form.number} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Seats</label>
              <input name="capacity" type="number" min="1" max="20" value={form.capacity} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent Per Day (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input name="rent" type="number" min="1" value={form.rent} onChange={handleChange} className="input-field pl-8" required />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 btn-outline py-2.5 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;
