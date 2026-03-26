import { useState, useEffect, useRef } from "react"
import DoctorLayout from "../../components/layout/doctor/DoctorLayout"
import { 
  Mail, Award, Camera, 
  Loader2, Briefcase, Save, X, Edit3, CheckCircle2,
  GraduationCap, Activity, Star, MessageSquare
} from "lucide-react"


import { getPortalProfile, updatePortalProfile, updatePortalProfileImage } from "../../services/doctorService"
import { reviewService } from "../../services/reviewService"
import { useAuth } from "../../context/AuthContext"
import "../../styles/pages/doctor.css"


const IMAGE_BASE_URL = "http://localhost:8000";

function Profile() {
  const { updateUser } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<any>({})
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await getPortalProfile()
      setProfile(data)
      setFormData(data)
    } catch (err: any) {
      setError(err.message || "Failed to load profile data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile?.doctor_id) {
      const fetchReviews = async () => {
        try {
          setReviewsLoading(true)
          const data = await reviewService.getDoctorReviews(profile.doctor_id)
          setReviews(data)
        } catch (err) {
          console.error("Failed to load reviews")
        } finally {
          setReviewsLoading(false)
        }
      }
      fetchReviews()
    }
  }, [profile?.doctor_id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: Number(formData.experience) || 0,
        qualification: formData.qualification,
        consultation_fee: Number(formData.consultation_fee) || 0,
        about: formData.about
      }
      
      await updatePortalProfile(updatePayload)
      updateUser(updatePayload) // UPDATE AUTH CONTEXT
      setProfile({ ...profile, ...updatePayload })
      setEditMode(false)
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSaving(true)
      setError(null)
      const data = new FormData()
      data.append("file", file)
      
      const res = await updatePortalProfileImage(data)
      setProfile((prev: any) => ({ ...prev, profile_image_url: res.image_url }))
      setFormData((prev: any) => ({ ...prev, profile_image_url: res.image_url }))
      setSuccess("Profile picture updated!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to upload image.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DoctorLayout>
        <div className="pd-loader-full">
          <div className="pd-loader-container">
            <Loader2 className="animate-spin" size={48} color="#0dcb6e" />
            <p>Gathering your credentials...</p>
          </div>
        </div>
      </DoctorLayout>
    )
  }

  const initials = (profile?.name || "D").split(" ").map((n: any) => n[0]).join("").toUpperCase().substring(0, 2);
  const displayName = profile?.name ? (profile.name.startsWith('Dr.') ? profile.name : `Dr. ${profile.name}`) : "Doctor";

  return (
    <DoctorLayout>
      <div className="pd-profile-view">
        
        {/* Profile Hero / Header */}
        <div className="pd-profile-hero">
          <div className="pd-profile-banner">
             <div className="pd-banner-overlay" />
          </div>
          
          <div className="pd-hero-content">
            <div className="pd-hero-avatar-wrap">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url.startsWith('http') ? profile.profile_image_url : `${IMAGE_BASE_URL}${profile.profile_image_url}`}
                  alt={profile?.name}
                  className="pd-hero-avatar"
                />
              ) : (
                <div className="pd-hero-avatar">{initials}</div>
              )}
              <button className="pd-avatar-trigger" onClick={handleImageClick} style={{ bottom: '10px', right: '10px' }}>
                <Camera size={20} />
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="pd-hero-details">
              {!editMode ? (
                <>
                  <h1 className="pd-hero-name">{displayName}</h1>
                  <div className="pd-hero-tags">
                    <div className="pd-hero-tag">
                      <Award size={16} />
                      <span>{profile?.specialization || "Physician"}</span>
                    </div>
                    <div className="pd-hero-tag" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#d97706' }}>
                      <Star size={16} fill="#d97706" />
                      <span>{profile?.average_rating || "5.0"} Reviews</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pd-hero-edit-group" style={{ animation: 'fadeIn 0.3s' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Professional Name</label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      style={{ fontSize: '1.8rem', fontWeight: 900, width: '100%', marginBottom: '4px', background: 'transparent', border: 'none', borderBottom: '2px solid #10b981', outline: 'none', color: '#1e293b' }}
                      placeholder="Doctor Name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 120px', gap: '15px' }}>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Specialization</label>
                      <input name="specialization" value={formData.specialization} onChange={handleInputChange} className="pd-input-premium-small" style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff' }} placeholder="Specialization" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>Exp (Yrs)</label>
                      <input name="experience" type="number" value={formData.experience} onChange={handleInputChange} className="pd-input-premium-small" style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff' }} placeholder="Exp" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pd-hero-actions">
              {!editMode ? (
                <button className="pd-btn-premium pd-btn-edit-premium" onClick={() => setEditMode(true)}>
                  <Edit3 size={18} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="pd-btn-premium" style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700 }} onClick={() => { setEditMode(false); setFormData(profile); }}>
                    <X size={18} /> Cancel
                  </button>
                  <button className="pd-btn-premium" onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {(error || success) && (
          <div style={{ padding: '0 10px' }}>
            {error && <div className="pd-alert pd-alert-error" style={{ borderRadius: '16px' }}><Activity size={20} /> <p>{error}</p></div>}
            {success && <div className="pd-alert pd-alert-success" style={{ borderRadius: '16px' }}><CheckCircle2 size={20} /> <p>{success}</p></div>}
          </div>
        )}

        <div className="pd-profile-main-grid">
          
          {/* Left: Contact & Experience */}
          <div className="pd-metas-flex">
            <div className="pd-profile-section-card">
              <div className="pd-section-header-premium">
                <div className="pd-icon-circle-premium"><Mail size={22} /></div>
                <h3>Contact Verification</h3>
              </div>
              <div className="pd-contact-list-vertical">
                <div className="pd-contact-item-vertical">
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Professional Email</label>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>{profile?.email}</p>
                </div>
                <div className="pd-contact-item-vertical" style={{ marginTop: '20px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Direct Contact</label>
                  {editMode ? (
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="pd-input-premium" style={{ marginTop: '5px', width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                  ) : (
                    <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1e293b' }}>{profile?.phone || "Private"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pd-profile-section-card">
              <div className="pd-section-header-premium">
                <div className="pd-icon-circle-premium"><Briefcase size={22} /></div>
                <h3>Clinical Practice</h3>
              </div>
              <div className="pd-metas-flex" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="pd-meta-card-premium">
                    <div className="pd-meta-icon-alt"><Award size={24} /></div>
                    <div className="pd-meta-body-alt">
                      <h4>Consultation Fee</h4>
                      {editMode ? (
                        <input name="consultation_fee" type="number" value={formData.consultation_fee} onChange={handleInputChange} className="pd-input-premium-small" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }} />
                      ) : (
                        <p>₹{profile?.consultation_fee || "500"} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/ session</span></p>
                      )}
                    </div>
                  </div>
                  <div className="pd-meta-card-premium">
                    <div className="pd-meta-icon-alt"><GraduationCap size={24} /></div>
                    <div className="pd-meta-body-alt">
                      <h4>Credentials</h4>
                      {editMode ? (
                        <input name="qualification" value={formData.qualification} onChange={handleInputChange} className="pd-input-premium-small" style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px' }} />
                      ) : (
                        <p>{profile?.qualification || "Verified"}</p>
                      )}
                    </div>
                  </div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Feedback */}
          <div className="pd-metas-flex">
            <div className="pd-profile-section-card">
              <div className="pd-section-header-premium">
                <div className="pd-icon-circle-premium"><Activity size={22} /></div>
                <h3>Professional Summary</h3>
              </div>
              {editMode ? (
                 <textarea 
                  name="about" 
                  value={formData.about} 
                  onChange={handleInputChange} 
                  className="pd-textarea-premium" 
                  rows={8}
                  style={{ width: '100%', borderRadius: '16px', padding: '15px', border: '1.5px solid #e2e8f0', fontFamily: 'inherit' }}
                />
              ) : (
                <div className="pd-summary-box">
                  {profile?.about || "A brief introduction about your medical expertise and philosophy..."}
                </div>
              )}
            </div>

            <div className="pd-profile-section-card">
              <div className="pd-section-header-premium">
                <div className="pd-icon-circle-premium" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}><Star size={22} /></div>
                <h3>Patient Experiences</h3>
              </div>
              <div className="pd-reviews-list">
                {reviewsLoading ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Processing history...</p>
                ) : reviews.length > 0 ? (
                  reviews.slice(0, 3).map((rev) => (
                    <div key={rev.id} style={{ padding: '20px', background: '#f8fafc', borderRadius: '20px', marginBottom: '15px', border: '1px solid #eef2f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= rev.rating ? "#fbbf24" : "none"} color="#fbbf24" strokeWidth={s <= rev.rating ? 0 : 2} />)}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontStyle: 'italic' }}>"{rev.comment}"</p>
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>— {rev.patient_name || "Verified Patient"}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p>No verified feedback yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </DoctorLayout>
  )
}

export default Profile
