import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './DataVisualizationBoard.css'; // Optional: For styling

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#AA77AA', '#77AAAA'];

const DataVisualizationBoard = ({ stats }) => {
  const { avgCalories, cuisineDistribution } = stats;

  // Prepare data for Pie Chart (Cuisine Distribution)
  const cuisineData = Object.keys(cuisineDistribution).map((cuisine) => ({
    name: cuisine,
    value: cuisineDistribution[cuisine],
  }));

  // Prepare data for Bar Chart (Average Calories)
  const calorieData = [
    { name: 'Average Calories', Calories: parseFloat(avgCalories) },
  ];

  return (
    <div className="data-visualization-board">
      <h2>Data Visualization Dashboard</h2>
      
      <div className="chart-container">
        <h3>Cuisine Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={cuisineData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {cuisineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="middle"/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Average Calories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={calorieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="Calories" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataVisualizationBoard;
