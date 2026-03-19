import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Calendar, Stethoscope, Search, UserCheck } from "lucide-react"

function AddAppointment() {
    return (
        <AdminLayout>
            <div className="ad-page" style={{ animationDelay: '0.1s' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1>Book Appointment</h1>
                        <p>Administically schedule a new visit on behalf of a patient.</p>
                    </div>
                </div>

                <div className="ad-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="ad-card-header">
                        <h2 className="ad-card-title">Schedule New Walk-In</h2>
                    </div>

                    <div className="ad-form-grid">
                        <div className="ad-field" style={{ gridColumn: '1 / -1' }}>
                            <label>Lookup Patient (Search by ID or Name)</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="text" className="ad-input" placeholder="Start typing... e.g. Emily Clark" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                    </div>

                    <h3 className="pd-card-subtitle" style={{ borderBottom: '1px solid #eef2f6', paddingBottom: '10px', marginTop: '30px', marginBottom: '20px' }}>Select Doctor & Timing</h3>
                    <div className="ad-form-grid">
                        <div className="ad-field">
                            <label>Select Department</label>
                            <select className="ad-input" defaultValue="Orthopedics">
                                <option>Cardiology</option>
                                <option>Neurology</option>
                                <option>Orthopedics</option>
                                <option>Pediatrics</option>
                            </select>
                        </div>
                        <div className="ad-field">
                            <label>Select Doctor</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Stethoscope size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <select className="ad-input" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}>
                                    <option>Dr. Michael Lee</option>
                                </select>
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Appointment Date</label>
                            <div className="pd-input-icon-wrap" style={{ position: 'relative' }}>
                                <Calendar size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
                                <input type="date" className="ad-input" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <div className="ad-field">
                            <label>Available Slots</label>
                            <select className="ad-input">
                                <option>09:00 AM - 09:30 AM</option>
                                <option>10:00 AM - 10:30 AM</option>
                                <option>11:30 AM - 12:00 PM</option>
                                <option>02:00 PM - 02:30 PM (Booked!)</option>
                            </select>
                        </div>
                    </div>

                    <div className="ad-field" style={{ marginTop: '20px' }}>
                        <label>Reason for Visit / Symptoms</label>
                        <textarea className="ad-input" rows={4} placeholder="Summarize patient complaints..." style={{ resize: 'vertical' }}></textarea>
                    </div>

                    <div className="pd-settings-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button className="ad-btn-primary" style={{ background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                        <button className="ad-btn-duo">
                            <UserCheck size={18} />
                            <span>Confirm Appointment</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddAppointment
