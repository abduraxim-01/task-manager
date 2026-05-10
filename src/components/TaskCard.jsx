import { Edit2, Trash2, Calendar, Clock, User } from 'lucide-react';

const TaskCard = ({ task, users = [], onEditTask, onDeleteTask, onUpdateTaskStatus, currentUserId }) => {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  const isCreator = currentUserId === task.userId;

  const formatDate = (dateString, showTime = false) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      ...(showTime && { hour: '2-digit', minute: '2-digit' })
    };
    return date.toLocaleDateString('uz-UZ', options);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const assignee = users.find(u => u.id === task.assigneeId);

  return (
    <div 
      className={`task-card priority-${task.priority.toLowerCase()} status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <span className="priority-badge">{task.priority}</span>
        {isCreator && (
          <div className="task-actions">
            <button onClick={onEditTask} className="icon-btn edit" title="Vazifani tahrirlash">
              <Edit2 size={14} />
            </button>
            <button onClick={onDeleteTask} className="icon-btn delete" title="Vazifani o'chirish">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      
      <div className="task-meta">
        {task.deadline && (
          <div className={`task-deadline ${isOverdue && task.status !== 'Done' ? 'overdue' : ''}`}>
            <Calendar size={12} />
            <span>{formatDate(task.deadline)}</span>
          </div>
        )}
        {assignee && (
          <div className="task-assignee" title={`Biriktirilgan: ${assignee.name}`}>
            <User size={12} />
            <span>{assignee.name}</span>
          </div>
        )}
      </div>

      <div className="task-creation-time">
        <Clock size={10} />
        <span>Yaratildi: {formatDate(task.created_at, true)}</span>
      </div>
      
      <div className="task-status-controls">
        <div className="status-label">
          <Clock size={12} /> Holat
        </div>
        <select 
          className="status-select" 
          value={task.status} 
          onChange={(e) => onUpdateTaskStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
