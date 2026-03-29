import { useState } from 'react';
import './TaskItem.css';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeleting(true);
      await onDelete();
    }
  };

  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  return (
    <div className={`task-item ${task.status === 'done' ? 'completed' : ''} ${deleting ? 'deleting' : ''}`}>
      <button 
        className={`task-checkbox ${task.status === 'done' ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.status === 'done' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="task-content">
        <div className="task-header">
          <h3 className={`task-title ${task.status === 'done' ? 'completed' : ''}`}>
            {task.title}
          </h3>
          <div className="task-badges">
            <span className={`badge priority-${task.priority}`}>
              {task.priority}
            </span>
            <span className={`badge status-${task.status}`}>
              {statusLabels[task.status]}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        <div className="task-meta">
          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
          {task.due_date && (
            <span className="task-due-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        {onEdit && (
          <button 
            className="task-edit"
            onClick={onEdit}
            aria-label="Edit task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button 
          className="task-delete"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
