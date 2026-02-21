import { useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';
import { DashboardView } from '@/app/components/DashboardView';
import { PipelineView } from '@/app/components/PipelineView';
import { ContactsView } from '@/app/components/ContactsView';
import { CompaniesView } from '@/app/components/CompaniesView';
import { ActivitiesView } from '@/app/components/ActivitiesView';
import { LoginView } from '@/app/components/LoginView';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

type Deal = { id: string; name: string; value: number; company: string; owner: string; closeDate: string; stage: string; probability: number; description: string };
type Contact = { id: string; firstName: string; lastName: string; email: string; phone: string; company: string; position: string; department: string; owner: string };
type Company = { id: string; name: string; industry: string; website: string; email: string; phone: string; address: string; city: string; country: string; employees: number; revenue: number; owner: string };
type Activity = { id: string; subject: string; status: string; dueDate: string; ownerName: string };

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  const [activeView, setActiveView] = useState('dashboard');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userName, setUserName] = useState('User');
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const authFetch = async (path: string, init?: RequestInit) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(init?.headers || {}),
      },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.status === 204 ? null : response.json();
  };

  const loadData = async () => {
    if (!token) return;
    const [me, dealsData, contactsData, companiesData, activitiesData] = await Promise.all([
      authFetch('/auth/me'),
      authFetch('/deals'),
      authFetch('/contacts'),
      authFetch('/companies'),
      authFetch('/activities'),
    ]);
    setUserName(me.full_name);
    setDeals(dealsData.map((d: any) => ({ id: String(d.id), name: d.name, value: d.value, company: d.company_name || '', owner: d.owner_name || '', closeDate: d.close_date || '', stage: d.stage, probability: d.probability, description: d.description || '' })));
    setContacts(contactsData.map((c: any) => ({ id: String(c.id), firstName: c.first_name, lastName: c.last_name, email: c.email || '', phone: c.phone || '', company: c.company_name || '', position: c.position || '', department: c.department || '', owner: userName })));
    setCompanies(companiesData.map((c: any) => ({ id: String(c.id), name: c.name, industry: c.industry || '', website: c.website || '', email: c.email || '', phone: c.phone || '', address: c.address || '', city: c.city || '', country: c.country || '', employees: c.employees || 0, revenue: c.revenue || 0, owner: userName })));
    setActivities(activitiesData.map((a: any) => ({ id: String(a.id), subject: a.subject, status: a.status, dueDate: a.due_date || '', ownerName: a.owner_name || '' })));
  };

  useEffect(() => { loadData().catch(() => setToken(null)); }, [token]);

  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    const form = new URLSearchParams({ username: email, password });
    try {
      const response = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    } catch {
      setAuthError('Login failed. Register a user via API first if needed.');
    }
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return { deals, contacts, companies };
    const term = searchTerm.toLowerCase();
    return {
      deals: deals.filter((d) => `${d.name} ${d.company}`.toLowerCase().includes(term)),
      contacts: contacts.filter((c) => `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(term)),
      companies: companies.filter((c) => `${c.name} ${c.industry}`.toLowerCase().includes(term)),
    };
  }, [searchTerm, deals, contacts, companies]);

  if (!token) return <LoginView onLogin={handleLogin} error={authError} />;

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} language={language} currentUserInitials={userName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()} onThemeChange={() => setTheme((prev) => prev === 'light' ? 'dark' : 'light')} onLanguageChange={setLanguage} onSearchChange={setSearchTerm} onLogout={() => { localStorage.removeItem('token'); setToken(null); }} />
          <div className="flex-1 overflow-hidden">
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'deals' && <PipelineView deals={filtered.deals} onAddDeal={async (deal) => { await authFetch('/deals', { method: 'POST', body: JSON.stringify({ name: deal.name, value: deal.value, stage: deal.stage, probability: deal.probability, description: deal.description, close_date: deal.closeDate || null }) }); await loadData(); }} onEditDeal={() => {}} />}
            {activeView === 'contacts' && <ContactsView contacts={filtered.contacts} onAddContact={async (contact) => { await authFetch('/contacts', { method: 'POST', body: JSON.stringify({ first_name: contact.firstName, last_name: contact.lastName, email: contact.email, phone: contact.phone, position: contact.position, department: contact.department }) }); await loadData(); }} onEditContact={() => {}} onDeleteContact={async (id) => { await authFetch(`/contacts/${id}`, { method: 'DELETE' }); await loadData(); }} />}
            {activeView === 'companies' && <CompaniesView companies={filtered.companies} onAddCompany={async (company) => { await authFetch('/companies', { method: 'POST', body: JSON.stringify({ name: company.name, industry: company.industry, website: company.website, email: company.email, phone: company.phone, address: company.address, city: company.city, country: company.country, employees: company.employees, revenue: company.revenue }) }); await loadData(); }} onEditCompany={() => {}} onDeleteCompany={() => {}} />}
            {activeView === 'activities' && <ActivitiesView activities={activities} />}
          </div>
        </div>
      </div>
    </I18nextProvider>
  );
}
