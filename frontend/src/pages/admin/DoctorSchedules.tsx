import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Search, Filter, Calendar, Clock, Edit2, RotateCcw, Plus } from "lucide-react"

function DoctorSchedules() {
    const schedules = [
        { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", days: "Mon, Wed, Fri", time: "09:00 AM - 05:00 PM", status: "active", slots: 18 },
        { id: 2, doctor: "Dr. Robert Chen", specialty: "Neurology", days: "Tue, Thu", time: "10:00 AM - 06:00 PM", status: "active", slots: 12 },
        { id: 3, doctor: "Dr. Emily Smith", specialty: "Pediatrics", days: "Mon-Thu", time: "08:00 AM - 04:00 PM", status: "active", slots: 24 },
        { id: 4, doctor: "Dr. Michael Lee", specialty: "Orthopedics", days: "On Leave", time: "Not Available", status: "inactive", slots: 0 },
        { id: 5, doctor: "Dr. Jessica Taylor", specialty: "Dermatology", days: "Fri, Sat", time: "01:00 PM - 08:00 PM", status: "active", slots: 14 },
        { id: 6, doctor: "Dr. William Davis", specialty: "General Medicine", days: "Mon-Sat", time: "09:00 AM - 02:00 PM", status: "active", slots: 30 },
    ]

    return (
        <AdminLayout>
            <div className="ad-page" style={{ animation: 'slideDownIn 0.4s ease-out' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1 className="ad-page-title">Doctor Schedules</h1>
                        <p className="ad-page-sub">Configure and monitor working hours, shift assignments, and leave balances for all medical staff.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="ad-btn-primary" style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}>
                            <RotateCcw size={16} />
                            <span>Reset Shifts</span>
                        </button>
                        <button className="ad-btn-duo">
                            <Plus size={18} />
                            <span>Mass Update</span>
                        </button>
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-list-header">
                        <div className="ad-search-bar">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search by doctor name, specialty or day..." />
                        </div>
                        <div className="ad-filter-bar">
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select className="ad-filter-select">
                                    <option value="all">Status: All</option>
                                    <option value="available">Available</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                                <select className="ad-filter-select">
                                    <option value="all">Shift: All</option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
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
                                    <th>Doctor</th>
                                    <th>Medical Department</th>
                                    <th>Availability Days</th>
                                    <th>Working Shift</th>
                                    <th>Daily Slots</th>
                                    <th>Current Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="ad-user-cell">
                                                <div className="ad-avatar" style={{ background: '#f1f5f9', color: '#3b82f6', border: '1px solid #e2e8f0' }}>
                                                    {schedule.doctor.replace('Dr. ', '').charAt(0)}
                                                </div>
                                                <div className="ad-user-info">
                                                    <span className="ad-user-name" style={{ fontSize: '0.9rem' }}>{schedule.doctor}</span>
                                                    <span className="ad-user-sub">#{schedule.id}00-S</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="ad-user-name" style={{ fontSize: '0.85rem', color: '#64748b' }}>{schedule.specialty}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {schedule.days === 'On Leave' ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Vacation Leave</span>
                                                ) : (
                                                    schedule.days.split(', ').map((day, idx) => (
                                                        <span key={idx} style={{ fontSize: '0.7rem', background: '#3b82f610', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{day}</span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ad-user-cell" style={{ gap: '6px' }}>
                                                <Clock size={14} color="#64748b" />
                                                <span className="ad-user-name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{schedule.time}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ad-user-name" style={{ fontSize: '0.85rem', color: '#1e293b' }}>{schedule.slots}</span>
                                        </td>
                                        <td>
                                            <span className={`ad-status ad-status--${schedule.status}`}>
                                                {schedule.status === 'active' ? 'Reporting' : 'Absent'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ad-actions" style={{ justifyContent: 'flex-end' }}>
                                                <button className="ad-icon-btn" title="Edit Schedule" style={{ background: '#f1f5f9' }}><Edit2 size={16} /></button>
                                                <button className="ad-icon-btn" title="View Logs" style={{ background: '#f1f5f9' }}><Calendar size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default DoctorSchedules
