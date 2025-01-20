import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../Components/Navbar';
import Logo from '../assets/logo.png';

const Welcome = () => {
  const { isAuthenticated, isLoading, error, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-zinc-600 mb-4">{error || 'You are not authenticated. Please log in.'}</p>
        <Link to="/login"><button className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">Go to Login</button></Link>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <img src={Logo} className="w-24 h-24 rounded-full border flex-shrink-0" alt="DealsDray Logo" />
        <div className='w-[90%] flex flex-col justify-end items-center'>
          <h1 className="text-4xl font-bold mt-5 text-center">Welcome to DealsDray</h1>
          <p className="text-sm font-medium text-zinc-400 mt-3 text-center max-w-md">DealsDray helps you manage employees efficiently. Create, update, and delete employee records.</p>
        </div>
        <div className="mt-8 space-x-4 mb-8">
          <Link to="/employees"><button className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">Go to Employee List</button></Link>
          <button onClick={logout} className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;