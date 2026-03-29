import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Sparkles, Target, ListTodo, Loader2, Search, ChevronDown, Calendar, X, Pencil } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TasksContext';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import EditTaskForm from '../components/EditTaskForm';
import './Dashboard.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const SORT_OPTIONS = [
  { key: 'created', label: 'Date Created' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'priority', label: 'Priority' },
  { key: 'alphabetical', label: 'Alphabetical' },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const STAT_CARDS = [
  { label: 'Total', color: 'text-violet-600 dark:text-mist-300', bg: 'bg-violet-50 dark:bg-violet-600/15' },
  { label: 'To Do', color: 'text-[#854F0B] dark:text-[#EF9F27]', bg: 'bg-[#FFF3E0] dark:bg-[#854F0B]/20' },
  { label: 'In Progress', color: 'text-violet-600 dark:text-mist-300', bg: 'bg-violet-100 dark:bg-violet-600/20' },
  { label: 'Done', color: 'text-[#0F6E56] dark:text-[#5DCAA5]', bg: 'bg-[#E8FDF3] dark:bg-[#0F6E56]/20' },
];

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading, error, stats, addTask, updateTask, toggleTaskComplete, deleteTask, clearError, getSummary, getPrioritized } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [priorityList, setPriorityList] = useState(null);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const searchInputRef = useRef(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleAddTask = async (data) => {
    const result = await addTask(data);
    if (result.success) setShowForm(false);
  };

  const handleEditTask = async (data) => {
    const result = await updateTask(editingTask.id, data);
    if (result.success) setEditingTask(null);
  };

  const handleToggle = async (id) => {
    await toggleTaskComplete(id);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    setShowSummary(true);
    setPriorityList(null);
    const result = await getSummary();
    if (result.success) setSummary(result.data.result);
    setSummaryLoading(false);
  };

  const handlePrioritize = async () => {
    setPriorityLoading(true);
    setPriorityList(null);
    setShowSummary(false);
    const result = await getPrioritized();
    if (result.success) setPriorityList(result.data.tasks);
    setPriorityLoading(false);
  };

  // Bulk actions using Promise.all
  const handleBulkComplete = async () => {
    await Promise.all(Array.from(selectedTasks).map(id => toggleTaskComplete(id)));
    setSelectedTasks(new Set());
    setBulkAction(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedTasks.size} selected tasks?`)) return;
    await Promise.all(Array.from(selectedTasks).map(id => deleteTask(id)));
    setSelectedTasks(new Set());
    setBulkAction(null);
  };

  const handleSelectTask = useCallback((id) => {
    setSelectedTasks((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowForm(true);
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowSummary(false);
        setPriorityList(null);
        setBulkAction(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get due date status
  const getDueDateStatus = useCallback((dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', text: 'Overdue' };
    if (diffDays === 0) return { status: 'today', text: 'Due today' };
    if (diffDays <= 3) return { status: 'soon', text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}` };
    if (diffDays <= 7) return { status: 'week', text: `Due in ${diffDays} days` };
    return { status: 'later', text: new Date(dueDate).toLocaleDateString() };
  }, []);

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => filter === 'all' ? true : t.status === filter)
      .filter(t => {
        if (!debouncedSearchQuery) return true;
        const query = debouncedSearchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'dueDate':
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;
            comparison = new Date(a.due_date) - new Date(b.due_date);
            break;
          case 'priority':
            comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            break;
          case 'alphabetical':
            comparison = a.title.localeCompare(b.title);
            break;
          default:
            comparison = new Date(b.created_at) - new Date(a.created_at);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [tasks, filter, debouncedSearchQuery, sortBy, sortOrder]);

  const handleSelectAll = useCallback(() => {
    setSelectedTasks((prev) => {
      if (prev.size === filteredTasks.length) return new Set();
      return new Set(filteredTasks.map(t => t.id));
    });
  }, [filteredTasks]);

  // Memoized stat cards
  const statCardsData = useMemo(() => {
    return STAT_CARDS.map(({ label, color, bg }) => ({
      label,
      value: stats[label.toLowerCase().replace(' ', '_')] || stats.total,
      color,
      bg,
    }));
  }, [stats]);

  // Calculate progress
  const progressPercentage = useMemo(() => {
    return stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  }, [stats.total, stats.done]);

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-void-900">
        <div className="flex flex-col items-center gap-3 text-text-secondary dark:text-mist-500">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600 dark:text-mist-300" />
          <p className="text-sm">Loading your tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-void-900">
      <Navbar />

      <main className="max-w-[1024px] mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-heading dark:text-mist-100 mb-1">
              Hello, {user?.name} 👋
            </h1>
            <p className="text-sm text-text-secondary dark:text-mist-500">
              {stats.todo} to do · {stats.in_progress} in progress · {stats.done} done
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowShortcuts(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg
                border border-violet-200 dark:border-violet-600/30
                text-text-secondary dark:text-mist-300
                hover:bg-violet-50 dark:hover:bg-void-700
                transition-colors duration-150 cursor-pointer"
              title="Keyboard shortcuts"
            >
              <span className="text-xs">⌨️</span> Shortcuts
            </button>
            <button
              onClick={handlePrioritize}
              disabled={priorityLoading || tasks.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg
                border border-violet-200 dark:border-violet-600/30
                text-violet-600 dark:text-mist-300
                hover:bg-violet-50 dark:hover:bg-void-700
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-150 cursor-pointer"
            >
              {priorityLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
              Prioritize
            </button>
            <button
              onClick={handleSummary}
              disabled={summaryLoading || tasks.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg
                border border-violet-200 dark:border-violet-600/30
                text-violet-600 dark:text-mist-300
                hover:bg-violet-50 dark:hover:bg-void-700
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-150 cursor-pointer"
            >
              {summaryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              AI Summary
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg
                bg-violet-600 hover:bg-violet-700 text-white
                shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-[#FFEEF0] dark:bg-[#993556]/20 border border-[#993556]/20 text-[#993556] dark:text-[#ED93B1] text-sm">
            <span>{error}</span>
            <button onClick={clearError} className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
          </div>
        )}

        {/* AI Summary panel */}
        {showSummary && (
          <div className="mb-4 px-4 py-3.5 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-600/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> AI Summary
              </span>
              <button onClick={() => setShowSummary(false)} className="text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300 cursor-pointer text-sm">✕</button>
            </div>
            <p className="text-sm text-text-body dark:text-mist-300 leading-relaxed whitespace-pre-wrap">
              {summaryLoading ? 'Generating summary…' : summary}
            </p>
          </div>
        )}

        {/* AI Priority panel */}
        {priorityList && (
          <div className="mb-4 px-4 py-3.5 rounded-xl bg-violet-50 dark:bg-violet-600/10 border border-violet-200 dark:border-violet-600/25">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-mist-500 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> AI Priority Ranking
              </span>
              <button onClick={() => setPriorityList(null)} className="text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300 cursor-pointer text-sm">✕</button>
            </div>
            <ol className="flex flex-col gap-2">
              {priorityList.map((t, i) => (
                <li key={t.id || i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-600/15 dark:bg-violet-600/25 text-violet-600 dark:text-mist-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span>
                    <span className={`font-semibold mr-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      t.urgency === 'HIGH'   ? 'bg-[#FFEEF0] text-[#993556] dark:bg-[#993556]/20 dark:text-[#ED93B1]' :
                      t.urgency === 'MEDIUM' ? 'bg-[#FFF3E0] text-[#854F0B] dark:bg-[#854F0B]/20 dark:text-[#EF9F27]' :
                                               'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]'
                    }`}>{t.urgency}</span>
                    <span className="font-medium text-text-body dark:text-mist-100">{t.title}</span>
                    <span className="text-text-secondary dark:text-mist-500"> — {t.reasoning}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-white dark:bg-void-800 rounded-xl border border-violet-200 dark:border-violet-600/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-heading dark:text-mist-100">Overall Progress</span>
            <span className="text-sm font-bold text-violet-600 dark:text-mist-300">{progressPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-violet-100 dark:bg-violet-600/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary dark:text-mist-500 mt-2">
            {stats.done} of {stats.total} tasks completed
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCardsData.map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white dark:bg-void-800 border border-violet-200 dark:border-violet-600/20 rounded-xl p-4 shadow-xs">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <ListTodo className={`w-5 h-5 ${color}`} />
              </div>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs text-text-secondary dark:text-mist-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tasks card */}
        <div className="bg-white dark:bg-void-800 border border-violet-200 dark:border-violet-600/20 rounded-xl shadow-xs overflow-hidden">

          {/* Tasks header + filters */}
          <div className="border-b border-violet-200 dark:border-violet-600/15 bg-violet-50/50 dark:bg-void-700/40">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-mist-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tasks... (press /)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-violet-200 dark:border-violet-600/25 bg-white dark:bg-void-700 text-text-body dark:text-mist-100 placeholder:text-text-muted dark:placeholder:text-mist-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-violet-100 dark:hover:bg-void-600"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3 text-text-muted dark:text-mist-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedTasks.size > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-600/20 rounded-lg">
                    <span className="text-xs font-semibold text-violet-600 dark:text-mist-300">
                      {selectedTasks.size} selected
                    </span>
                    <button
                      onClick={handleBulkComplete}
                      className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
                    >
                      Complete
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedTasks(new Set())}
                      className="text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300"
                      aria-label="Clear selection"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm font-medium rounded-lg border border-violet-200 dark:border-violet-600/25 bg-white dark:bg-void-700 text-text-secondary dark:text-mist-300 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted dark:text-mist-500 pointer-events-none" />
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 text-sm font-medium rounded-lg border border-violet-200 dark:border-violet-600/25 bg-white dark:bg-void-700 text-text-secondary dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 cursor-pointer"
                  title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-violet-300 dark:border-violet-600/50 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="selectAll" className="text-sm font-medium text-text-secondary dark:text-mist-300 cursor-pointer">
                  Select all
                </label>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-150 cursor-pointer
                      ${filter === key
                        ? 'bg-violet-600 text-white'
                        : 'text-text-secondary dark:text-mist-500 hover:text-violet-600 dark:hover:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="divide-y divide-violet-100 dark:divide-violet-600/10">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-600/20 dark:to-purple-600/20 flex items-center justify-center mb-6">
                  <ListTodo className="w-10 h-10 text-violet-400 dark:text-mist-500" />
                </div>
                <h3 className="text-lg font-bold text-text-heading dark:text-mist-100 mb-2">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : filter === 'all'
                      ? 'No tasks yet'
                      : `No ${filter.replace('_', ' ')} tasks`}
                </h3>
                <p className="text-sm text-text-secondary dark:text-mist-500 mb-6 max-w-sm">
                  {searchQuery
                    ? 'Try a different search term or clear your search.'
                    : filter === 'all'
                      ? 'Create your first task to get started. Press "N" or click the button below.'
                      : 'Nothing here yet. Try a different filter.'}
                </p>
                {!searchQuery && filter === 'all' && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create Your First Task
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-violet-200 dark:border-violet-600/25 text-violet-600 dark:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-700 transition-colors duration-150 cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map(task => {
                const dueDateStatus = getDueDateStatus(task.due_date);
                const isSelected = selectedTasks.has(task.id);
                const isExpanded = expandedTask === task.id;

                return (
                  <div key={task.id} className={`transition-colors duration-150 ${isSelected ? 'bg-violet-50 dark:bg-violet-600/10' : ''}`}>
                    <div className="flex items-start gap-3 px-5 py-4 hover:bg-violet-50/50 dark:hover:bg-void-700/40">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTask(task.id)}
                        className="w-4 h-4 mt-0.5 rounded border-violet-300 dark:border-violet-600/50 text-violet-600 focus:ring-violet-500 cursor-pointer"
                        aria-label={`Select task: ${task.title}`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-text-muted dark:text-mist-500' : 'text-text-body dark:text-mist-100'}`}>
                            {task.title}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'bg-[#FFEEF0] text-[#993556] dark:bg-[#993556]/20 dark:text-[#ED93B1]' :
                            task.priority === 'medium' ? 'bg-[#FFF3E0] text-[#854F0B] dark:bg-[#854F0B]/20 dark:text-[#EF9F27]' :
                            'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            task.status === 'done' ? 'bg-[#E8FDF3] text-[#0F6E56] dark:bg-[#0F6E56]/20 dark:text-[#5DCAA5]' :
                            task.status === 'in_progress' ? 'bg-violet-100 text-violet-700 dark:bg-violet-600/25 dark:text-mist-100' :
                            'bg-violet-50 text-violet-600 dark:bg-violet-600/15 dark:text-mist-300'
                          }`}>
                            {task.status === 'done' ? 'Done' : task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                          </span>
                          {dueDateStatus && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              dueDateStatus.status === 'overdue' ? 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                              dueDateStatus.status === 'today' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                              dueDateStatus.status === 'soon' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                              'bg-violet-50 text-violet-600 dark:bg-violet-600/12 dark:text-mist-300'
                            }`}>
                              <Calendar className="w-2.5 h-2.5" />
                              {dueDateStatus.text}
                            </span>
                          )}
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
                        </div>

                        {/* Expanded view */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-violet-100 dark:border-violet-600/10">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-text-muted dark:text-mist-500">Created: </span>
                                <span className="text-text-body dark:text-mist-100">
                                  {new Date(task.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {task.due_date && (
                                <div>
                                  <span className="text-text-muted dark:text-mist-500">Due: </span>
                                  <span className={`font-medium ${
                                    dueDateStatus?.status === 'overdue' ? 'text-red-600 dark:text-red-400' :
                                    dueDateStatus?.status === 'today' ? 'text-orange-600 dark:text-orange-400' :
                                    'text-text-body dark:text-mist-100'
                                  }`}>
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-violet-600 dark:hover:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 transition-colors duration-150 cursor-pointer"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          aria-label="Edit task"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-violet-600 dark:hover:text-mist-300 hover:bg-violet-50 dark:hover:bg-void-600 transition-colors duration-150 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          aria-label="Delete task"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted dark:text-mist-500 hover:text-[#993556] dark:hover:text-[#ED93B1] hover:bg-[#FFEEF0] dark:hover:bg-[#993556]/15 transition-colors duration-150 cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShortcuts(false)} role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-void-800 rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-heading dark:text-mist-100">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-text-muted dark:text-mist-500 hover:text-text-body dark:hover:text-mist-300" aria-label="Close shortcuts modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'N', desc: 'Create new task' },
                { key: '/', desc: 'Focus search' },
                { key: '?', desc: 'Show shortcuts' },
                { key: 'Esc', desc: 'Close modals' },
              ].map(({ key, desc }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-violet-100 dark:border-violet-600/10 last:border-0">
                  <span className="text-sm text-text-secondary dark:text-mist-300">{desc}</span>
                  <kbd className="px-2.5 py-1 text-xs font-mono font-semibold bg-violet-50 dark:bg-violet-600/20 text-violet-600 dark:text-mist-300 rounded-lg border border-violet-200 dark:border-violet-600/25">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && <TaskForm onSubmit={handleAddTask} onClose={() => setShowForm(false)} />}
      {editingTask && <EditTaskForm task={editingTask} onSubmit={handleEditTask} onClose={() => setEditingTask(null)} />}
    </div>
  );
}
