/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
    const URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${URL}/api/tasks`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || "Failed to fetch tasks");
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
            const response = await fetch(`${URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: inputValue }),
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || "Failed to add task");
            setTasks((prevTasks) => [...prevTasks, data]);
            setInputValue("");
            window.location.reload();
            toast.success("Task Added");
        } catch (error) {
            console.error("Error adding task:", error.message);
            alert(error.message);
        }
    };

    const updateTask = async () => {
        try {
            const response = await fetch(
                `${URL}/api/tasks/${editingTask.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(editingTask),
                }
            );
            if (!response.ok) throw new Error("Failed to update task");
            const updatedTask = await response.json();
            setTasks(
                tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
            setEditingTask(null);
            toast.success("Task Updated");
        } catch (error) {
            console.error("Error updating task:", error.message);
            alert(error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (!response.ok) throw new Error("Failed to delete task");
            setTasks(tasks.filter((task) => task.id !== id));
            toast.success("Task Deleted");
        } catch (error) {
            console.error("Error deleting task:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-blue-200 flex flex-col justify-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Manage Your Reminders
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <form onSubmit={addTask} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Add a reminder"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md"
                    >
                        Add Reminder
                    </button>
                </form>

                <ul className="mt-6 space-y-2">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="bg-white p-4 rounded-md shadow-md flex justify-between items-center"
                        >
                            {editingTask?.id === task.id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editingTask.text}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                text: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                    <input
                                        type="datetime-local"
                                        value={editingTask.reminder_date || ""}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                reminder_date: e.target.value,
                                            })
                                        }
                                        min={new Date()
                                            .toISOString()
                                            .slice(0, 16)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                    <button
                                        onClick={updateTask}
                                        className="py-2 px-4 bg-green-600 text-white rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-5">
                                        <span>{task.text}</span>
                                        {task.reminder_date && (
                                            <span className="text-gray-500 text-sm">
                                                {new Date(
                                                    task.reminder_date
                                                ).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setEditingTask(task)}
                                            className="text-blue-500 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
