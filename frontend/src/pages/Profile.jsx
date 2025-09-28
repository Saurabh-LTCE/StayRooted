import React, { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({ name: 'Amit Kumar', email: 'amit@example.com' });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);

  const handleSave = (e) => {
    e.preventDefault();
    setUser(form);
    setEdit(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white rounded shadow p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Profile</h2>
      {edit ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">Save</button>
        </form>
      ) : (
        <div>
          <div className="mb-4"><span className="font-medium">Name:</span> {user.name}</div>
          <div className="mb-4"><span className="font-medium">Email:</span> {user.email}</div>
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition" onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
