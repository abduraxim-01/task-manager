import { Plus, Filter, Search } from 'lucide-react';

const FilterBar = ({ filters, setFilters, searchQuery, setSearchQuery, onNewTask }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="filter-item search-item">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-item">
          <Filter size={16} />
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        
        <div className="filter-item">
          <select 
            value={filters.priority} 
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
      </div>
      
      <button className="primary-btn" onClick={onNewTask}>
        <Plus size={18} /> New Task
      </button>
    </div>
  );
};

export default FilterBar;
