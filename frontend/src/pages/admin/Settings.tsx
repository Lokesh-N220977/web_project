import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Shield, Bell, User, Monitor, LogOut } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminSettings() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("general")

    const tabs = [
        { id: "general", label: "General Admin Info", icon: <User size={18} /> },
        { id: "security", label: "Security & Access", icon: <Shield size={18} /> },
        { id: "notifications", label: "System Alerts", icon: <Bell size={18} /> },
        { id: "display", label: "Display Options", icon: <Monitor size={18} /> },
    ]

    return (
        <AdminLayout>
            <div className="ad-page" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div className="ad-header">
                    <div>
                        <h1 className="ad-page-title">System Settings</h1>
                        <p className="ad-page-sub">Configure global platform rules, security, and alerts.</p>
                    </div>
                </div>

                <div className="pd-settings-layout">
                    <aside className="pd-settings-nav">
                        <div className="pd-card">
                            <h3 className="pd-card-subtitle" style={{ margin: '10px 14px 16px 14px', fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Settings Menu</h3>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`pd-settings-tab ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                            <button
                                className="pd-settings-tab pd-tab-danger"
                                onClick={() => navigate("/login")}
                                style={{ color: "#ef4444" }}
                            >
                                <LogOut size={18} />
                                <span>Logout Session</span>
                            </button>
                        </div>
                    </aside>

                    <main className="pd-settings-content">
                        {activeTab === "general" && (
                            <div className="ad-card">
                                <h3 className="pd-card-subtitle">Global Platform Info</h3>
                                <div className="ad-form-grid">
                                    <div className="ad-field">
                                        <label>Hospital Name</label>
                                        <input type="text" className="ad-input" defaultValue="MedicPulse General" />
                                    </div>
                                    <div className="ad-field">
                                        <label>Support Email</label>
                                        <input type="email" className="ad-input" defaultValue="support@medicpulse.com" />
                                    </div>
                                </div>
                                <div className="ad-form-actions" style={{ marginTop: '20px' }}>
                                    <button className="ad-btn-primary">Save Changes</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="ad-card">
                                <h3 className="pd-card-subtitle">Admin Security</h3>
                                <div className="pd-field-stack">
                                    <div className="ad-field">
                                        <label>Current Password</label>
                                        <input type="password" placeholder="••••••••" className="ad-input" />
                                    </div>
                                    <div className="ad-field">
                                        <label>New Password</label>
                                        <input type="password" placeholder="Enter new password" className="ad-input" />
                                    </div>
                                    <div className="ad-field">
                                        <label>Confirm Password</label>
                                        <input type="password" placeholder="Confirm new password" className="ad-input" />
                                    </div>
                                </div>
                                <div className="ad-form-actions" style={{ marginTop: '20px' }}>
                                    <button className="ad-btn-primary">Update Password</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="ad-card">
                                <h3 className="pd-card-subtitle">System Alerts</h3>
                                <p className="pd-page-sub mb-4">Toggle critical administrative alerts.</p>
                                <div className="pd-notif-option" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>New Doctor Registrations</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="pd-notif-option" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>Critical Error Reports</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <div className="pd-notif-option" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Daily Analytics Rollup</span>
                                    <input type="checkbox" />
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminSettings
