import { create } from 'zustand'
import config from '../config/config'

const useUserStore = create((set) => ({
  credits: 0,
  setCredits: (credits) => set({ credits }),
  
  // Fetch user data from API
  fetchUserData: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${config.active.apiUrl}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        set({ credits: data.credits })
        return data
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  },

  // Update credits
  updateCredits: async (newCredits) => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const response = await fetch(`${config.active.apiUrl}/api/credits/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credits: newCredits })
      })

      if (response.ok) {
        set({ credits: newCredits })
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating credits:', error)
      return false
    }
  }
}))

export default useUserStore 