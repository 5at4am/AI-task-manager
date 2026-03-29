import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    stats, 
    addTask, 
    toggleTaskComplete, 
    deleteTask, 
    clearError,
    getSummary,
  } = useTasks();
  
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleAddTask = async (taskData) => {
    const result = await addTask(taskData);
    if (result.success) {
      setShowForm(false);
    }
  };

  const handleToggleTask = async (id, status) => {
    await toggleTaskComplete(id);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const handleAiSummary = async () => {
    setSummaryLoading(true);
    setShowSummary(true);
    const result = await getSummary();
    if (result.success) {
      setSummary(result.data.result);
    }
    setSummaryLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') return task.status === 'done';
    if (filter === 'todo') return task.status === 'todo';
    if (filter === 'in_progress') return task.status === 'in_progress';
    return true;
  });

  if (loading && tasks.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Hello, {user?.name} 👋</h1>
              <p className="dashboard-subtitle">
                {stats.todo} to do • {stats.in_progress} in progress • {stats.done} done
              </p>
            </div>
            <div className="header-actions">
              <Button 
                variant="secondary" 
                onClick={handleAiSummary}
                loading={summaryLoading}
                disabled={tasks.length === 0}
              >
                ✨ AI Summary
              </Button>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
                className="add-task-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </Button>
            </div>
          </div>

          {/* AI Summary */}
          {showSummary && (
            <Alert variant="info" onClose={() => setShowSummary(false)}>
              <div className="ai-summary">
                <strong>📊 Task Summary:</strong>
                <p>{summary || 'Generating summary...'}</p>
              </div>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="stats-grid">
            <Card className="stat-card stat-total">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </Card>
            <Card className="stat-card stat-todo">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value">{stats.todo}</span>
                <span className="stat-label">To Do</span>
              </div>
            </Card>
            <Card className="stat-card stat-in-progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <span className="stat-value">{stats.in_progress}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </Card>
            <Card className="stat-card stat-done">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-value">{stats.done}</span>
                <span className="stat-label">Done</span>
              </div>
            </Card>
          </div>

          {/* Tasks Section */}
          <Card className="tasks-card">
            <div className="tasks-header">
              <h2 className="tasks-title">Your Tasks</h2>
              <div className="tasks-filter">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
                  onClick={() => setFilter('todo')}
                >
                  To Do
                </button>
                <button
                  className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setFilter('in_progress')}
                >
                  In Progress
                </button>
                <button
                  className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
                  onClick={() => setFilter('done')}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="tasks-list">
              {filteredTasks.length === 0 ? (
                <div className="tasks-empty">
                  <div className="empty-icon">📝</div>
                  <h3 className="empty-title">
                    {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
                  </h3>
                  <p className="empty-text">
                    {filter === 'all' 
                      ? 'Create your first task to get started!' 
                      : `You don't have any ${filter.replace('_', ' ')} tasks.`}
                  </p>
                  {filter === 'all' && (
                    <Button variant="primary" onClick={() => setShowForm(true)}>
                      Create Task
                    </Button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => handleToggleTask(task.id, task.status)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Add Task Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
