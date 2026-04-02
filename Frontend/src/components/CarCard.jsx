import { resolveCarImage } from "../services/carService";

/**
 * Reusable car card component.
 * Props: car, children (slot for booking form / action area)
 */
const CarCard = ({ car, children }) => {
  const imgSrc = resolveCarImage(car.image);

  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col">
      <div className="h-56 relative overflow-hidden bg-slate-100">
        {imgSrc ? (
          <img src={imgSrc} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Image</div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest">
            {car.number}
          </span>
        </div>
        <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          Available Now
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 leading-tight">{car.model}</h3>
            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {car.capacity} Seats
              </span>
              <span className="text-slate-200">|</span>
              <span className="text-slate-400 text-[10px]">by {car.agencyName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary">₹{car.rent}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">per day</div>
          </div>
        </div>

        <div className="mt-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
