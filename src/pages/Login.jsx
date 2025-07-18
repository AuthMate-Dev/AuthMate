import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PasswordInputField from '../components/PasswordInputField';
import { conf } from "@/conf/conf.js";

const InputField = ({ label, type, name, value, onChange, required, autoComplete }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
        </label>
        <div className="mt-2">
            <input
                id={name}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            />
        </div>
    </div>
);

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [authState, setAuthState] = useState({ message: '', error: '', loading: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (authState.error) {
            setAuthState((prev) => ({ ...prev, error: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthState({ message: '', error: '', loading: true });

        try {
            const { email, password } = formData;
            const url = `${conf.prodBaseUrl}/api/auth/jwt/create/`;
            const response = await axios.post(url, { email, password });
            const { access, refresh } = response.data;

            if (!access || !refresh) {
                throw new Error('Access or Refresh token is missing');
            }

            dispatch(login({ access, refresh }));
            setAuthState({ message: 'Login successful!', error: '', loading: false });
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err?.response?.data?.non_field_errors?.[0] || err?.message || 'An error occurred. Please try again.';
            setAuthState({ message: '', error: errorMsg, loading: false });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                {location.pathname === '/auth/login' && (
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </button>
                )}

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="AuthMate Logo"
                        src="/favicon.svg"
                        className="mx-auto h-16 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Log In to Your Account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                        <PasswordInputField
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            classNameInput="dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                        />

                        {authState.error && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {authState.error}
                            </p>
                        )}
                        {authState.message && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                {authState.message}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                disabled={authState.loading}
                            >
                                {authState.loading ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    'Log In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/users/reset_password/"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
