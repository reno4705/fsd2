/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch tasks");
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
            alert(error.message);
            if (error.message.includes("Unauthorized")) navigate("/login");
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (inputValue.trim() === "") return;

        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: inputValue }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to add task");
            setTasks([...tasks, data]);
            setInputValue("");
            toast.success("Task Added");
        } catch (error) {
            console.error("Error adding task:", error.message);
            alert(error.message);
        }
    };

    const updateTask = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(editingTask),
            });
            if (!response.ok) throw new Error("Failed to update task");
            const updatedTask = await response.json();
            setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
            setEditingTask(null);
            toast.success("Task Updated");
        } catch (error) {
            console.error("Error updating task:", error.message);
            alert(error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete task");
            setTasks(tasks.filter((task) => task.id !== id));
            toast.success("Task Deleted");
        } catch (error) {
            console.error("Error deleting task:", error.message);
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Manage Your Reminders</h2>
            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Add a reminder"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Add Reminder</button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editingTask?.id === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingTask.text}
                                    onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                                />
                                <input
                                    type="datetime-local"
                                    value={editingTask.reminder_date || ""}
                                    onChange={(e) => setEditingTask({ ...editingTask, reminder_date: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                                <button onClick={updateTask}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <span>{task.text}</span>
                                {task.reminder_date && <span>{new Date(task.reminder_date).toLocaleString()}</span>}
                                <button onClick={() => setEditingTask(task)}>Edit</button>
                                <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;