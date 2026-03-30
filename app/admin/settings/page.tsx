"use client";

import { useState } from "react";
import {
  Settings, User, Bell, Shield, Palette,
  Save, CheckCircle, Moon, Sun,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="admin-page">
      {toast && (
        <div className="toast toast-success">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings size={22} className="page-title-icon" /> Settings
          </h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`settings-tab ${activeTab === id ? "settings-tab-active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="settings-panel">
          {activeTab === "profile" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Profile Information</h2>
              <div className="settings-avatar-wrap">
                <div className="settings-avatar">A</div>
                <div>
                  <p className="settings-avatar-name">Admin User</p>
                  <p className="settings-avatar-role">Super Admin</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" defaultValue="Admin User" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" defaultValue="admin@hiyanblog.com" type="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" defaultValue="admin" />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" defaultValue="Blog administrator at HiyanBlog." rows={3} />
              </div>
              <button className="btn-primary" onClick={showToast} type="button">
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Notification Preferences</h2>
              {[
                { label: "Email Notifications", desc: "Receive email alerts for new comments and activity", state: emailNotif, set: setEmailNotif },
                { label: "Auto-Save Drafts", desc: "Automatically save your drafts every 30 seconds", state: autoSave, set: setAutoSave },
              ].map(({ label, desc, state, set }) => (
                <div key={label} className="settings-toggle-row">
                  <div>
                    <p className="settings-toggle-label">{label}</p>
                    <p className="settings-toggle-desc">{desc}</p>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${state ? "toggle-switch-on" : ""}`}
                    onClick={() => set(!state)}
                  >
                    <span className="toggle-switch-thumb" />
                  </button>
                </div>
              ))}
              <button className="btn-primary" onClick={showToast} type="button">
                <Save size={15} /> Save Preferences
              </button>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Appearance</h2>
              <div className="settings-toggle-row">
                <div>
                  <p className="settings-toggle-label">Theme</p>
                  <p className="settings-toggle-desc">Switch between light and dark mode</p>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${darkMode ? "toggle-switch-on" : ""}`}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <span className="toggle-switch-thumb" />
                </button>
              </div>
              <div className="theme-preview-row">
                <div className={`theme-preview-card ${darkMode ? "" : "theme-light-card"}`}>
                  {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                  <p>{darkMode ? "Dark Mode" : "Light Mode"}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="color-options">
                  {["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"].map((c) => (
                    <div key={c} className="color-swatch" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <button className="btn-primary" onClick={showToast} type="button">
                <Save size={15} /> Save Theme
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <h2 className="settings-section-title">Security Settings</h2>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Minimum 8 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" placeholder="Repeat new password" />
              </div>
              <div className="security-info">
                <Shield size={16} />
                <p>Use a strong password with uppercase, numbers, and symbols.</p>
              </div>
              <button className="btn-primary" onClick={showToast} type="button">
                <Save size={15} /> Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
