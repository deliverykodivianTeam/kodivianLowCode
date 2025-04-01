import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaWpforms, FaLayerGroup, FaCogs, FaQuestionCircle, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-container">
      {/* ☰ Toggle Button */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <ul>
          <li className="dashboard-side">
            <Link to="/dashboard">
              <FaTachometerAlt className="icon" />
              {isOpen && <span>Admin Dashboard</span>}
            </Link>
          </li>
          <li className="form-side">
            <Link to="/form">
              <FaWpforms className="icon" />
              {isOpen && <span>Form</span>}
            </Link>
          </li>
          <li className="template-side">
            <Link to="/templates">
              <FaLayerGroup className="icon" />
              {isOpen && <span>Template</span>}
            </Link>
          </li>
        </ul>

        {/* Settings & Help at the Bottom */}
        <div className="bottom-section">
          <li className="setting-side">
            <Link to="/settings">
              <FaCogs className="icon" />
              {isOpen && <span>Settings</span>}
            </Link>
          </li>
          <li className="help-side">
            <Link to="/help">
              <FaQuestionCircle className="icon" />
              {isOpen && <span>Help</span>}
            </Link>
          </li>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
