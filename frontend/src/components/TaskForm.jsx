import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { useTasks } from '../contexts/TasksContext';
import Alert from './Alert';
import './TaskForm.css';

export default function TaskForm({ onSubmit, onClose }) {
  const { getSuggestions } = useTasks();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    tags: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      due_date: formData.due_date || null,
    };
    
    await onSubmit(taskData);
    setLoading(false);
  };

  const handleAiSuggest = async () => {
    if (!formData.title) return;
    
    setAiLoading(true);
    setAiSuggestion('');
    setShowSuggestion(true);
    
    const result = await getSuggestions(
      formData.title,
      formData.description,
      formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    );
    
    if (result.success) {
      setAiSuggestion(result.data.result);
    }
    setAiLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-header-actions">
            <Input
              label="Task Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={handleAiSuggest}
              loading={aiLoading}
              className="ai-suggest-btn"
              disabled={!formData.title}
            >
              ✨ AI Suggest
            </Button>
          </div>

          {showSuggestion && aiSuggestion && (
            <Alert variant="info" onClose={() => setShowSuggestion(false)}>
              <div className="ai-suggestion">
                <strong>AI Suggestion:</strong>
                <p>{aiSuggestion}</p>
              </div>
            </Alert>
          )}

          <div className="form-group">
            <label htmlFor="description" className="input-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about this task..."
              className="textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="input-label">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="input-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags" className="input-label">Tags (comma separated)</label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="work, urgent, meeting"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="due_date" className="input-label">Due Date</label>
              <input
                id="due_date"
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
