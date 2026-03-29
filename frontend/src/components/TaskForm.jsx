import { useState } from 'react';
import { Sparkles, GitBranch, Loader2 } from 'lucide-react';
import { useTasks } from '../contexts/TasksContext';
import Modal from './Modal';

const fieldCls = `w-full border border-violet-200 dark:border-violet-600/25 focus:border-violet-600 dark:focus:border-violet-600/60
  rounded-lg px-3.5 py-2.5 text-sm text-text-body dark:text-mist-100 bg-white dark:bg-void-700
  placeholder:text-text-muted dark:placeholder:text-mist-500 outline-none transition-colors duration-150`;

const labelCls = 'block text-xs font-semibold text-text-secondary dark:text-mist-500 mb-1.5';

export default function TaskForm({ onSubmit, onClose }) {
  const { getSuggestions, getBreakdown } = useTasks();

  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', status: 'todo', tags: '', due_date: '',
  });
  const [loading, setLoading]               = useState(false);
  const [aiLoading, setAiLoading]           = useState(false);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion]     = useState('');
  const [breakdown, setBreakdown]           = useState(null);

  const set = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      due_date: formData.due_date || null,
      description: formData.description || null,
    });
    setLoading(false);
  };

  const handleSuggest = async () => {
    if (!formData.title) return;
    setAiLoading(true); setAiSuggestion(''); setBreakdown(null);
    const r = await getSuggestions(formData.title, formData.description, formData.tags.split(',').map(t => t.trim()).filter(Boolean));
    if (r.success) setAiSuggestion(r.data.result);
    setAiLoading(false);
  };

  const handleBreakdown = async () => {
    if (!formData.title) return;
    setBreakdownLoading(true); setBreakdown(null); setAiSuggestion('');
    const r = await getBreakdown(formData.title, formData.description);
    if (r.success) setBreakdown(r.data.steps);
    setBreakdownLoading(false);
  };

  return (
    <Modal title="Create Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Title + AI buttons */}
        <div>
          <label className={labelCls}>Task Title</label>
          <input name="title" value={formData.title} onChange={set} required autoFocus
            placeholder="What needs to be done?" className={fieldCls} />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleSuggest} disabled={!formData.title || aiLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-violet-200 dark:border-violet-600/30 text-violet-600 dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 disabled:opacity-40 transition-colors duration-150 cursor-pointer">
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Suggest
            </button>
            <button type="button" onClick={handleBreakdown} disabled={!formData.title || breakdownLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-violet-200 dark:border-violet-600/30 text-violet-600 dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 disabled:opacity-40 transition-colors duration-150 cursor-pointer">
              {breakdownLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <GitBranch className="w-3 h-3" />}
              Breakdown
            </button>
          </div>
        </div>

        {/* AI suggestion */}
        {aiSuggestion && (
          <div className="px-3.5 py-3 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-600/25 text-sm text-text-body dark:text-mist-300 leading-relaxed">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 block mb-1">AI Suggestion</span>
            {aiSuggestion}
          </div>
        )}

        {/* Breakdown */}
        {breakdown && (
          <div className="px-3.5 py-3 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-600/25">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 block mb-2">Sub-steps</span>
            <ol className="flex flex-col gap-1.5">
              {breakdown.map((s) => (
                <li key={s.step} className="text-sm text-text-body dark:text-mist-300">
                  <span className="font-semibold">{s.title}</span> — {s.details}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea name="description" value={formData.description} onChange={set} rows={3}
            placeholder="Add details…" className={`${fieldCls} resize-none`} />
        </div>

        {/* Priority + Status */}
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

        {/* Tags + Due date */}
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

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-violet-200 dark:border-violet-600/30 text-text-secondary dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-700 transition-colors duration-150 cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 transition-colors duration-150 cursor-pointer">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
