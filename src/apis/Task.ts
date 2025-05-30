import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export interface Task {
  id?: string
  titleTask: string | null
  description: string | null
  note: string[]
  priority: string | null
  startDate: string | Date
  dueDate: string | Date
  status?: string
  completed?: boolean
  userId?: string
}

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  loading: boolean
  error: string | null

  clearError: () => void
  createTask: (userId: string, data: Task) => Promise<void>
  getTask: (userId: string) => Promise<void>
  deleteTask: (userId: string, taskId: string) => Promise<void>
  addNote: (userId: string, taskId: number, note: string) => Promise<void>
  completedTask: (userId: string, taskId: number) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  createTask: async (userId, data) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.post(`/task/createTask/${userId}`, data)
      set((state) => ({
        tasks: [...state.tasks, res.data.task],
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Lỗi tạo task", loading: false })
    }
  },

  getTask: async (userId) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.get(`/task/getTask/${userId}`)
      console.log('Tasks nhận được:', res.data)
      set({ tasks: res.data.tasks, loading: false })
    } catch (error: any) {
      console.error("Lỗi getTask:", error)
      set({ error: error.response?.data?.message || "Lỗi lấy task", loading: false })
    }
  },


  deleteTask: async (userId, taskId) => {
    set({ loading: true })
    try {
      await axiosInstance.delete(`/task/delTask/${userId}/${taskId}`)
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Lỗi xóa task", loading: false })
    }
  },

  addNote: async (userId: string, taskId: number, note: string) => {
    set({loading: true})
    try {
      const res = await axiosInstance.post(`/task/noteTask/${userId}/${taskId}`, {note})
      set((state) => ({
        tasks: [...state.tasks, res.data.task],
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Lỗi thêm note vào task", loading: false })
    }
  },

  completedTask: async (userId: string, taskId: number) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.post(`/task/completedTask/${userId}/${taskId}`)
      set((state) => ({
        tasks: [...state.tasks, res.data.task],
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Lỗi xóa task", loading: false })
    }
  },

}))
