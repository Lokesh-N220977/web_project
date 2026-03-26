import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import api from "../../../services/api"
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarCheck,
  History,
  Bell,
  UserCircle,
  LogOut,
  X,
  Settings
} from "lucide-react"
import logo from "../../../assets/logo.png"

const navLinks = [
  { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patient/book-appointment", label: "Book Appointment", icon: CalendarPlus },
  { to: "/patient/appointments", label: "My Appointments", icon: CalendarCheck },
  { to: "/patient/visit-history", label: "Visit History", icon: History },
  { to: "/patient/notifications", label: "Notifications", icon: Bell, isNotif: true },
  { to: "/patient/profile", label: "Profile", icon: UserCircle },
  { to: "/patient/settings", label: "Settings", icon: Settings },
]

interface PatientSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

const PatientSidebar = ({ mobileOpen = false, onClose }: PatientSidebarProps) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = (user.name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase();
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications")
      if (res.data.success) {
        const count = res.data.data.filter((n: any) => !n.is_read).length
        setUnreadCount(count)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUnread()
    const interval = setInterval(fetchUnread, 60000) // update every minute
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="ps-overlay ps-overlay-open" onClick={onClose} />
      )}

      <aside className={`patient-sidebar${mobileOpen ? " ps-open" : ""}`}>
        {/* Logo */}
        <div className="ps-logo" style={{ height: '72px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
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

        {/* User Identity Section */}
        <div className="ps-user-premium" style={{ margin: '8px 12px 14px', padding: '12px', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="ps-avatar-premium" style={{ width: '48px', height: '48px', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '14px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)' }}>
              { initials }
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#22c55e', borderRadius: '50%', border: '2.5px solid #fff', boxShadow: '0 0 8px rgba(34,197,94,0.4)' }} />
          </div>
          <div className="ps-user-info" style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ user.name || "User" }</p>
            <p style={{ margin: '1px 0 0', fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Patient Account</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ps-nav">
          <p className="ps-nav-label">MAIN MENU</p>
          <ul className="ps-menu">
            {navLinks.map(({ to, label, icon: Icon, isNotif }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `ps-link${isActive ? " ps-link-active" : ""}`
                  }
                  onClick={onClose}
                >
                  <span className="ps-link-icon">
                    <Icon size={19} />
                  </span>
                  <span className="ps-link-label">{label}</span>
                  {isNotif && unreadCount > 0 && (
                    <span className="ps-badge">{unreadCount}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout at the bottom */}
        <div className="ps-logout-wrap">
          <div className="ps-divider" />
          <button className="ps-logout-btn" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default PatientSidebar
