import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const CreateEmp = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({ f_Name: '', f_Email: '', f_Mobile: '', f_Designation: 'HR', f_Gender: '', f_Course: '', f_Image: null });

  useEffect(() => {
    document.title = 'Create Employee';
    if (!isLoading && !isAuthenticated) navigate('/login');
  }, [isLoading, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const courses = prev.f_Course ? prev.f_Course.split(' / ') : [];
        checked ? courses.push(value) : courses.splice(courses.indexOf(value), 1);
        return { ...prev, f_Course: courses.join(' / ') };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      try {
        const imgForm = new FormData();
        imgForm.append('file', file);
        const imRes = await axios.post('https://filenow-production.up.railway.app/upload', imgForm);
        setFormData(prev => ({ ...prev, f_Image: imRes.data.file_url }));
      } catch {
        console.error('Error uploading image');
      }
    } else {
      e.target.value = null;
      alert('Only PNG or JPG images are allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('https://employees-production-712d.up.railway.app/add/employee', formData);
    navigate('/employees')
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-1 flex justify-center items-center p-6'>
        <form onSubmit={handleSubmit} className='w-full max-w-2xl space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <label htmlFor="name" className='w-1/4 font-semibold'>Name:</label>
              <input type='text' id="name" name="f_Name" value={formData.f_Name} onChange={handleInputChange} placeholder='Enter Name' className='flex-1 border-2 px-2 py-1 rounded-md' required />
            </div>
            <div className='flex items-center space-x-4'>
              <label htmlFor="email" className='w-1/4 font-semibold'>Email:</label>
              <input type='email' id="email" name="f_Email" value={formData.f_Email} onChange={handleInputChange} placeholder='Enter Email' className='flex-1 border-2 px-2 py-1 rounded-md' required />
            </div>
            <div className='flex items-center space-x-4'>
              <label htmlFor="mobile" className='w-1/4 font-semibold'>Mobile:</label>
              <input type='tel' id="mobile" name="f_Mobile" value={formData.f_Mobile} onChange={handleInputChange} placeholder='Enter Mobile' className='flex-1 border-2 px-2 py-1 rounded-md' required />
            </div>
            <div className='flex items-center space-x-4'>
              <label htmlFor="designation" className='w-1/4 font-semibold'>Designation:</label>
              <select id="designation" name="f_Designation" value={formData.f_Designation} onChange={handleInputChange} className="flex-1 border-2 px-2 py-1 rounded-md">
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='w-1/4 font-semibold'>Gender:</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="f_Gender" value="Male" checked={formData.f_Gender === 'Male'} onChange={handleInputChange} className="form-radio" />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="f_Gender" value="Female" checked={formData.f_Gender === 'Female'} onChange={handleInputChange} className="form-radio" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='w-1/4 font-semibold'>Course:</span>
              <div className="flex space-x-4">
                {['MCA', 'BCA', 'BSC'].map(course => (
                  <label key={course} className="inline-flex items-center">
                    <input type="checkbox" name="f_Course" value={course} checked={formData.f_Course.includes(course)} onChange={handleInputChange} className="form-checkbox" />
                    <span className="ml-2">{course}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <label htmlFor="image" className='w-1/4 font-semibold'>Image:</label>
              <input type='file' id="image" name="f_Image" accept="image/png, image/jpeg" onChange={handleImageUpload} className="flex-1" />
            </div>
          </div>
          <button type='submit' className='w-full rounded-md px-8 py-2 bg-green-600 text-white text-sm font-semibold hover:bg-green-700'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmp;