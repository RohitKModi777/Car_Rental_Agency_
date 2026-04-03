import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth`;

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${API_URL}/register`, userData);
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
};

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
        }
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
};

export const googleLogin = async (accessToken) => {
    try {
        const res = await axios.post(`${API_URL}/google-login`, { access_token: accessToken });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));
        }
        return res.data;
    } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Google login failed' };
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
};
