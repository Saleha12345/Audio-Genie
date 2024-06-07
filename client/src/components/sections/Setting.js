import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../../styles/themes.css";
import "../../styles/Setting.css";
import { light } from "@mui/material/styles/createPalette";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Setting = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(theme + "-theme");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    speakerAnalysisAlerts: false,
    systemUpdates: false,
  });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [appInfoVisible, setAppInfoVisible] = useState(false);

  const toggleAppInfo = () => {
    setAppInfoVisible(!appInfoVisible);
  };
  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.fontSize = fontSize;
    localStorage.setItem("fontSize", fontSize);
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
    if (!checked) {
      alert(`You have turned off notifications for ${name}`);
    }
  };

  return (
    <div className="settings-container">
      <h1 style={{ marginBottom: "30px" }}>Settings</h1>
      <div className="theme-settings">
        <Box sx={{ minWidth: 120 }} style={{ marginBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              style={{ fontWeight: "bold", fontSize: "16px", color: "black" }}
            >
              Theme
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={theme}
              label="Theme"
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <div className="font-size-settings">
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                style={{ fontWeight: "bold", fontSize: "16px", color: "black" }}
              >
                Font Size
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fontSize}
                label="Font Size"
                onChange={(e) => handleFontSizeChange(e.target.value)}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div className="notification-settings">
        <h3 style={{ marginBottom: "20px" }}>Notification Preferences</h3>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Receive alerts for completed speaker analyses"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Receive system update notifications"
          />
        </FormGroup>
      </div>
      <div className="terms-and-privacy">
        <h3 style={{ marginBottom: "20px" }}>Terms and Privacy</h3>
        <button className="popup-button" onClick={toggleTermsPopup}>
          View Terms
        </button>
        {showTerms && (
          <div className="popup">
            <p style={{ textAlign: 'left' }}>
              Subscription fees apply for full access. Users responsible for
              uploaded content. Admin monitors and manages user accounts.
            </p>
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
            <p style={{ textAlign: 'left' }}>
              We respect your privacy and safeguard any personal information you
              provide while using our platform. We do not share your data with
              third parties without your consent, and we employ robust security
              measures to protect against unauthorized access or misuse of your
              information. By using Audio Genie, you agree to our privacy policy
              and trust us to handle your data responsibly and ethically.
            </p>
            <button className="close-button" onClick={togglePrivacyPopup}>
              Close
            </button>
          </div>
        )}
      </div>

      <div className="app-info">
        <h3 style={{ marginBottom: "20px" }}>App Information </h3>
        <div>Changelog for AudioGenie Project: Version 1.0.0 (© 2023)</div>
      </div>
    </div>
  );
};

export default Setting;
