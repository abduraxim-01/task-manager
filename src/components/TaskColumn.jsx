import { useState } from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, users, onEditTask, onDeleteTask, onUpdateTaskStatus, index }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  return (
    <div 
      className={`task-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="column-header">
        <div className={`status-indicator status-${status.replace(/\s+/g, '-').toLowerCase()}`}></div>
        <h2>{status}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="column-content">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            users={users}
            onEditTask={() => onEditTask(task)}
            onDeleteTask={() => onDeleteTask(task.id)}
            onUpdateTaskStatus={(newStatus) => onUpdateTaskStatus(task.id, newStatus)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-column">No tasks in this column</div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
