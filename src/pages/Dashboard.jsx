import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import FilterBar from '../components/FilterBar';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All'
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/tasks?userId=${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', {
        ...taskData,
        userId: user.id
      });
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updatedData);
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      if (isModalOpen) setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'All' && task.status !== filters.status) return false;
    if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="dashboard">
      <Navigation />
      <main className="dashboard-content">
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          onNewTask={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        />
        
        {isLoading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : (
          <TaskBoard 
            tasks={filteredTasks} 
            onEditTask={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={(taskId, newStatus) => handleUpdateTask(taskId, { status: newStatus })}
          />
        )}
      </main>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
