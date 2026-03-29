import { useState } from 'react';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';

const PRIORITY_STYLES = {
  high:   'bg-[#FFEEF0] text-[#993556] dark:bg-[#993556]/20 dark:text-[#ED93B1]',
  medium: 'bg-[#FFF3E0] text-[#854F0B] dark:bg-[#854F0B]/20 dark:text-[#EF9F27]',
  low:    'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]',
};

const STATUS_STYLES = {
  todo:        'bg-violet-50 text-violet-600 dark:bg-violet-600/15 dark:text-mist-300',
  in_progress: 'bg-violet-100 text-violet-700 dark:bg-violet-600/25 dark:text-mist-100',
  done:        'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]',
};

const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await onDelete();
  };

  const isDone = task.status === 'done';

  return (
    <div className={`flex items-start gap-3 px-5 py-4 transition-colors duration-150 hover:bg-violet-50/50 dark:hover:bg-void-700/40 ${deleting ? 'opacity-40 pointer-events-none' : ''}`}>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer
          ${isDone ? 'bg-violet-600 border-violet-600' : 'border-violet-300 dark:border-violet-600/50 hover:border-violet-500'}`}
      >
        {isDone && (
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isDone ? 'line-through text-text-muted dark:text-mist-500' : 'text-text-body dark:text-mist-100'}`}>
            {task.title}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-text-secondary dark:text-mist-500 leading-relaxed mb-1.5">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {task.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-600/12 text-violet-600 dark:text-mist-300 border border-violet-200 dark:border-violet-600/20">
              {tag}
            </span>
          ))}
          {task.due_date && (
            <span className="flex items-center gap-1 text-[11px] text-text-muted dark:text-mist-500">
              <CalendarDays className="w-3 h-3" />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            onClick={onEdit}
            aria-label="Edit task"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-violet-600 dark:hover:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 transition-colors duration-150 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={handleDelete}
          aria-label="Delete task"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-[#993556] dark:hover:text-[#ED93B1] hover:bg-[#FFEEF0] dark:hover:bg-[#993556]/15 transition-colors duration-150 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
