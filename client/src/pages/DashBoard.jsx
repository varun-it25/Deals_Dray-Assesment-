import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('f_Id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDelete, setDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // To store the employee to delete

  useEffect(() => {
    document.title = 'Dashboard';
    const fetchData = async () => {
      try {
        const res = await axios.get('https://employees-production-712d.up.railway.app/employees');
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchData();
    if (!isLoading && !isAuthenticated) navigate('/login');
  }, [isLoading, isAuthenticated, navigate]);

  const handleSearch = e => setSearchTerm(e.target.value);

  const handleSort = key => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredEmployees = employees.filter(employee =>
    Object.values(employee).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`https://employees-production-712d.up.railway.app/delete/employee/${employeeToDelete.f_Id}`);
      setEmployees(employees.filter(emp => emp.f_Id !== employeeToDelete.f_Id));
      setDelete(false); // Close the delete confirmation
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {isDelete && (
        <div className={`backdrop-blur-sm w-screen h-screen absolute ${isDelete ? 'flex' : 'none'} justify-center items-center top-0`}>
          <div className='bg-white rounded-2xl sm:w-96 w-80 h-36 space-y-4 flex flex-col justify-center items-center p-6 py-8 border-2'>
            <p className='text-xl font-semibold'>Are you sure?</p>
            <div className='flex space-x-4'>
              <button className='z-10 rounded-md px-6 py-1 bg-zinc-400 text-white text-sm font-semibold' onClick={() => setDelete(false)}>No</button>
              <button className='z-10 rounded-md px-6 py-1 bg-red-600 text-white text-sm font-semibold' onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Employee Dashboard</h1>
            <p className="text-base font-semibold">Total Employees: {sortedEmployees.length}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <Link to="/create-employee" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto rounded-md px-8 py-3 bg-sky-600 text-white font-semibold hover:bg-sky-700">
                Add Employee
              </button>
            </Link>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="border-2 px-3 py-2 rounded-md w-full sm:w-auto sm:mt-0 mt-4"
              />
              <select
                onChange={e => handleSort(e.target.value)}
                className="rounded-md px-3 py-2 border text-sm font-semibold w-full sm:w-auto"
              >
                <option value="f_Id">Sort by ID</option>
                <option value="f_Name">Sort by Name</option>
                <option value="f_Designation">Sort by Designation</option>
                <option value="f_Createdate">Sort by Create Date</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  {['f_Id', 'f_Image', 'f_Name', 'f_Email', 'f_Mobile', 'f_Designation', 'f_Gender', 'f_Course', 'f_Createdate'].map((key) => (
                    <th key={key} className="p-3 text-sm font-semibold text-left">
                      {key.replace('f_', '')}
                    </th>
                  ))}
                  <th className="p-3 text-sm font-semibold text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedEmployees.map((employee, index) => (
                  <tr key={employee.f_Id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Id}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Image && <img src={employee.f_Image} alt="Employee" className="h-10 w-10 rounded-full" />}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Name}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <a href={`mailto:${employee.f_Email}`} className="text-blue-500 hover:underline">{employee.f_Email}</a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Mobile}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Designation}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Gender}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Course}</td>
                    <td className="p-3 text-sm text-gray-700">{employee.f_Createdate}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => navigate(`/update-employee/${employee.f_Id}`)}
                          className="rounded-md px-3 py-1 bg-orange-400 text-white hover:bg-orange-500 sm:w-auto w-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setEmployeeToDelete(employee);
                            setDelete(true);
                          }}
                          className="rounded-md px-3 py-1 bg-red-600 text-white hover:bg-red-700 sm:w-auto w-full"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
