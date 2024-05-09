import React, { useState, useEffect } from 'react';
import '../../styles/themes.css';
import '../../styles/Setting.css';

const Setting = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

 
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    speakerAnalysisAlerts: false,
    systemUpdates: false,
  });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [appInfoVisible, setAppInfoVisible] = useState(false);

  // Function to toggle visibility of app information
  const toggleAppInfo = () => {
    setAppInfoVisible(!appInfoVisible);
  };
  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.fontSize = fontSize;
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

 
  const handleFontSizeChange = (selectedFontSize) => {
    setFontSize(selectedFontSize);
  };
  const toggleTermsPopup = () => {
    setShowTerms(!showTerms);
  };
  
  const togglePrivacyPopup = () => {
    setShowPrivacy(!showPrivacy);
  };
  const handleNotificationPrefChange = (event) => {
    const { name, checked } = event.target;
    setNotificationPrefs((prevPrefs) => ({
      ...prevPrefs,
      [name]: checked,
    }));
  
    if (checked) {
      alert(`Receive alerts for ${name}`);
    }
    // Show alert if preference is undone
    if (!checked) {
      alert(`You have turned off notifications for ${name}`);
    }
  };


  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="theme-settings">
        <h3>Theme Preferences</h3>
        <div>
          <input
            type="radio"
            id="light"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => handleThemeChange('light')}
          />
          <label htmlFor="light">Light</label>
        </div>
        <div>
          <input
            type="radio"
            id="dark"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => handleThemeChange('dark')}
          />
          <label htmlFor="dark">Dark</label>
        </div>
      </div>
      <div className="font-size-settings">
        <h3>Font Size</h3>
        <select value={fontSize} onChange={(e) => handleFontSizeChange(e.target.value)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="notification-settings">
        <h3>Notification Preferences</h3>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="speakerAnalysisAlerts"
            checked={notificationPrefs.speakerAnalysisAlerts}
            onChange={handleNotificationPrefChange}
          />
          Receive alerts for completed speaker analyses
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="systemUpdates"
            checked={notificationPrefs.systemUpdates}
            onChange={handleNotificationPrefChange}
          />
          Receive system update notifications
        </label>
        </div>
        <div className="terms-and-privacy">
  <h3>Terms and Privacy</h3>
  <button className="popup-button" onClick={toggleTermsPopup}>
    View Terms
  </button>
  {showTerms && (
    <div className="popup">
      <p>This is where the Terms and Conditions would appear.</p>
      <button className="close-button" onClick={toggleTermsPopup}>
        Close
      </button>
    </div>
  )}
  <button className="popup-button" onClick={togglePrivacyPopup}>
    View Privacy Policy
  </button>
  {showPrivacy && (
    <div className="popup">
     <p>This is where the Privacy Policy would appear.</p>
      <button className="close-button" onClick={togglePrivacyPopup}>
        Close
      </button>
    </div>
  )}
</div>
<div className="app-info">
        {/* App Information heading with eye icon */}
        <h3>
          App Information{' '}
          {/* Eye icon button for toggling app information */}
          <span className="eye-icon" onClick={toggleAppInfo}>
            {appInfoVisible ? '🔽' : '🔼'}
          </span>
        </h3>
        {/* Conditionally render app information */}
        {appInfoVisible && (
          <div className="info-details">
            
            <p>Changelog for AudioGenie Project:

<h3>Version 1.0.0 (Release Year: [2023])</h3>

</p>
          </div>
        )}
      </div>
      </div>
      );
};

export default Setting;
