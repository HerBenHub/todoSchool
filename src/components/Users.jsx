import axios from "axios";
import { useEffect, useState } from "react";

const API = "http://localhost:3000/users";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "" });
    const [editId, setEditId] = useState(null);


    async function fetchUsers() {
        const res = await axios.get(API);
        setUsers(res.data);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (editId === null) {
            await axios.post(API, form);
        } else {
            await axios.put(`${API}/${editId}`, form);
            setEditId(null);
        }
        setForm({ name: "", email: "" });
        fetchUsers();
    }

    function handleEdit(user) {
        setEditId(user.id);
        setForm({ name: user.name, email: user.email });
    }

    async function handleDelete(id) {
        await axios.delete(`${API}/${id}`);
        fetchUsers();
    }

    return (
        <div>
            <h2>Felhasználók</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Név"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <button type="submit">
                    {editId === null ? "Hozzáadás" : "Mentés"}
                </button>
                {editId !== null && (
                    <button type="button" onClick={() => { setEditId(null); setForm({ name: "", email: "" }); }}>
                        Mégse
                    </button>
                )}
            </form>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} — {user.email}
                        <button onClick={() => handleEdit(user)}>Szerkesztés</button>
                        <button onClick={() => handleDelete(user.id)}>Törlés</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
