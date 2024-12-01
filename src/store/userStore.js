import { create } from 'zustand'

const useUserStore = create((set) => ({
  credits: 0,
  setCredits: (credits) => set({ credits }),
  
  // Fetch user data from API
  fetchUserData: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('http://localhost:5000/api/auth/user', {
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
    if (!token) return

    try {
      const response = await fetch('http://localhost:5000/api/credits/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credits: newCredits })
      })

      if (response.ok) {
        set({ credits: newCredits })
      }
    } catch (error) {
      console.error('Error updating credits:', error)
    }
  }
}))

export default useUserStore 