import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import cookies from "react-cookies";
import Logo from "../assets/DealsDray-FavIcon.png";

function Navbar(){
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("user_name");

  const logout = () => {
    const paths = ["/", "/employees", "/create-employee", "/update-employee/:id"];
    paths.forEach(path => cookies.remove("user_token", { path }));
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="DealsDray Logo" className="h-12 w-12 border rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">DealsDray</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
              <NavLink to="/employees" current={location.pathname === "/employees"}>Employee List</NavLink>
            </div>
          </div>
          <div className="flex items-center">
            { userName && <span className="text-gray-700 font-semibold mr-4">{userName}</span> }
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out" aria-label="Logout">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, current, children }) => (
  <Link to={to} className={`${current ?"bg-gray-900 text-white" :"text-gray-700 hover:bg-gray-700 hover:text-white"} px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`} aria-current={current ? "page" : undefined}>{children}</Link>
);

export default Navbar;