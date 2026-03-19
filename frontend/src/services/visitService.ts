import { request } from "./apiClient"

export const recordVisit = async (visitData: {
  appointmentId: string
  diagnosis: string
  medicines: string[]
  notes: string
}) => {
  return request("/visit-history/add", {
    method: "POST",
    body: JSON.stringify(visitData),
  })
}

export const getPrescriptionUrl = (visitId: string) => {
  return `http://localhost:8000/api/v1/visit-history/prescription/${visitId}`
}
