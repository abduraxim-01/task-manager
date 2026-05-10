import TaskColumn from './TaskColumn';
import './Components.css';

const TaskBoard = ({ tasks, users, onEditTask, onDeleteTask, onUpdateTaskStatus, currentUserId }) => {
  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="task-board">
      {columns.map((status, index) => (
        <TaskColumn 
          key={status}
          status={status}
          index={index}
          tasks={tasks.filter(task => task.status === status)}
          users={users}
          currentUserId={currentUserId}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
