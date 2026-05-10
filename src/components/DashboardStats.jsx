import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Components.css';

const COLORS = {
  'To Do': '#8884d8',
  'In Progress': '#ffce56',
  'Done': '#82ca9d'
};

const PRIORITY_COLORS = {
  'Low': '#4bc0c0',
  'Medium': '#ffce56',
  'High': '#ff6384'
};

const DashboardStats = ({ tasks }) => {
  if (!tasks || tasks.length === 0) return null;

  // Calculate status data
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  // Calculate priority data
  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = Object.keys(priorityCounts).map(key => ({
    name: key,
    value: priorityCounts[key]
  }));

  return (
    <div className="dashboard-stats" data-aos="fade-up">
      <div className="stat-card">
        <h3>Tasks by Status</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {Object.keys(COLORS).map(status => (
             <span key={status} className="legend-item">
               <span className="legend-color" style={{backgroundColor: COLORS[status]}}></span>
               {status} ({statusCounts[status] || 0})
             </span>
          ))}
        </div>
      </div>

      <div className="stat-card">
        <h3>Tasks by Priority</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'var(--bg-secondary)'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
