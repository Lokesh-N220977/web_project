import DoctorLayout from "../../components/layout/doctor/DoctorLayout"
import { Search, PlusCircle, Download, Calendar, Pill, X, CheckCircle, Clock, Loader2, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { 
    getPortalProfile, 
    getIssuedPrescriptions, 
    issuePrescription, 
    getDoctorPatients 
} from "../../services/doctorService"

function Prescriptions() {
  const [prescList, setPrescList] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [viewPrescModal, setViewPrescModal] = useState(false)
  const [selectedPresc, setSelectedPresc] = useState<any>(null)
  const [patientSearch, setPatientSearch] = useState("")
  const [showPatientList, setShowPatientList] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const location = useLocation()

  const [medicines, setMedicines] = useState<any[]>([
    { id: Date.now(), medicine: "", strength: "", dosage: "", frequency: "Daily", duration: "", instructions: "" }
  ])

  useEffect(() => {
    const initData = async () => {
      setLoading(true)
      try {
        const prof = await getPortalProfile()
        setProfile(prof)
        
        if (prof?.doctor_id) {
          const [prescs, pats] = await Promise.all([
            getIssuedPrescriptions(prof.doctor_id),
            getDoctorPatients(prof.doctor_id)
          ])
          setPrescList(prescs || [])
          setPatients(pats || [])
        }
      } catch (err) {
        console.error("Failed to load prescriptions data:", err)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [])

  // Handle incoming state from Dashboard
  useEffect(() => {
    if (location.state?.openForm) {
      setShowNewForm(true)
    }
  }, [location.state])

  const openViewModal = (presc: any) => {
    setSelectedPresc(presc)
    setViewPrescModal(true)
  }

  const handleDownload = (prescId: string) => {
    window.open(`/api/v1/prescriptions/${prescId}/download`, '_blank');
  }

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient)
    setPatientSearch(patient.name)
    setShowPatientList(false)
  }

  const addMedicineRow = () => {
    setMedicines([...medicines, { id: Date.now(), medicine: "", strength: "", dosage: "", frequency: "Daily", duration: "", instructions: "" }])
  }

  const removeMedicineRow = (id: number) => {
    if (medicines.length > 1) {
       setMedicines(medicines.filter(m => m.id !== id))
    }
  }

  const updateMedicine = (id: number, field: string, value: string) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleAddPrescription = async () => {
    if (!selectedPatient || medicines.some(m => !m.medicine || !m.dosage)) {
      return alert("Please select a patient and provide complete medicine details for all entries.")
    }

    setIsSubmitting(true)
    try {
      const payload = {
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        doctor_id: profile.doctor_id,
        doctor_name: profile.name,
        medicines: medicines.map(({ id, ...rest }) => rest), // Remove local UI id
        // Fallback fields (use first medicine for backward compatibility if needed)
        medicine: medicines[0].medicine,
        strength: medicines[0].strength,
        dosage: medicines[0].dosage,
        frequency: medicines[0].frequency,
        duration: medicines[0].duration,
        instructions: medicines[0].instructions
      }

      const res = await issuePrescription(payload)
      
      if (res) {
        // Success Animation & State Update
        const updatedList = await getIssuedPrescriptions(profile.doctor_id)
        setPrescList(updatedList)
        setShowNewForm(false)
        setMedicines([{ id: Date.now(), medicine: "", strength: "", dosage: "", frequency: "Daily", duration: "", instructions: "" }])
        setSelectedPatient(null)
        setPatientSearch("")
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      alert("Failed to issue prescription. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DoctorLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <Loader2 className="animate-spin" size={48} color="#0dcb6e" />
        </div>
      </DoctorLayout>
    )
  }

  return (
    <DoctorLayout>
      <div className="pd-page">
        <div className="pd-header">
          <div className="pd-header-content">
            <h1 className="pd-page-title">Digital Prescription Hub</h1>
            <p className="pd-page-sub">Directly issue pharmacological orders to patient records.</p>
          </div>
          <div className="pd-header-actions">
            <button
              className="pd-action-btn-primary"
              onClick={() => setShowNewForm(true)}
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}
            >
              <PlusCircle size={20} />
              <span>Issue New Order</span>
            </button>
          </div>
        </div>

        {/* Prescription Cards Grid */}
        <div className="pd-prescriptions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginTop: '30px', minHeight: '200px' }}>
          {!prescList || prescList.length === 0 ? (
            <div className="pd-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: 'rgba(248, 250, 252, 0.8)', border: '2px dashed #cbd5e1', borderRadius: '24px' }}>
               <Pill size={64} style={{ margin: '0 auto 16px', color: '#94a3b8', opacity: 0.5 }} />
               <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#475569' }}>No prescriptions issued yet</h3>
               <p style={{ color: '#64748b', maxWidth: '400px', margin: '8px auto' }}>Start by clicking the "Issue New Order" button to provide clinical medication guidance to your patients.</p>
            </div>
          ) : prescList.map((presc) => (
            <div key={presc.id} className="pd-presc-card">
              <div style={{ 
                height: '6px', 
                background: presc.status === 'Active' ? 'linear-gradient(90deg, #10b981, #3b82f6)' : '#cbd5e1' 
              }} />
              
              <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.3px' }}>{presc.patient_name || "Unknown Patient"}</h3>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Reg ID: {String(presc.patient_id || "").substring(0,8)}</p>
                    </div>
                  </div>
                  <span className={`pd-presc-status-badge ${presc.status === 'Active' ? 'active' : 'completed'}`}>
                    {presc.status}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1.5px solid #f1f5f9' }}>
                   {presc.medicines && presc.medicines.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {presc.medicines.slice(0, 2).map((med, idx) => (
                           <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                <Pill size={12} />
                              </div>
                              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{med.medicine}</span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{med.dosage}</span>
                           </div>
                        ))}
                        {presc.medicines.length > 2 && (
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginLeft: '34px' }}>
                            + {presc.medicines.length - 2} more medications
                          </div>
                        )}
                      </div>
                   ) : (
                    <>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                          <Pill size={16} />
                        </div>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{presc.medicine}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#fff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{presc.strength}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dosage Protocol</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {presc.dosage}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{presc.duration}</span>
                        </div>
                      </div>
                    </>
                   )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                     <Calendar size={14} />
                     <span>{presc.date}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '12px' }}>
                     <button 
                        className="pd-action-icon-btn" 
                        title="Download Document"
                        style={{ width: '40px', height: '40px', borderRadius: '12px', border: '2px solid #f1f5f9' }}
                        onClick={(e) => { e.stopPropagation(); handleDownload(presc.id); }}
                     >
                       <Download size={18} />
                     </button>
                     <button 
                        onClick={() => openViewModal(presc)}
                        style={{ padding: '10px 24px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 15px rgba(30, 41, 59, 0.15)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#0f172a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1e293b'; }}
                     >
                       OPEN
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Multi-Medicine Prescription Form */}
        {showNewForm && (
          <div className="pd-modal-overlay">
            <div className="pd-modal" style={{ maxWidth: '700px', width: '90%', padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
              <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff', padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Prescription Editor</h3>
                   <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Multi-drug Pharmacological Authorization</p>
                </div>
                <button 
                  onClick={() => setShowNewForm(false)} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', padding: '8px', borderRadius: '50%', display: 'flex' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '30px', maxHeight: '75vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Patient Selection Segment */}
                  <div style={{ paddingBottom: '25px', borderBottom: '1.5px solid #f1f5f9' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Target Patient</label>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search by name or medical ID..."
                        style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s', background: '#f8fafc' }}
                        value={patientSearch}
                        onChange={(e) => {
                          setPatientSearch(e.target.value)
                          setShowPatientList(true)
                        }}
                      />
                      {selectedPatient && !showPatientList && (
                         <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: '#ecfdf5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <CheckCircle size={14}/> Selected
                         </div>
                      )}
                    </div>
                    
                    {showPatientList && (
                      <div style={{ marginTop: '8px', maxHeight: '200px', overflowY: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', position: 'absolute', width: 'calc(100% - 60px)', zIndex: 100, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        {Array.isArray(patients) && patients.length > 0 ? (
                          patients.filter(p => !patientSearch || (p.name && p.name.toLowerCase().includes(patientSearch.toLowerCase()))).map((p, i) => (
                            <div
                              key={i}
                              style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}
                              onClick={() => handleSelectPatient(p)}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                            >
                              <div style={{ fontWeight: 800, color: '#1e293b' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ID: {p.id} • {p.age} Yrs</div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No matching records found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Medications List Segment */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                       <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Clinical Medication Protocol</label>
                       <button onClick={addMedicineRow} style={{ color: '#3b82f6', background: '#eff6ff', border: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <PlusCircle size={14} /> Add Drug
                       </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {medicines.map((med, index) => (
                        <div key={med.id} style={{ padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1.5px solid #e2e8f0', position: 'relative', animation: 'fadeIn 0.3s' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <span style={{ width: '28px', height: '28px', background: '#1e293b', color: '#fff', borderRadius: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{index + 1}</span>
                               <span style={{ fontWeight: 800, color: '#475569', fontSize: '0.9rem' }}>Medicine Entry</span>
                             </div>
                             {medicines.length > 1 && (
                               <button onClick={() => removeMedicineRow(med.id)} style={{ color: '#f43f5e', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={18} /></button>
                             )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                              <input 
                                type="text" placeholder="Compound / Brand Name" 
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                value={med.medicine} onChange={(e) => updateMedicine(med.id, 'medicine', e.target.value)} 
                              />
                            </div>
                            <div>
                               <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Strength</label>
                               <input 
                                type="text" placeholder="e.g. 500 MG" 
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                value={med.strength} onChange={(e) => updateMedicine(med.id, 'strength', e.target.value)} 
                              />
                            </div>
                            <div>
                               <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Dosage Protocol</label>
                               <input 
                                type="text" placeholder="e.g. 1-0-1" 
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                value={med.dosage} onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)} 
                              />
                            </div>
                            <div>
                               <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Frequency</label>
                               <select 
                                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                                  value={med.frequency} onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                               >
                                  <option value="Daily">Daily</option>
                                  <option value="Twice Daily">Twice Daily (BID)</option>
                                  <option value="Thrice Daily">Thrice Daily (TID)</option>
                                  <option value="Every 4 Hours">Every 4 Hours</option>
                                  <option value="Before Bed">Before Bed</option>
                                  <option value="SOS">SOS (As Needed)</option>
                               </select>
                            </div>
                            <div>
                               <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Course Duration</label>
                               <input 
                                type="text" placeholder="e.g. 7 Days" 
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                value={med.duration} onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)} 
                              />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                               <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Specific Guidance</label>
                               <textarea 
                                placeholder="Consumption notes (e.g. After meals)..." 
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', height: '60px', resize: 'none' }}
                                value={med.instructions} onChange={(e) => updateMedicine(med.id, 'instructions', e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '25px 30px', background: '#f8fafc', display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => setShowNewForm(false)} 
                  style={{ flex: 1, padding: '16px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', color: '#64748b', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}
                >
                  Discard Draft
                </button>
                <button 
                  onClick={handleAddPrescription} disabled={isSubmitting}
                  style={{ flex: 2.5, padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '14px', color: '#ffffff', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 15px rgba(16, 185, 129, 0.2)' }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Authorize & Issue Prescription</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Prescription Modal */}
      {viewPrescModal && selectedPresc && (
        <div className="pd-modal-overlay-premium">
          <div className="pd-premium-modal" style={{ maxWidth: '650px', width: '90%', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                   <div style={{ width: '32px', height: '4px', borderRadius: '10px', background: '#10b981' }}></div>
                   <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>Electronic Health Record</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>Official Prescription</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Authorized by Dr. {selectedPresc.doctor_name}</p>
              </div>
              <button 
                onClick={() => setViewPrescModal(false)} 
                style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9', padding: '10px', borderRadius: '14px', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.3s' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ border: '2.5px solid #f1f5f9', borderRadius: '28px', padding: '35px', position: 'relative', overflow: 'hidden', background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Patient</label>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 900, fontSize: '1.2rem', color: '#1e293b' }}>{selectedPresc.patient_name}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Issue Date</label>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 800, color: '#1e293b' }}>{selectedPresc.date}</p>
                  </div>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Prescribed Medication(s)</label>
                  
                  {selectedPresc.medicines && selectedPresc.medicines.length > 0 ? (
                    selectedPresc.medicines.map((med, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', background: '#fff', color: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                <Pill size={16} />
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{med.medicine}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#fff', color: '#64748b', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{med.strength}</span>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                              <Clock size={14} /> {med.dosage}
                           </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'flex', gap: '20px' }}>
                           <span>Duration: <strong style={{color: '#1e293b'}}>{med.duration}</strong></span>
                           <span>Frequency: <strong style={{color: '#1e293b'}}>{med.frequency}</strong></span>
                        </div>
                        {med.instructions && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0', fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                             "{med.instructions}"
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '18px', border: '1.5px solid #f1f5f9' }}>
                       <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                          <Pill size={16} color="#3b82f6" />
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{selectedPresc.medicine}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>{selectedPresc.strength}</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Dosage: {selectedPresc.dosage} • Duration: {selectedPresc.duration}</p>
                    </div>
                  )}
               </div>

               {selectedPresc.instructions && !selectedPresc.medicines?.length && (
                 <div style={{ marginTop: '25px', background: '#fffbeb', padding: '20px', borderRadius: '18px', border: '1.5px solid #fef3c7' }}>
                    <label style={{ display: 'block', color: '#d97706', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Genereal Guidance</label>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#92400e', lineHeight: 1.5, fontWeight: 500 }}>{selectedPresc.instructions}</p>
                 </div>
               )}
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button 
                className="pd-action-btn-secondary" 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', fontWeight: 800 }} 
                onClick={() => setViewPrescModal(false)}
              >
                Close Record
              </button>
              <button 
                className="pd-action-btn-primary" 
                style={{ flex: 1.5, padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', fontWeight: 900, boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)' }} 
                onClick={() => handleDownload(selectedPresc?.id)}
              >
                <Download size={20} /> Generate Medical PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  )
}

export default Prescriptions
