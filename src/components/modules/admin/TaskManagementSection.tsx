import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, X } from 'lucide-react';
import { Task, TaskPriority } from '../../../types';
import { formatDate } from '../../../lib/formatters';

interface TaskManagementSectionProps {
  tasks: Task[];
  defaultDeadline: string;
  defaultAssignee: string;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export const TaskManagementSection: React.FC<TaskManagementSectionProps> = ({
  tasks,
  defaultDeadline,
  defaultAssignee,
  onToggleTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'critical'>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Logistics');
  const [newTaskDeadline, setNewTaskDeadline] = useState(defaultDeadline);
  const [newTaskAssignee, setNewTaskAssignee] = useState(defaultAssignee);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === 'pending') return !task.isCompleted;
    if (taskFilter === 'completed') return task.isCompleted;
    if (taskFilter === 'critical') return task.priority === 'critical' && !task.isCompleted;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      deadline: newTaskDeadline,
      assignedTo: newTaskAssignee.trim() || 'Coordinator',
      priority: newTaskPriority,
      isCompleted: false,
    });

    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  return (
    <div className="rounded-3xl bg-white border border-[#EAE5E1] p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#C96F4A]" />
          <h3 className="font-serif font-bold text-lg text-[#49372D]">
            Event Milestones & Task Checklist
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {(['all', 'pending', 'critical', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTaskFilter(f)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all ${
                taskFilter === f
                  ? 'bg-[#C96F4A] text-white shadow-sm'
                  : 'bg-stone-100 text-[#6E5548] hover:bg-stone-200'
              }`}
            >
              {f} ({f === 'all' ? tasks.length : tasks.filter((t) => (f === 'pending' ? !t.isCompleted : f === 'completed' ? t.isCompleted : t.priority === 'critical' && !t.isCompleted)).length})
            </button>
          ))}
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF0EB] text-[#C96F4A] border border-[#F5D1BD] font-bold hover:bg-[#F5D1BD] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6E5548] bg-stone-50 rounded-2xl">
            No tasks found matching filter.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                task.isCompleted
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : 'bg-white border-[#EAE5E1] hover:border-[#F5D1BD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => onToggleTask(task.id)}
                  className="w-4 h-4 rounded border-[#EAE5E1] accent-[#C96F4A] cursor-pointer"
                  aria-label={`Toggle task ${task.title}`}
                />
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      task.isCompleted ? 'line-through text-stone-400' : 'text-[#49372D]'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#6E5548] mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-stone-100">{task.category}</span>
                    <span>· Due: {formatDate(task.deadline, 'short')}</span>
                    <span>· Lead: {task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 text-stone-300 hover:text-red-500 rounded"
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E1]">
              <h3 className="font-serif font-bold text-lg text-[#49372D]">Create Operational Task</h3>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1 text-[#6E5548] hover:text-[#49372D] rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#49372D] mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  placeholder="e.g. Confirm generator backup delivery with vendor"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  >
                    <option value="Venue & Setup">Venue & Setup</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor & Styling">Decor & Styling</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#49372D] mb-1">Assigned Lead</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E1] text-xs focus:outline-none focus:border-[#C96F4A]"
                    placeholder="Coordinator Name"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5E1]">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE5E1] text-xs font-semibold text-[#6E5548]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C96F4A] text-white text-xs font-bold shadow-festive hover:bg-[#A8522F]"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

