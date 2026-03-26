import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="pn-icon-btn pn-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px' }}
      >
        <Bell size={20} style={{ color: unreadCount > 0 ? 'var(--primary)' : 'var(--text-dark)' }} />
        {unreadCount > 0 && (
          <span className="pn-bell-dot" style={{
            position: 'absolute', top: '4px', right: '4px', 
            background: '#ef4444', color: 'white', fontSize: '10px', 
            borderRadius: '50%', width: '16px', height: '16px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown" style={{
          position: 'absolute',
          top: '100%',
          right: '-10px',
          marginTop: '8px',
          width: '320px',
          maxHeight: '400px',
          backgroundColor: 'var(--dropdown-bg, var(--bg-white))',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'var(--text-dark)', letterSpacing: '0.02em' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.2 }} />
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    style={{ 
                      padding: '14px 18px', 
                      borderBottom: '1px solid var(--glass-border)', 
                      backgroundColor: notif.is_read ? 'transparent' : 'rgba(59, 130, 246, 0.08)',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!notif.is_read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0, boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }} />}
                        <span style={{ fontSize: '14px', fontWeight: notif.is_read ? '700' : '900', color: 'var(--text-dark)' }}>
                          {notif.title}
                        </span>
                      </div>
                    {!notif.is_read && (
                      <button 
                        onClick={(e) => markAsRead(e, notif.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', paddingLeft: notif.is_read ? '0' : '16px' }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: notif.is_read ? '0' : '16px', fontWeight: '500' }}>
                      {formatDate(notif.created_at)}
                    </span>
                </div>
              ))
            )}
          </div>
          
          <div style={{ padding: '8px', borderTop: '1px solid var(--glass-border)', backgroundColor: 'rgba(59, 130, 246, 0.03)', textAlign: 'center' }}>
            <button 
              onClick={() => { 
                setIsOpen(false); 
                const role = user?.role || 'patient';
                navigate(`/${role}/notifications`); 
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', width: '100%', padding: '6px', fontWeight: '700' }}
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
