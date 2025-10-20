import React, { useState, useEffect } from 'react';
import { Deal } from '../../types';
import { Plus, Check, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { getSupabaseService } from '../../services/supabaseService';
import { logError, handleAPIError } from '../../utils/errorHandling';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  dealId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DealDetailTasksProps {
  deal: Deal;
}

export const DealDetailTasks: React.FC<DealDetailTasksProps> = ({ deal }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  useEffect(() => {
    loadTasks();
  }, [deal.id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseService();
      const taskData = await supabase.getTasks(deal.id);
      setTasks(taskData);
    } catch (err) {
      const appError = handleAPIError(err, 'load-tasks');
      logError(appError, 'DealDetailTasks load');
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      setSaving(true);
      const supabase = getSupabaseService();

      const taskData = {
        title: newTask.title,
        ...(newTask.description && { description: newTask.description }),
        ...(newTask.dueDate && { dueDate: new Date(newTask.dueDate) }),
        priority: newTask.priority,
        status: 'pending' as const,
        dealId: deal.id,
      };

      const createdTask = await supabase.createTask(taskData);
      setTasks(prev => [...prev, createdTask]);

      // Reset form
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (err) {
      const appError = handleAPIError(err, 'create-task');
      logError(appError, 'DealDetailTasks create');
      setError('Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const supabase = getSupabaseService();
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

      await supabase.updateTask(taskId, { status: newStatus });

      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      const appError = handleAPIError(err, 'update-task');
      logError(appError, 'DealDetailTasks toggle');
      setError('Failed to update task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const isOverdue = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks & Follow-ups</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add New Task</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Description
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="E.g., Call client to discuss proposal"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Additional details..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={saving || !newTask.title.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <Check className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No tasks yet</h4>
            <p className="text-gray-500 dark:text-gray-400">Create your first task to get started with follow-ups.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                task.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="h-4 w-4 text-blue-600 rounded dark:bg-gray-600 mr-3"
                  />
                  <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              {task.description && (
                <p className={`text-sm mb-2 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  {task.dueDate && (
                    <>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className={isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                        {isOverdue(task.dueDate) && task.status !== 'completed' && ' (Overdue)'}
                      </span>
                    </>
                  )}
                </div>
                <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};