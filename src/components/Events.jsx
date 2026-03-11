import axios from "axios";
import { useEffect, useState } from "react";

const API = "http://localhost:3000/events";

export default function Events() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", userId: "" });
    const [editId, setEditId] = useState(null);

    async function fetchEvents() {
        const res = await axios.get(API);
        setEvents(res.data);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (editId === null) {
            await axios.post(API, {
                title: form.title,
                description: form.description,
                userId: form.userId,
            });
        } else {
            await axios.put(`${API}/${editId}`, {
                title: form.title,
                description: form.description,
            });
            setEditId(null);
        }
        setForm({ title: "", description: "", userId: "" });
        fetchEvents();
    }

    function handleEdit(event) {
        setEditId(event.id);
        setForm({ title: event.title, description: event.description, userId: event.user_id ?? "" });
    }

    async function handleDelete(id) {
        await axios.delete(`${API}/${id}`);
        fetchEvents();
    }

    return (
        <div>
            <h2>Események</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Cím"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    name="description"
                    placeholder="Leírás"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                {editId === null && (
                    <input
                        name="userId"
                        placeholder="Felhasználó ID"
                        value={form.userId}
                        onChange={handleChange}
                        required
                    />
                )}
                <button type="submit">
                    {editId === null ? "Hozzáadás" : "Mentés"}
                </button>
                {editId !== null && (
                    <button
                        type="button"
                        onClick={() => { setEditId(null); setForm({ title: "", description: "", userId: "" }); }}
                    >
                        Mégse
                    </button>
                )}
            </form>

            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <strong>{event.title}</strong> — {event.description}
                        <button onClick={() => handleEdit(event)}>Szerkesztés</button>
                        <button onClick={() => handleDelete(event.id)}>Törlés</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
