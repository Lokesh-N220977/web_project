import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Users, Stethoscope, Calendar, Activity, ArrowRight, TrendingUp } from "lucide-react"

function AdminDashboard() {
    const stats = [
        { title: "Total Doctors", value: "48", trend: "+12% this month", icon: <Stethoscope size={28} />, color: "blue" },
        { title: "Total Patients", value: "1,245", trend: "+5% this month", icon: <Users size={28} />, color: "green" },
        { title: "Today's Appts", value: "34", trend: "12 completed", icon: <Calendar size={28} />, color: "purple" },
        { title: "Platform Active", value: "98%", trend: "Optimal", icon: <Activity size={28} />, color: "orange" },
    ]

    const recentAppts = [
        { id: "APT01", patient: "Emily Clark", patientId: "PT8891", doctor: "Dr. Sarah Johnson", specialty: "Cardiology", time: "10:30 AM", status: "completed" },
        { id: "APT02", patient: "Michael Brown", patientId: "PT4421", doctor: "Dr. Robert Chen", specialty: "Neurology", time: "11:45 AM", status: "active" },
        { id: "APT03", patient: "Jessica Taylor", patientId: "PT5532", doctor: "Dr. Emily Smith", specialty: "Pediatrics", time: "02:15 PM", status: "pending" },
        { id: "APT04", patient: "David Wilson", patientId: "PT7710", doctor: "Dr. Michael Lee", specialty: "Orthopedics", time: "04:00 PM", status: "pending" },
    ]

    return (
        <AdminLayout>
            <div className="ad-page">
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, Admin. Here is what's happening today.</p>
                    </div>
                    <button className="ad-btn-duo">
                        <TrendingUp size={18} />
                        <span>Generate Report</span>
                    </button>
                </div>

                <div className="ad-stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className={`ad-stat-card ad-stat--${stat.color}`}>
                            <div className="ad-stat-icon-wrap">{stat.icon}</div>
                            <div className="ad-stat-info">
                                <span className="ad-stat-value">{stat.value}</span>
                                <span className="ad-stat-label">{stat.title}</span>
                                <span className="ad-stat-trend">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ad-card">
                    <div className="ad-card-header">
                        <h2 className="ad-card-title">Recent Appointments</h2>
                        <button className="ad-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>View All <ArrowRight size={16} /></button>
                    </div>
                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <thead>
                                <tr>
                                    <th>Patient Details</th>
                                    <th>Consulting Doctor</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAppts.map((appt, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="ad-user-cell">
                                                <div className="ad-avatar">{appt.patient.charAt(0)}</div>
                                                <div className="ad-user-info">
                                                    <span className="ad-user-name">{appt.patient}</span>
                                                    <span className="ad-user-sub">#{appt.patientId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ad-user-info">
                                                <span className="ad-user-name">{appt.doctor}</span>
                                                <span className="ad-user-sub">{appt.specialty}</span>
                                            </div>
                                        </td>
                                        <td><span className="ad-user-sub" style={{ fontWeight: 700 }}>{appt.time}</span></td>
                                        <td>
                                            <span className={`ad-status ad-status--${appt.status}`}>
                                                {appt.status}
                                            </span>
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

export default AdminDashboard

