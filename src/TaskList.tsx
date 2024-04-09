import React from 'react';
import './TaskList.css';

const TaskList = () => {
    const tasks = [
        "Repair PC",
        "Download Data",
        "Calibrate Motors",
        "Scann Cards"
    ];

    return (
        <div className="tasksList">
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
