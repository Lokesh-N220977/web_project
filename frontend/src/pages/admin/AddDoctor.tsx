import AdminLayout from "../../components/layout/admin/AdminLayout"
import { UserPlus, Image, Mail, Phone, MapPin, Building, Award } from "lucide-react"

function AddDoctor() {
    return (
        <AdminLayout>
            <div className="ad-page" style={{ animationDelay: '0.1s' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1>Add New Doctor</h1>
                        <p>Onboard a new healthcare professional to the platform.</p>
                    </div>
                </div>

                <div className="ad-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="ad-card-header">
                        <h2 className="ad-card-title">Doctor Information Form</h2>
                    </div>

                    <div className="pd-form-grid" style={{ marginBottom: '30px' }}>
                        <div className="pd-field" style={{ gridColumn: '1 / -1' }}>
                            <div className="ad-upload-area">
                                <Image size={40} />
                                <span className="ad-upload-text">Upload Doctor Photo</span>
                                <span className="pd-page-sub">Recommended size: 400x400px</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="pd-card-subtitle" style={{ borderBottom: '1px solid #eef2f6', paddingBottom: '10px', marginBottom: '20px' }}>Personal Details</h3>
                    <div className="ad-form-grid">
                        <div className="ad-field">
                            <label>Full Name</label>
                            <input type="text" className="ad-input" placeholder="e.g. Dr. John Doe" />
                        </div>
                        <div className="ad-field">
                            <label>Specialization</label>
                            <select className="ad-input">
                                <option>Select Specialization</option>
                                <option>Cardiology</option>
                                <option>Neurology</option>
                                <option>Orthopedics</option>
                                <option>Pediatrics</option>
                            </select>
                        </div>
                        <div className="ad-field">
                            <label>Email Address</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="email" className="ad-input" placeholder="doctor@example.com" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Phone Number</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="tel" className="ad-input" placeholder="+1 (555) 000-0000" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                    </div>

                    <h3 className="pd-card-subtitle" style={{ borderBottom: '1px solid #eef2f6', paddingBottom: '10px', marginTop: '30px', marginBottom: '20px' }}>Professional Details</h3>
                    <div className="ad-form-grid">
                        <div className="ad-field">
                            <label>Medical Degree</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Award size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="text" className="ad-input" placeholder="e.g. MD, MBBS" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Years of Experience</label>
                            <input type="number" className="ad-input" placeholder="e.g. 10" />
                        </div>
                        <div className="ad-field">
                            <label>Department / Clinic</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Building size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="text" className="ad-input" placeholder="e.g. Heart Center" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Location / City</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="text" className="ad-input" placeholder="e.g. New York" style={{ paddingLeft: '40px' }} />
                            </div>
                        </div>
                    </div>

                    <div className="pd-settings-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button className="ad-btn-primary" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                        <button className="ad-btn-duo">
                            <UserPlus size={18} />
                            <span>Create Doctor Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddDoctor
