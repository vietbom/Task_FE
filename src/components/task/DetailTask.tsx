import React, { useEffect, useState } from "react";
import { CalendarIcon, Plus, Trash2, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../apis/Auth";
import { useTaskStore } from "../../apis/Task";

interface Task {
  id: number;
  titleTask: string;
  description: string;
  note: string[];
  priority: string;
  startDate: string;
  dueDate: string;
  status?: string;
  completed?: boolean;
}

interface DetailTaskProps {
  task: Task;
  onClose: () => void;
}

const DetailTask: React.FC<DetailTaskProps> = ({ task, onClose }) => {
  const { user } = useAuthStore();
  const { addNote, deleteTask, getTask, completedTask} = useTaskStore();
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const navigate = useNavigate();

  const notes = Array.isArray(task.note)
    ? task.note
    : typeof task.note === "string"
    ? [task.note]
    : [];

  const handleDeleteTask = async (taskId: number) => {
    if (!user?.id) return;
    await deleteTask(user.id.toString(), taskId);
    onClose();
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user?.id) return;
    
    try {
      await addNote(user.id.toString(), task.id, newNote);
      await getTask(user.id.toString())
      setNewNote("");
      setIsAddingNote(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

   useEffect(() => {
        if (user?.id) {
            getTask(user.id.toString())
        }
    }, [user, getTask])

    const handleCompletedTask = async() => {
        await completedTask(user.id.toString(), task.id)
        await getTask(user.id.toString())
    }
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{task.titleTask}</h2>
            {task.completed && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Completed
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Description</h3>
            <p className="mt-1 text-gray-600">{task.description || "No description"}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Priority</h3>
            <p className={`mt-1 px-3 py-1 rounded-full border inline-flex items-center ${
              task.priority === "High" ? "border-red-100 bg-red-100 text-red-500" :
              task.priority === "Medium" ? "border-orange-100 bg-orange-100 text-orange-500" : 
              "border-green-100 bg-green-100 text-green-500"
            }`}>
              {task.priority}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CalendarIcon size={16} className="text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Start Date</h3>
                <p className="text-gray-600">{task.startDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarIcon size={16} className="text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-700">Due Date</h3>
                <p className="text-gray-600">{task.dueDate}</p>
              </div>
            </div>
          </div>

          {notes.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Notes:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {isAddingNote && (
            <div className="mt-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="w-full p-2 border rounded-md"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={!newNote.trim()}
                >
                  Add Note
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>

            {!task.completed && (
                <button
                    onClick={() => setIsAddingNote(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                    <Plus size={16} className="mr-1" />
                    Add Note
                </button>
            )}
            <button
                onClick={() => handleCompletedTask()}
                className={`flex items-center px-3 py-1 rounded-md ${
                task.completed 
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <Check size={16} className="mr-1" />
              {task.completed ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;