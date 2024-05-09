import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminDashboard from './sections/AdminDahboard';
import User from './sections/User';

import ButtonAppBar from './ButtonAppBar';
import "../styles/Admin.css";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('Dashboard');


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (section) => {
    setCurrentSection(section);
  };

  let sectionComponent;
  switch (currentSection) {
    case 'Dashboard':
      sectionComponent = <AdminDashboard/>;
      break;
    case 'User':
      sectionComponent = <User/>;
      break;

    default:
      sectionComponent = null;
  }

  return (
    <div className="main-container">
    <Sidebar isOpen={isOpen} toggle={toggleSidebar} handleMenuClick={handleMenuClick} />

      
      <div className="content" style={{ marginLeft: isOpen ? '250px' : '0', marginTop:'-15px'}}>
        <ButtonAppBar />
        {sectionComponent}
      </div>
    </div>
  
  );
};

export default Admin;
