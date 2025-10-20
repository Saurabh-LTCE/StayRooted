import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const urlRole = useMemo(() => new URLSearchParams(location.search).get('role') || '', [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    // Mock auth: any email/password accepted
    localStorage.setItem('sr_token', 'mocktoken');
    // determine role: use URL role if present else derive from email
    let role = urlRole || (email.includes('admin') ? 'admin' : (email.includes('host') ? 'host' : 'traveler'));
    localStorage.setItem('sr_role', role);
    if (role === 'host') navigate('/dashboard/host');
    else if (role === 'admin') navigate('/dashboard/admin');
    else navigate('/dashboard/traveler');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-green-100 to-green-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-green-800">Login to StayRooted</h2>
        {urlRole && (
          <div className="mb-4 inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-800 uppercase tracking-wide">{urlRole}</div>
        )}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition">Login</button>
        <div className="mt-4 text-sm text-center">
          Don&apos;t have an account? <a href="/register" className="text-green-700 hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
