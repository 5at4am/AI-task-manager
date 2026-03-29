import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI, aiAPI } from '../services/api';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    tags: null,
    sortBy: 'created_at',
    order: 'desc',
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.tags) params.tags = filters.tags;
      params.sort_by = filters.sortBy;
      params.order = filters.order;
      
      const response = await tasksAPI.getAll(params);
      setTasks(Array.isArray(response) ? response : (response.tasks || []));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.response?.data?.detail || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = await tasksAPI.create(taskData);
      setTasks((prev) => [...prev, newTask]);
      setError(null);
      return { success: true, task: newTask };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    try {
      const updatedTask = await tasksAPI.update(id, updates);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
      setError(null);
      return { success: true, task: updatedTask };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const toggleTaskComplete = useCallback(async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      const updatedTask = await tasksAPI.toggleComplete(id, task?.status);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      setError(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setTaskFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // AI Functions
  const getSuggestions = useCallback(async (title, description, tags, provider = 'groq') => {
    try {
      const result = await aiAPI.suggest(title, description, tags, provider);
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to get suggestions' 
      };
    }
  }, []);

  const getSummary = useCallback(async (taskIds = null, provider = 'groq') => {
    try {
      const result = await aiAPI.summarize(taskIds, provider);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Failed to get summary' };
    }
  }, []);

  const getPrioritized = useCallback(async (taskIds = null, provider = 'groq') => {
    try {
      const result = await aiAPI.prioritize(taskIds, provider);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Failed to prioritize tasks' };
    }
  }, []);

  const getBreakdown = useCallback(async (title, description = null, provider = 'groq') => {
    try {
      const result = await aiAPI.breakdown(title, description, provider);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Failed to break down task' };
    }
  }, []);

  // Get filtered tasks
  const getTasksByStatus = useCallback(
    (status) => {
      if (status === 'done') return tasks.filter((t) => t.status === 'done');
      if (status === 'todo') return tasks.filter((t) => t.status === 'todo');
      if (status === 'in_progress') return tasks.filter((t) => t.status === 'in_progress');
      return tasks;
    },
    [tasks]
  );

  // Get task stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const value = {
    tasks,
    loading,
    error,
    stats,
    filters,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByStatus,
    clearError,
    setTaskFilters,
    getSuggestions,
    getSummary,
    getPrioritized,
    getBreakdown,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
