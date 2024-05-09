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
  width: '250px', /* Set the width of the sidebar */
  height: '100%', /* Set the height to occupy the entire vertical space */
  overflowY: 'scroll', /* Enable vertical scrolling */
  WebkitOverflowScrolling: 'touch', /* Enable momentum scrolling for iOS Safari */
  msOverflowStyle: 'none', /* IE and Edge */
  scrollbarWidth: 'none', /* Firefox */
  backgroundColor: '#0040B5', /* Set background color as desired */
  padding: '20px' /* Add padding for content */
};

const Sidebar = ({ isOpen, toggle, handleMenuClick, currentSection }) => {
  const history = useNavigate();
  const [activeOption, setActiveOption] = useState(currentSection);

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
      <ul className="sidebar-menu" style={{marginTop:'-90px', fontSize:'12px'}}>
        <li 
          onClick={() => handleClick('Home')}
          className={activeOption === 'Home' ? 'active' : ''}
        >
          <HomeIcon style={{marginRight:'5px'}}/> Home
        </li>
        <li 
          onClick={() => handleClick('Subscription')}
          className={activeOption === 'Subscription' ? 'active' : ''}
        >
          <SubscriptionsIcon style={{marginRight:'5px'}} /> Subscription
        </li>
        
        <li 
          onClick={() => handleClick('EditProfile')}
          className={activeOption === 'EditProfile' ? 'active' : ''}
        >
          <PersonIcon style={{marginRight:'5px'}}/> Profile
        </li>
        <li 
          onClick={() => handleClick('History')}
          className={activeOption === 'History' ? 'active' : ''}
        >
          <HistoryIcon style={{marginRight:'5px'}}/> History
        </li>

        
        <li
          onClick={() => handleClick('Feedback')}
          className={activeOption === 'Feedback' ? 'active' : ''}
        >
          <ThumbsUpDownIcon style={{marginRight:'5px'}} /> Feedback
        </li>

        <li
          onClick={() => handleClick('Setting')}
          className={activeOption === 'Setting' ? 'active' : ''}
        >
          <SettingsIcon style={{marginRight:'5px'}} /> Setting
        </li>

        <li
          onClick={() => handleClick('FAQ')}
          className={activeOption === 'FAQ' ? 'active' : ''}
        >
          <HelpIcon style={{marginRight:'5px'}} /> FAQ
        </li>



        <li onClick={() => history('/')} >
          <ExitToAppIcon style={{marginRight:'5px'}}/> Logout
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
