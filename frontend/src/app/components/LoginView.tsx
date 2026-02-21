import { FormEvent, useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error: string | null;
}

export function LoginView({ onLogin, error }: LoginViewProps) {
  const [email, setEmail] = useState('demo@crm.local');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CRM Sign in</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Use your account to access deals, contacts, companies and activities.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-2 rounded border" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-4 py-2 rounded border" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign in</button>
      </form>
    </div>
  );
}
