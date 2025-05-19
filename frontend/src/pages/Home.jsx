/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editReminderDate, setEditReminderDate] = useState("");

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
            fetchTasks();
            toast.success("Task Added");
        } catch (error) {
            console.error("Error adding task:", error.message);
            alert(error.message);
        }
    };

    const updateTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: editText, reminder_date: editReminderDate }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update task");
            }

            const updatedTask = await response.json();
            setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
            setEditTaskId(null);
            setEditText("");
            setEditReminderDate("");
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
        <div className="">
            <div className="mx-auto w-full max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Manage Your Reminders
                </h2>
            </div>
            <div className="mt-8 mx-auto w-[500px] border-solid border-black border-[3px] p-10 rounded-[20px]">
                <form onSubmit={addTask} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Add a reminder"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full px-3 py-2 border-[3px] border-black"
                    />
                    <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-[5px]">
                        Add Reminder
                    </button>
                </form>

                <ul className="mt-6 space-y-4">
                    {tasks.map((task) => (
                        <li key={task.id} className="bg-white p-4 rounded-md bg-blue-200">
                            {editTaskId === task.id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300"
                                    />
                                    <input
                                        type="datetime-local"
                                        value={editReminderDate}
                                        onChange={(e) => setEditReminderDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="w-full px-3 py-2 border border-gray-300"
                                    />
                                    <button
                                        onClick={() => updateTask(task.id)}
                                        className="py-2 px-4 bg-green-600 text-white"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span>{task.text}</span>
                                    {task.reminder_date && <span className="text-gray-500 text-sm">{new Date(task.reminder_date).toLocaleString()}</span>}
                                    <div>
                                        <button onClick={() => deleteTask(task.id)} className="text-red-500 mr-2">Delete</button>
                                        <button onClick={() => { setEditTaskId(task.id); setEditText(task.text); setEditReminderDate(task.reminder_date || ""); }} className="text-blue-500">Edit</button>
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