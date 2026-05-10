import TaskColumn from './TaskColumn';
import './Components.css';

const TaskBoard = ({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="task-board">
      {columns.map(status => (
        <TaskColumn 
          key={status}
          status={status}
          tasks={tasks.filter(task => task.status === status)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
