import axios from 'axios';
import CAR_CATALOG from '../data/carData';

// Legacy local asset imports (for backwards-compatibility with old DB rows)
import teslaImg from "../assets/tesla_front.png";
import mercedesImg from "../assets/mercedes_front.png";
import audiImg from "../assets/audi_front.png";
import bmwImg from "../assets/bmw.png";
import suvImg from "../assets/suv.png";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// ── Legacy map (old DB rows used short keys like "tesla") ──────────────────
const LEGACY_ASSETS = {
    tesla:    teslaImg,
    mercedes: mercedesImg,
    audi:     audiImg,
    bmw:      bmwImg,
    suv:      suvImg,
};

// ── CAR_ASSETS: built from CAR_CATALOG for backward-compat usage in AddCar ─
export const CAR_ASSETS = CAR_CATALOG.map(car => ({
    name:  car.name,
    key:   car.id,
    image: car.image,
    car,              // full car object attached for rich UI
}));

/**
 * Resolve a stored image key (DB `image` column) → displayable URL.
 * Supports:
 *   1. Legacy short keys ("tesla", "mercedes", …)
 *   2. New catalog IDs ("tesla_model3", "audi_r8", …)
 *   3. Raw http/https URLs stored directly
 */
export const resolveCarImage = (imageKey) => {
    if (!imageKey) return null;
    // Raw URL
    if (imageKey.startsWith('http')) return imageKey;
    // Legacy short key
    if (LEGACY_ASSETS[imageKey]) return LEGACY_ASSETS[imageKey];
    // Catalog ID
    const entry = CAR_CATALOG.find(c => c.id === imageKey);
    return entry ? entry.image : null;
};

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Cars
export const getCars = async () => {
    try {
        const res = await axios.get(`${API_URL}/cars`);
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getMyCars = async () => {
    try {
        const res = await axios.get(`${API_URL}/cars/my-cars`, authHeader());
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const addCar = async (carData) => {
    try {
        const res = await axios.post(`${API_URL}/cars/add`, carData, authHeader());
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to add car' };
    }
};

export const updateCar = async (id, carData) => {
    try {
        const res = await axios.put(`${API_URL}/cars/edit/${id}`, carData, authHeader());
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to update car' };
    }
};

export const deleteCar = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/cars/delete/${id}`, authHeader());
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to delete car' };
    }
};

// Bookings
export const rentCar = async (bookingData) => {
    try {
        const res = await axios.post(`${API_URL}/bookings/rent`, bookingData, authHeader());
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Booking failed' };
    }
};

export const getAgencyBookings = async () => {
    try {
        const res = await axios.get(`${API_URL}/bookings/agency`, authHeader());
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getMyBookings = async () => {
    try {
        const res = await axios.get(`${API_URL}/bookings/my-bookings`, authHeader());
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};
