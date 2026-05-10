import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const TaskModal = ({ task, users = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    deadline: '',
    assigneeId: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        deadline: task.deadline || '',
        assigneeId: task.assigneeId || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Vazifani tahrirlash' : 'Yangi vazifa yaratish'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Sarlavha</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Masalan: Sayt dizaynini chizish"
              required 
            />
          </div>

          <div className="form-group">
            <label>Tavsif</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3}
              placeholder="Vazifa haqida batafsil..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Holat</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Ustuvorlik</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Past</option>
                <option value="Medium">O'rta</option>
                <option value="High">Yuqori</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Muddati</label>
              <input 
                type="date" 
                name="deadline" 
                value={formData.deadline} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Kimga biriktirish</label>
              <select name="assigneeId" value={formData.assigneeId} onChange={handleChange}>
                <option value="">Hech kimga</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="primary-btn">{task ? 'Saqlash' : 'Vazifa yaratish'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
