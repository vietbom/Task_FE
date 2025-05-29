import React, { useEffect, useState } from "react"
import { useTaskStore } from "../../apis/Task"
import { useAuthStore } from "../../apis/Auth"
import { X, Plus, Trash2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { format, parseISO } from "date-fns"

interface Note {
  id: string
  content: string
}

const AddTask: React.FC = () => {
  const { createTask } = useTaskStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const dateParam = params.get("date")
    if (dateParam) {
      setFormData(prev => ({
        ...prev,
        startDate: dateParam,
        dueDate: dateParam
      }))
    }
  }, [location.search])
  
  const [formData, setFormData] = useState({
    titleTask: "",
    description: "",
    priority: "Low",
    startDate: "",
    dueDate: ""
  })
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAddNote = () => {
  const trimmedNote = currentNote.trim()
  if (trimmedNote) {
    setNotes([...notes, { id: Date.now().toString(), content: trimmedNote }])
    setCurrentNote("")
  }
}
  const handleRemoveNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.titleTask.trim()) {
      newErrors.titleTask = "Title is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    } else if (formData.startDate && formData.dueDate < formData.startDate) {
      newErrors.dueDate = "Due date cannot be before start date"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user?.id) return

    createTask(user.id.toString(), {
      ...formData,
      startDate: format(parseISO(formData.startDate), "dd-MM-yyyy"),
      dueDate: format(parseISO(formData.dueDate), "dd-MM-yyyy"),
      note: [...notes.map(note => note.content), ...(currentNote.trim() ? [currentNote.trim()] : [])]
    })

    // Reset form
    setFormData({
      titleTask: "",
      description: "",
      priority: "Low",
      startDate: "",
      dueDate: ""
    })
    setNotes([])
    setCurrentNote("")
    
    navigate(-1)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
        <button
          onClick={handleBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="titleTask" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="titleTask"
            name="titleTask"
            value={formData.titleTask}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.titleTask ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter task title"
          />
          {errors.titleTask && (
            <p className="mt-1 text-sm text-red-500">{errors.titleTask}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <div className="space-y-2">
            {notes.map(note => (
              <div key={note.id} className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {note.content}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a note"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                aria-label="Add note"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low" className="text-green-600 font-medium">Low</option>
            <option value="Medium" className="text-yellow-600 font-medium">Medium</option>
            <option value="High" className="text-red-600 font-medium">High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Task
        </button>
      </form>
    </div>
  )
}

export default AddTask