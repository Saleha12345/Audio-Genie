import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/MainComponent.css';
import Home from './sections/Home';
import Setting from './sections/Setting';
import Subscription from './sections/Subscription';
import EditProfile from './sections/EditProfile';
import Feedback from './sections/Feedback';
import FAQs from './sections/FAQ';
import History from './sections/History';
import { useUser } from './UserContext'; // Import the useUser hook
import ButtonAppBar from './ButtonAppBar';

const MainComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('Home');
  
  // Use the useUser hook to access signupDetails from UserContext
  const { signupDetails } = useUser();
  const { username } = signupDetails;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (section) => {
    setCurrentSection(section);
  };

  let sectionComponent;
  switch (currentSection) {
    case 'Home':
      sectionComponent = <Home username={username} />;
      break;
    case 'Subscription':
      sectionComponent = <Subscription />;
      break;
    case 'Setting':
      sectionComponent = <Setting />;
      break;
    case 'Feedback':
      sectionComponent = <Feedback />;
      break;
    case 'FAQ':
      sectionComponent = <FAQs />;
      break;
    case 'EditProfile':
      sectionComponent = <EditProfile />;
      break;
    case 'History':
      sectionComponent = <History />;
      break;

    default:
      sectionComponent = null;
  }

  return (
    <div className="main-container">
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} handleMenuClick={handleMenuClick} />    
      <div className="content" style={{ marginLeft: isOpen ? '250px' : '0' , marginTop:'-15px'}}>
        <ButtonAppBar/>  
        {sectionComponent}
      </div>
    </div>
  );
};

export default MainComponent;
