import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Search, Filter, Trash2, CalendarX, Eye, Bookmark, Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Appointments() {
    const navigate = useNavigate()
    const appointmentsList = [
        { id: "AP-1021", patient: "Michael Scott", doctor: "Dr. Sarah Johnson", date: "15 Nov 2023", time: "10:00 AM", status: "active", type: "First Visit", urgent: false },
        { id: "AP-1022", patient: "Pam Beesly", doctor: "Dr. Robert Chen", date: "15 Nov 2023", time: "11:30 AM", status: "active", type: "Follow-up", urgent: false },
        { id: "AP-1023", patient: "Jim Halpert", doctor: "Dr. Emily Smith", date: "16 Nov 2023", time: "09:15 AM", status: "pending", type: "Consultation", urgent: true },
        { id: "AP-1024", patient: "Dwight Schrute", doctor: "Dr. Michael Lee", date: "16 Nov 2023", time: "01:00 PM", status: "inactive", type: "Routine Check", urgent: false },
        { id: "AP-1025", patient: "Stanley Hudson", doctor: "Dr. Jessica Taylor", date: "17 Nov 2023", time: "03:45 PM", status: "active", type: "Lab Test", urgent: true },
        { id: "AP-1026", patient: "Angela Martin", doctor: "Dr. Sarah Johnson", date: "18 Nov 2023", time: "02:00 PM", status: "active", type: "Follow-up", urgent: false },
    ]

    return (
        <AdminLayout>
            <div className="ad-page" style={{ animation: 'slideDownIn 0.4s ease-out' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1 className="ad-page-title">Appointment Management</h1>
                        <p className="ad-page-sub">Monitor all hospital schedules, cancellations, and active bookings globally.</p>
                    </div>
                    <button className="ad-btn-duo" onClick={() => navigate("/admin/appointments/add")}>
                        <Bookmark size={18} />
                        <span>Book Appointment</span>
                    </button>
                </div>

                <div className="ad-card">
                    <div className="ad-list-header">
                        <div className="ad-search-bar">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search by ID, Patient or Doctor..." />
                        </div>
                        <div className="ad-filter-bar">
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select className="ad-filter-select">
                                    <option value="today">Today's Visits</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">History</option>
                                </select>
                                <select className="ad-filter-select">
                                    <option value="all">Priority: All</option>
                                    <option value="urgent">Urgent Only</option>
                                </select>
                            </div>
                            <button className="ad-btn-primary" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Patient Info</th>
                                    <th>Assigned Specialist</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentsList.map((apt, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="ad-user-info">
                                                <span className="ad-user-name" style={{ fontWeight: 800 }}>{apt.id}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span className="ad-user-sub">{apt.type}</span>
                                                    {apt.urgent && <span style={{ fontSize: '0.6rem', color: '#fff', background: '#ef4444', padding: '1px 6px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Urgent</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ad-user-cell">
                                                <div className="ad-avatar" style={{ background: '#f1f5f9', color: '#3b82f6', width: '36px', height: '36px' }}>
                                                    <User size={18} />
                                                </div>
                                                <span className="ad-user-name" style={{ fontSize: '0.9rem' }}>{apt.patient}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ad-user-info">
                                                <span className="ad-user-name" style={{ fontSize: '0.9rem' }}>{apt.doctor}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ad-user-info">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                                                    <Clock size={14} color="#64748b" /> {apt.time}
                                                </div>
                                                <span className="ad-user-sub">{apt.date}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`ad-status ad-status--${apt.status}`}>
                                                {apt.status === 'active' ? 'Confirmed' : apt.status === 'pending' ? 'Waiting' : 'Cancelled'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ad-actions" style={{ justifyContent: 'flex-end' }}>
                                                <button className="ad-icon-btn" title="View Details" style={{ color: '#3b82f6', background: '#3b82f610' }}><Eye size={16} /></button>
                                                <button className="ad-icon-btn danger" title="Cancel Booking" style={{ color: '#ef4444', background: '#ef444410' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing 6 of 1,240 appointments</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Previous</button>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Appointments
