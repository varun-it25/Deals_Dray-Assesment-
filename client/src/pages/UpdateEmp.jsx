import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import useAuth from '../hooks/useAuth';

function UpdateEmp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState({ f_Name: '', f_Email: '', f_Mobile: '', f_Designation: 'HR', f_Gender: '', f_Course: '', f_Image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const res = await axios.get(`https://employees-production-712d.up.railway.app/employee/${id}`);
        setFormData(res.data);
      } catch (err) {
        setError('Failed to fetch employee data. Please try again.');
        console.error('Error fetching employee data:', err);
      }
    };

    if (id) fetchEmployeeData();
  }, [isLoading, isAuthenticated, navigate, id]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkboxInput = e.target;
      setFormData(prev => {
        const courses = prev.f_Course ? prev.f_Course.split(' / ') : [];
        if (checkboxInput.checked) {
          if (!courses.includes(value)) {
            courses.push(value);
          }
        } else {
          const index = courses.indexOf(value);
          if (index > -1) {
            courses.splice(index, 1);
          }
        }
        return { ...prev, f_Course: courses.join(' / ') };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
      const imgForm = new FormData();
      imgForm.append('file', file);
      try {
        const { data } = await axios.post('https://filenow-production.up.railway.app/upload', imgForm);
        setFormData(prev => ({ ...prev, f_Image: data.file_url }));
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        console.error('Error uploading image:', err);
      }
    } else {
      e.target.value = '';
      setError('Only PNG or JPG images are allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = {
      f_Name: formData.f_Name,
      f_Email: formData.f_Email,
      f_Mobile: formData.f_Mobile,
      f_Designation: formData.f_Designation,
      f_Gender: formData.f_Gender,
      f_Course: formData.f_Course,
      f_Image: formData.f_Image
    };

    try {
      await axios.put(`https://employees-production-712d.up.railway.app/edit/employee/${id}`, data);
      navigate('/employees');
    } catch (err) {
      setError('Failed to update employee. Please try again.');
      console.error('Error updating employee:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Update Employee</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="f_Name" className="w-1/4 font-semibold">Name:</label>
              <input
                type="text"
                id="f_Name"
                name="f_Name"
                value={formData.f_Name}
                onChange={handleInputChange}
                className="flex-1 border-2 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="f_Email" className="w-1/4 font-semibold">Email:</label>
              <input
                type="email"
                id="f_Email"
                name="f_Email"
                value={formData.f_Email}
                onChange={handleInputChange}
                className="flex-1 border-2 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="f_Mobile" className="w-1/4 font-semibold">Mobile:</label>
              <input
                type="tel"
                id="f_Mobile"
                name="f_Mobile"
                value={formData.f_Mobile}
                onChange={handleInputChange}
                className="flex-1 border-2 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="f_Designation" className="w-1/4 font-semibold">Designation:</label>
              <select
                id="f_Designation"
                name="f_Designation"
                value={formData.f_Designation}
                onChange={handleInputChange}
                className="flex-1 border-2 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-1/4 font-semibold">Gender:</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="f_Gender"
                    value="Male"
                    checked={formData.f_Gender === 'Male'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="f_Gender"
                    value="Female"
                    checked={formData.f_Gender === 'Female'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="w-1/4 font-semibold">Course:</span>
              <div className="flex space-x-4">
                {['MCA', 'BCA', 'BSC'].map(course => (
                  <label key={course} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="f_Course"
                      value={course}
                      checked={formData.f_Course.includes(course)}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{course}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="f_Image" className="w-1/4 font-semibold">Image:</label>
              <input
                type="file"
                id="f_Image"
                name="f_Image"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="flex-1"
              />
            </div>
            {formData.f_Image && (
              <div className="flex items-center space-x-4">
                <span className="w-1/4 font-semibold">Current Image:</span>
                <img src={formData.f_Image} alt="Employee" className="w-20 h-20 object-cover rounded-full" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md px-8 py-2 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmp;