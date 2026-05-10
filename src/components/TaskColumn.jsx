import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  return (
    <div className="task-column">
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
