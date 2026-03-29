import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import EditTaskForm from '../components/EditTaskForm';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    stats, 
    addTask,
    updateTask,
    toggleTaskComplete, 
    deleteTask, 
    clearError,
    getSummary,
    getPrioritized,
  } = useTasks();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [priorityList, setPriorityList] = useState(null);
  const [priorityLoading, setPriorityLoading] = useState(false);

  const handleAddTask = async (taskData) => {
    const result = await addTask(taskData);
    if (result.success) setShowForm(false);
  };

  const handleEditTask = async (taskData) => {
    const result = await updateTask(editingTask.id, taskData);
    if (result.success) setEditingTask(null);
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
    setPriorityList(null);
    const result = await getSummary();
    if (result.success) setSummary(result.data.result);
    setSummaryLoading(false);
  };

  const handleAiPrioritize = async () => {
    setPriorityLoading(true);
    setPriorityList(null);
    setShowSummary(false);
    const result = await getPrioritized();
    if (result.success) setPriorityList(result.data.tasks);
    setPriorityLoading(false);
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
                onClick={handleAiPrioritize}
                loading={priorityLoading}
                disabled={tasks.length === 0}
              >
                🎯 Prioritize
              </Button>
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

          {/* AI Prioritization */}
          {priorityList && (
            <Alert variant="info" onClose={() => setPriorityList(null)}>
              <strong>🎯 AI Priority Ranking:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {priorityList.map((t) => (
                  <li key={t.id || t.rank} style={{ fontSize: '0.875rem' }}>
                    <span style={{
                      fontWeight: 600,
                      color: t.urgency === 'HIGH' ? '#991b1b' : t.urgency === 'MEDIUM' ? '#92400e' : '#166534',
                      marginRight: '0.4rem',
                    }}>
                      [{t.urgency}]
                    </span>
                    <strong>{t.title}</strong> — {t.reasoning}
                  </li>
                ))}
              </ol>
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
                    onEdit={() => setEditingTask(task)}
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

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
