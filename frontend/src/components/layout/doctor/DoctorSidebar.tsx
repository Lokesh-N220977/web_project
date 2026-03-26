import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, ClipboardList, Clock, Users, History, 
  FileText, User, Settings, LogOut, 
  CalendarX, X
} from "lucide-react"

import { useAuth } from "../../../context/AuthContext"
import logo from "../../../assets/logo.png"

interface DoctorSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

const DoctorSidebar = ({ mobileOpen = false, onClose }: DoctorSidebarProps) => {
  const { user, logout } = useAuth()
  const links = [
    { title: "Dashboard",           path: "/doctor/dashboard",          icon: <LayoutDashboard size={20} /> },
    { title: "Appointments",        path: "/doctor/appointments",       icon: <ClipboardList size={20} /> },
    { title: "Schedule",            path: "/doctor/my-schedule",        icon: <Clock size={20} /> },
    { title: "Manage Leaves",       path: "/doctor/leaves",             icon: <CalendarX size={20} /> },
    { title: "Patients",            path: "/doctor/patients",           icon: <Users size={20} /> },
    { title: "Visit History",       path: "/doctor/visit-history",      icon: <History size={20} /> },
    { title: "Prescriptions",       path: "/doctor/prescriptions",      icon: <FileText size={20} /> },
    { title: "Profile",             path: "/doctor/profile",            icon: <User size={20} /> },
    { title: "Settings",            path: "/doctor/settings",           icon: <Settings size={20} /> },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="ps-overlay ps-overlay-open" onClick={onClose} />
      )}

      <aside className={`doctor-sidebar dr-sidebar-theme premium-vibe${mobileOpen ? " ps-open" : ""}`}>
        <div className="ps-logo" style={{ height: '72px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--bg-white)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                <img src={logo} alt="Logo" style={{ height: '24px', width: 'auto' }} />
              </div>
              <span className="ps-logo-text" style={{ fontSize: '1.3rem', letterSpacing: '-0.04em', fontWeight: 900, display: 'flex', alignItems: 'baseline' }}>
                <span style={{ color: 'var(--text-dark)' }}>Medic</span>
                <span style={{ background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pulse</span>
              </span>
          </div>
          <button className="ps-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Floating Identity Card */}
        <div className="ps-user-floating" style={{ margin: '4px 8px 8px', position: 'relative' }}>
          <div style={{ background: 'var(--bg-white)', borderRadius: '14px', padding: '10px 14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="ps-avatar-premium" style={{ width: '40px', height: '40px', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
                  {(user?.name || "D")[0].toUpperCase()}
                </div>
                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-white)', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name ? (user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`) : "Doctor"}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {(user as any)?.specialization || "Practitioner"}
              </p>
            </div>
          </div>
        </div>

        <nav className="ps-nav" style={{ padding: '0 8px' }}>
          <div className="ps-nav-group">
            <h3 className="ps-nav-label" style={{ margin: '8px 0 6px 14px', fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '2px' }}>CLINICAL VIEW</h3>
            {links.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }: { isActive: boolean }) => `ps-link ps-link-marvelous${isActive ? " ps-link-active" : ""}`}
                style={{ borderRadius: '10px', margin: '1px 0', padding: '10px 14px' }}
                onClick={onClose}
              >
                <div className="ps-link-icon-wrap" style={{ opacity: 0.9 }}>
                  {link.icon}
                </div>
                <span className="ps-link-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>{link.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="ps-footer">
          <div className="ps-divider" />
          <button className="ps-logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default DoctorSidebar
