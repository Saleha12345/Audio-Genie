import React, { useState } from 'react';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = ({ isOpen, toggle, handleMenuClick, currentSection }) => {
  const history = useNavigate();
  const [activeOption, setActiveOption] = useState(currentSection);

  const handleClick = (section) => {
    setActiveOption(section);
    handleMenuClick(section);
  };
  const sidebarStyle = {
    width: '250px',
    height: '100%',
    borderRadius: '7px',
    marginLeft: '10px',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    backgroundColor: '#0040B5',
    padding: '20px',
    marginTop: '10px',
  };

  return (
    <div className='sidebarContainer'>
      <div className={isOpen ? 'sidebar open' : 'sidebar'} style={sidebarStyle}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={require('../img/logo-2.png')} alt="Logo" className="logo" />
          </div>
          <p style={{ fontWeight: 'bold', color: '#fff' }}>AudioGenie</p>
        </div>
        <ul className="sidebar-menu">
          <li
            onClick={() => handleClick('Dashboard')}
            className={activeOption === 'Dashboard' ? 'active' : ''} style={{ marginTop: '-10px', marginBottom: '20px' }}
          >
            <DashboardIcon style={{ marginRight: '5px' }} /> Dashboard
          </li>
          <li
            onClick={() => handleClick('User')}
            className={activeOption === 'User' ? 'active' : ''} style={{ marginTop: '-10px', marginBottom: '20px' }}
          >
            <PersonIcon style={{ marginRight: '5px' }} /> Users
          </li>
          <li
            onClick={() => history('/')}
            className={activeOption === 'Logout' ? 'active' : ''} style={{ marginTop: '-10px' }}
          >
            <ExitToAppIcon style={{ marginRight: '5px' }} /> Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
