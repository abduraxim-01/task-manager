import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import FilterBar from '../components/FilterBar';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import DashboardStats from '../components/DashboardStats';
import { supabase } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      
      // map username to name for frontend compatibility
      const mappedUsers = data.map(u => ({ ...u, name: u.username }));
      setUsers(mappedUsers || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        deadline: taskData.deadline || null,
        userId: user.id, // creator
        assigneeId: taskData.assigneeId ? parseInt(taskData.assigneeId) : null
      };

      const { data, error } = await supabase.from('tasks').insert([newTask]).select();
      if (error) throw error;

      if (data && data[0]) {
        setTasks([...tasks, data[0]]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updatedData,
          assigneeId: updatedData.assigneeId ? parseInt(updatedData.assigneeId) : null
        })
        .eq('id', taskId)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setTasks(tasks.map(t => t.id === taskId ? data[0] : t));
      }
      if (isModalOpen) setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'All' && task.status !== filters.status) return false;
    if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title?.toLowerCase().includes(query) || false;
      const matchesDesc = task.description?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesDesc) return false;
    }
    
    return true;
  });

  return (
    <div className="dashboard">
      <Navigation tasks={tasks} />
      <main className="dashboard-content" data-aos="fade-in">
        <div className="dashboard-header" data-aos="fade-right">
          <h2>Welcome, {user?.name || user?.username || 'User'}!</h2>
          <p>Manage your team projects and stay productive.</p>
        </div>

        <DashboardStats tasks={tasks} />

        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
            users={users}
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
          users={users}
          onClose={() => setIsModalOpen(false)}
          onSave={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
