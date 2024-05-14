import React, { useState } from 'react';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import HelpIcon from '@mui/icons-material/Help';

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

const Sidebar = ({ isOpen, toggle, handleMenuClick, currentSection }) => {
  const history = useNavigate();
  const [activeOption, setActiveOption] = useState('Home');

  const handleClick = (section) => {
    setActiveOption(section);
    handleMenuClick(section);
  };

  return (
    <div className={isOpen ? 'sidebar open' : 'sidebar'} style={sidebarStyle}>
      <div className="">
        <div className="logo-container">
          <img src={require('../img/logo-2.png')} alt="Logo" className="logo" />
        </div>
        <p style={{ fontWeight: 'bold', color: '#fff' }}>AudioGenie</p>
      </div>
      <ul className="sidebar-menu" style={{ marginTop: '-90px', fontSize: '14px' }}>
        <li
          onClick={() => handleClick('Home')}
          className={activeOption === 'Home' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'Home' ? 'white' : 'transparent',
            color: activeOption === 'Home' ? 'blue' : '#fff'
          }}
        >
          <HomeIcon style={{ marginRight: '5px' }} /> Home
        </li>
        <li
          onClick={() => handleClick('Subscription')}
          className={activeOption === 'Subscription' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'Subscription' ? 'white' : 'transparent',
            color: activeOption === 'Subscription' ? 'blue' : '#fff',
          }}
        >
          <SubscriptionsIcon style={{ marginRight: '5px' }} /> Subscription
        </li>

        <li
          onClick={() => handleClick('EditProfile')}
          className={activeOption === 'EditProfile' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'EditProfile' ? 'white' : 'transparent',
            color: activeOption === 'EditProfile' ? 'blue' : '#fff',
          }}
        >
          <PersonIcon style={{ marginRight: '5px' }} /> Profile
        </li>
        <li
          onClick={() => handleClick('History')}
          className={activeOption === 'History' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'History' ? 'white' : 'transparent',
            color: activeOption === 'History' ? 'blue' : '#fff',
          }}
        >
          <HistoryIcon style={{ marginRight: '5px' }} /> History
        </li>

        <li
          onClick={() => handleClick('Feedback')}
          className={activeOption === 'Feedback' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'Feedback' ? 'white' : 'transparent',
            color: activeOption === 'Feedback' ? 'blue' : '#fff',
          }}
        >
          <ThumbsUpDownIcon style={{ marginRight: '5px' }} /> Feedback
        </li>

        <li
          onClick={() => handleClick('Setting')}
          className={activeOption === 'Setting' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'Setting' ? 'white' : 'transparent',
            color: activeOption === 'Setting' ? 'blue' : '#fff',
          }}
        >
          <SettingsIcon style={{ marginRight: '5px' }} /> Setting
        </li>

        <li
          onClick={() => handleClick('FAQ')}
          className={activeOption === 'FAQ' ? 'active' : ''}
          style={{
            backgroundColor: activeOption === 'FAQ' ? 'white' : 'transparent',
            color: activeOption === 'FAQ' ? 'blue' : '#fff',
          }}
        >
          <HelpIcon style={{ marginRight: '5px' }} /> FAQ
        </li>

        <li
          onClick={() => history('/')}
          style={{ color: '#fff', cursor: 'pointer' }}
        >
          <ExitToAppIcon style={{ marginRight: '5px' }} /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
