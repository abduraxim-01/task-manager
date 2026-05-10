import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, users, onEditTask, onDeleteTask, onUpdateTaskStatus, index, currentUserId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ up: false, down: false });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowArrows({
        up: scrollTop > 10,
        down: scrollTop + clientHeight < scrollHeight - 10
      });
    }
  };

  useEffect(() => {
    checkScroll();
    // Add event listener for scroll
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [tasks]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
    >
      <div className="column-header">
        <div className={`status-indicator status-${status.replace(/\s+/g, '-').toLowerCase()}`}></div>
        <h2>{status}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="column-body-wrapper">
        {showArrows.up && (
          <button className="scroll-arrow up" onClick={() => scroll('up')}>
            <ChevronUp size={20} />
          </button>
        )}
        
        <div className="column-content" ref={scrollRef}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              users={users}
              currentUserId={currentUserId}
              onEditTask={() => onEditTask(task)}
              onDeleteTask={() => onDeleteTask(task.id)}
              onUpdateTaskStatus={(newStatus) => onUpdateTaskStatus(task.id, newStatus)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="empty-column">Bu ustunda vazifalar yo'q</div>
          )}
        </div>

        {showArrows.down && (
          <button className="scroll-arrow down" onClick={() => scroll('down')}>
            <ChevronDown size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
