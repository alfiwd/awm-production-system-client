import { ref } from 'vue'
import { defineStore } from 'pinia'

export const roleStore = defineStore('role', () => {
  const role = ref(null)

  const setRole = (value) => {
    role.value = value
  }

  return { role, setRole }
})
