import { Edit2, Trash2, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const TaskCard = ({ task, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  
  const handleStatusChange = (direction) => {
    const statuses = ['To Do', 'In Progress', 'Done'];
    const currentIndex = statuses.indexOf(task.status);
    if (direction === 'next' && currentIndex < statuses.length - 1) {
      onUpdateTaskStatus(statuses[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      onUpdateTaskStatus(statuses[currentIndex - 1]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`task-card priority-${task.priority.toLowerCase()}`}>
      <div className="task-card-header">
        <span className="priority-badge">{task.priority}</span>
        <div className="task-actions">
          <button onClick={onEditTask} className="icon-btn edit" title="Edit Task">
            <Edit2 size={14} />
          </button>
          <button onClick={onDeleteTask} className="icon-btn delete" title="Delete Task">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      
      {task.deadline && (
        <div className={`task-deadline ${isOverdue && task.status !== 'Done' ? 'overdue' : ''}`}>
          <Calendar size={12} />
          <span>{formatDate(task.deadline)}</span>
        </div>
      )}
      
      <div className="task-status-controls">
        <button 
          className="move-btn" 
          onClick={() => handleStatusChange('prev')}
          disabled={task.status === 'To Do'}
          title="Move Back"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="status-label">
          <Clock size={12} /> {task.status}
        </div>
        <button 
          className="move-btn" 
          onClick={() => handleStatusChange('next')}
          disabled={task.status === 'Done'}
          title="Move Forward"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
