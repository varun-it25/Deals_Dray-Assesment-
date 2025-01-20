import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar'

const useAuth = () => {
  return { isAuthenticated: true, isLoading: false };
};

const CreateEmp = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: 'HR',
    f_Gender: '',
    f_Course: [],
    f_Image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Create Employee';
    if (!isLoading && !isAuthenticated) navigate('/login');
  }, [isLoading, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const courses = [...prev.f_Course];
        if (checked) {
          courses.push(value);
        } else {
          const index = courses.indexOf(value);
          if (index > -1) courses.splice(index, 1);
        }
        return { ...prev, f_Course: courses };
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
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      }
    } else {
      e.target.value = null;
      alert('Only PNG or JPG images are allowed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('https://employees-production-712d.up.railway.app/add/employee', {
        ...formData,
        f_Course: formData.f_Course.join(' / ')
      });
      navigate('/employees');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.f_Name.trim() !== '' &&
      formData.f_Email.trim() !== '' &&
      formData.f_Mobile.trim() !== '' &&
      formData.f_Gender !== '' &&
      formData.f_Course.length > 0 &&
      formData.f_Image !== null
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '32rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create Employee</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
              <input
                type="text"
                id="name"
                name="f_Name"
                value={formData.f_Name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                required
              />
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
              <input
                type="email"
                id="email"
                name="f_Email"
                value={formData.f_Email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" style={{ display: 'block', marginBottom: '0.5rem' }}>Mobile:</label>
              <input
                type="tel"
                id="mobile"
                name="f_Mobile"
                value={formData.f_Mobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                required
              />
            </div>
            <div>
              <label htmlFor="designation" style={{ display: 'block', marginBottom: '0.5rem' }}>Designation:</label>
              <select
                id="designation"
                name="f_Designation"
                value={formData.f_Designation}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
              >
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <span style={{ display: 'block', marginBottom: '0.5rem' }}>Gender:</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="f_Gender"
                    value="Male"
                    checked={formData.f_Gender === 'Male'}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                    required
                  />
                  Male
                </label>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="f_Gender"
                    value="Female"
                    checked={formData.f_Gender === 'Female'}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                    required
                  />
                  Female
                </label>
              </div>
            </div>
            <div>
              <span style={{ display: 'block', marginBottom: '0.5rem' }}>Course:</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['MCA', 'BCA', 'BSC'].map(course => (
                  <label key={course} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      name="f_Course"
                      value={course}
                      checked={formData.f_Course.includes(course)}
                      onChange={handleInputChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {course}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="image" style={{ display: 'block', marginBottom: '0.5rem' }}>Image:</label>
              <input
                type="file"
                id="image"
                name="f_Image"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: isFormValid() && !isSubmitting ? '#4CAF50' : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: isFormValid() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmp;