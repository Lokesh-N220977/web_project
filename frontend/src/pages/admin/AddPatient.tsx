import AdminLayout from "../../components/layout/admin/AdminLayout"
import { UserPlus, Calendar, Clock, MapPin, Phone } from "lucide-react"

function AddPatient() {
    return (
        <AdminLayout>
            <div className="ad-page" style={{ animationDelay: '0.1s' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1>Register New Patient</h1>
                        <p>Manually onboard new patients to the hospital platform.</p>
                    </div>
                </div>

                <div className="ad-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="ad-card-header">
                        <h2 className="ad-card-title">Patient Intake Form</h2>
                    </div>

                    <h3 className="pd-card-subtitle" style={{ borderBottom: '1px solid #eef2f6', paddingBottom: '10px', marginBottom: '20px' }}>Personal Data</h3>
                    <div className="ad-form-grid">
                        <div className="ad-field">
                            <label>Full Name</label>
                            <input type="text" className="ad-input" placeholder="e.g. Emily Clark" />
                        </div>
                        <div className="ad-field">
                            <label>Date of Birth</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Calendar size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="date" className="ad-input" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Gender</label>
                            <select className="ad-input">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="ad-field">
                            <label>Contact Number</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="tel" className="ad-input" placeholder="+1 (555) 000-0000" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                    </div>

                    <h3 className="pd-card-subtitle" style={{ borderBottom: '1px solid #eef2f6', paddingBottom: '10px', marginTop: '30px', marginBottom: '20px' }}>Address & Medical</h3>
                    <div className="ad-form-grid">
                        <div className="ad-field" style={{ gridColumn: '1 / -1' }}>
                            <label>Residential Address</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="text" className="ad-input" placeholder="Full street address, City, ZIP code" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Allergies / Conditions</label>
                            <input type="text" className="ad-input" placeholder="e.g. Penicillin, Asthma" />
                        </div>
                        <div className="ad-field">
                            <label>Blood Group</label>
                            <select className="ad-input">
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>O+</option>
                                <option>O-</option>
                            </select>
                        </div>
                    </div>

                    <div className="pd-settings-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button className="ad-btn-primary" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                        <button className="ad-btn-duo">
                            <UserPlus size={18} />
                            <span>Register Patient</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddPatient
