import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import './TaskForm.css';

export default function EditTaskForm({ task, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    tags: (task.tags || []).join(', '),
    due_date: task.due_date ? task.due_date.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      due_date: formData.due_date || null,
    });
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
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

          <div className="form-group">
            <label htmlFor="edit-description" className="input-label">Description</label>
            <textarea
              id="edit-description"
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
              <label htmlFor="edit-priority" className="input-label">Priority</label>
              <select id="edit-priority" name="priority" value={formData.priority} onChange={handleChange} className="select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-status" className="input-label">Status</label>
              <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className="select">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-tags" className="input-label">Tags (comma separated)</label>
              <input
                id="edit-tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="work, urgent, meeting"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-due_date" className="input-label">Due Date</label>
              <input
                id="edit-due_date"
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
