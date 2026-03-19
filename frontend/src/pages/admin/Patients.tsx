import AdminLayout from "../../components/layout/admin/AdminLayout"
import { Search, Filter, Edit2, Eye, Ban, Download, UserPlus, Phone, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Patients() {
    const navigate = useNavigate()
    const patientsList = [
        { id: "PT-8891", name: "Emily Clark", age: 28, email: "emily.c@email.com", lastVisit: "12 Oct 2023", issue: "Hypertension", status: "active", doctor: "Dr. Sarah Johnson" },
        { id: "PT-4421", name: "Michael Brown", age: 45, email: "m.brown@email.com", lastVisit: "05 Nov 2023", issue: "Migraine", status: "active", doctor: "Dr. Robert Chen" },
        { id: "PT-5532", name: "Jessica Taylor", age: 32, email: "j.tay77@email.com", lastVisit: "22 Sep 2023", issue: "Asthma", status: "inactive", doctor: "Dr. Emily Smith" },
        { id: "PT-7710", name: "David Wilson", age: 58, email: "wilson.d@email.com", lastVisit: "18 Nov 2023", issue: "Fracture", status: "active", doctor: "Dr. Michael Lee" },
        { id: "PT-9920", name: "Sarah Davies", age: 19, email: "s.davies@email.com", lastVisit: "30 Oct 2023", issue: "Diabetes", status: "active", doctor: "Dr. Sarah Johnson" },
        { id: "PT-1102", name: "John Doe", age: 39, email: "john.d@email.com", lastVisit: "25 Nov 2023", issue: "Annual Checkup", status: "active", doctor: "Dr. William Davis" },
    ]

    return (
        <AdminLayout>
            <div className="ad-page" style={{ animation: 'slideDownIn 0.4s ease-out' }}>
                <div className="ad-header">
                    <div className="ad-header-content">
                        <h1 className="ad-page-title">Patient Management</h1>
                        <p className="ad-page-sub">Centralized repository for patient records, medical history, and status tracking.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="ad-btn-primary" style={{ background: '#fff', color: '#475569', border: '1px solid #e2e8f0' }}>
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                        <button className="ad-btn-duo" onClick={() => navigate("/admin/patients/add")}>
                            <UserPlus size={18} />
                            <span>Register Patient</span>
                        </button>
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-list-header">
                        <div className="ad-search-bar">
                            <Search size={18} color="#94a3b8" />
                            <input type="text" placeholder="Search patients by name, ID or email..." />
                        </div>
                        <div className="ad-filter-bar">
                            <select className="ad-filter-select">
                                <option value="all">Medical Status: All</option>
                                <option value="active">Active Treatment</option>
                                <option value="discharged">Discharged</option>
                                <option value="pending">Recovery</option>
                            </select>
                            <button className="ad-btn-primary" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    <div className="ad-table-wrap">
                        <table className="ad-table">
                            <thead>
                                <tr>
                                    <th>Patient Details</th>
                                    <th>Primary Issue</th>
                                    <th>Assigned Doctor</th>
                                    <th>Last Visit</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientsList.map((pt, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="ad-user-cell">
                                                <div className="ad-avatar" style={{
                                                    background: `hsl(${i * 60}, 70%, 50%)`,
                                                    width: '40px',
                                                    height: '40px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {pt.name.charAt(0)}
                                                </div>
                                                <div className="ad-user-info">
                                                    <span className="ad-user-name" style={{ fontSize: '0.95rem' }}>{pt.name}</span>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <span className="ad-user-sub" style={{ fontWeight: 600 }}>{pt.id}</span>
                                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>•</span>
                                                        <span className="ad-user-sub">{pt.age} Yrs</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ad-user-name" style={{ fontSize: '0.85rem', color: '#1e293b' }}>{pt.issue}</span>
                                        </td>
                                        <td>
                                            <div className="ad-user-info">
                                                <span className="ad-user-name" style={{ fontSize: '0.85rem' }}>{pt.doctor}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ad-user-name" style={{ fontSize: '0.85rem' }}>{pt.lastVisit}</span>
                                        </td>
                                        <td>
                                            <span className={`ad-status ad-status--${pt.status}`}>
                                                {pt.status.charAt(0).toUpperCase() + pt.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ad-actions" style={{ justifyContent: 'flex-end' }}>
                                                <button className="ad-icon-btn" title="View Records" style={{ color: '#3b82f6', background: '#3b82f610' }}><Eye size={16} /></button>
                                                <button className="ad-icon-btn" title="Edit Profile" style={{ color: '#22c55e', background: '#22c55e10' }}><Edit2 size={16} /></button>
                                                <button className="ad-icon-btn danger" title="Suspend Account" style={{ color: '#ef4444', background: '#ef444410' }}><Ban size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing 6 of 842 records</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Previous</button>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#3b82f6', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>1</button>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>2</button>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>3</button>
                            <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Patients
