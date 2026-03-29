import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';

const fieldCls = `w-full border border-violet-200 dark:border-violet-600/25 focus:border-violet-600 dark:focus:border-violet-600/60
  rounded-lg px-3.5 py-2.5 text-sm text-text-body dark:text-mist-100 bg-white dark:bg-void-700
  placeholder:text-text-muted dark:placeholder:text-mist-500 outline-none transition-colors duration-150`;

const labelCls = 'block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5';

export default function EditTaskForm({ task, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title:       task.title || '',
    description: task.description || '',
    priority:    task.priority || 'medium',
    status:      task.status || 'todo',
    tags:        (task.tags || []).join(', '),
    due_date:    task.due_date ? task.due_date.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);

  const set = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      title:       formData.title,
      description: formData.description || null,
      priority:    formData.priority,
      status:      formData.status,
      tags:        formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      due_date:    formData.due_date || null,
    });
    setLoading(false);
  };

  return (
    <Modal title="Edit Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className={labelCls}>Task Title</label>
          <input name="title" value={formData.title} onChange={set} required autoFocus
            placeholder="What needs to be done?" className={fieldCls} />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea name="description" value={formData.description} onChange={set} rows={3}
            placeholder="Add details…" className={`${fieldCls} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Priority</label>
            <select name="priority" value={formData.priority} onChange={set} className={fieldCls}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" value={formData.status} onChange={set} className={fieldCls}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input name="tags" value={formData.tags} onChange={set}
              placeholder="work, urgent" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={set} className={fieldCls} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-violet-200 dark:border-violet-600/30 text-text-secondary dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-700 transition-colors duration-150 cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
