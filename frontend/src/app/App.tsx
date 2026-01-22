import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { Sidebar } from '@/app/components/Sidebar';
import { Header } from '@/app/components/Header';
import { DashboardView } from '@/app/components/DashboardView';
import { PipelineView } from '@/app/components/PipelineView';
import { ContactsView } from '@/app/components/ContactsView';
import { CompaniesView } from '@/app/components/CompaniesView';

// Mock data types
interface Deal {
  id: string;
  name: string;
  value: number;
  company: string;
  owner: string;
  closeDate: string;
  stage: string;
  probability: number;
  description: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  department: string;
  owner: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  employees: number;
  revenue: number;
  owner: string;
}

const initialDeals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    value: 45000,
    company: 'Acme Corp',
    owner: 'John Doe',
    closeDate: '2026-02-15',
    stage: 'qualified',
    probability: 70,
    description: 'Annual license for enterprise software platform',
  },
  {
    id: '2',
    name: 'Marketing Campaign',
    value: 12000,
    company: 'Tech Solutions',
    owner: 'Jane Smith',
    closeDate: '2026-02-20',
    stage: 'contact',
    probability: 50,
    description: 'Digital marketing campaign for Q1',
  },
  {
    id: '3',
    name: 'Cloud Migration',
    value: 78000,
    company: 'Global Inc',
    owner: 'Mike Johnson',
    closeDate: '2026-03-01',
    stage: 'demo',
    probability: 60,
    description: 'Migration to cloud infrastructure',
  },
  {
    id: '4',
    name: 'Website Redesign',
    value: 25000,
    company: 'StartUp Ltd',
    owner: 'Sarah Williams',
    closeDate: '2026-02-28',
    stage: 'proposal',
    probability: 75,
    description: 'Complete website redesign and development',
  },
  {
    id: '5',
    name: 'Custom Development',
    value: 95000,
    company: 'Innovation Co',
    owner: 'Tom Brown',
    closeDate: '2026-03-15',
    stage: 'negotiation',
    probability: 85,
    description: 'Custom software development project',
  },
  {
    id: '6',
    name: 'SaaS Subscription',
    value: 18000,
    company: 'Digital Agency',
    owner: 'Emily Davis',
    closeDate: '2026-01-30',
    stage: 'won',
    probability: 100,
    description: 'Annual SaaS platform subscription',
  },
  {
    id: '7',
    name: 'Training Program',
    value: 8500,
    company: 'Learning Hub',
    owner: 'John Doe',
    closeDate: '2026-02-10',
    stage: 'qualified',
    probability: 65,
    description: 'Employee training and development program',
  },
  {
    id: '8',
    name: 'Data Analytics Platform',
    value: 62000,
    company: 'Data Corp',
    owner: 'Jane Smith',
    closeDate: '2026-03-20',
    stage: 'demo',
    probability: 70,
    description: 'Implementation of data analytics solution',
  },
];

const initialContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    phone: '+1 555-0101',
    company: 'Acme Corp',
    position: 'CTO',
    department: 'Technology',
    owner: 'John Doe',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@techsolutions.com',
    phone: '+1 555-0102',
    company: 'Tech Solutions',
    position: 'Marketing Director',
    department: 'Marketing',
    owner: 'Jane Smith',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'm.chen@globalinc.com',
    phone: '+1 555-0103',
    company: 'Global Inc',
    position: 'VP of Operations',
    department: 'Operations',
    owner: 'Mike Johnson',
  },
];

const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    industry: 'Technology',
    website: 'acmecorp.com',
    email: 'info@acmecorp.com',
    phone: '+1 555-1000',
    address: '123 Tech Street',
    city: 'San Francisco',
    country: 'USA',
    employees: 500,
    revenue: 50000000,
    owner: 'John Doe',
  },
  {
    id: '2',
    name: 'Tech Solutions',
    industry: 'Software',
    website: 'techsolutions.com',
    email: 'contact@techsolutions.com',
    phone: '+1 555-2000',
    address: '456 Innovation Ave',
    city: 'Austin',
    country: 'USA',
    employees: 200,
    revenue: 25000000,
    owner: 'Jane Smith',
  },
  {
    id: '3',
    name: 'Global Inc',
    industry: 'Consulting',
    website: 'globalinc.com',
    email: 'hello@globalinc.com',
    phone: '+1 555-3000',
    address: '789 Business Blvd',
    city: 'New York',
    country: 'USA',
    employees: 1000,
    revenue: 100000000,
    owner: 'Mike Johnson',
  },
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'de'>('en');
  const [activeView, setActiveView] = useState('dashboard');
  
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Change language
    i18n.changeLanguage(language);
  }, [language]);

  const handleThemeChange = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (lang: 'en' | 'de') => {
    setLanguage(lang);
  };

  // Deal handlers
  const handleAddDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal = {
      ...deal,
      id: Date.now().toString(),
    };
    setDeals([...deals, newDeal]);
  };

  const handleEditDeal = (updatedDeal: Deal) => {
    setDeals(deals.map((deal) => (deal.id === updatedDeal.id ? updatedDeal : deal)));
  };

  // Contact handlers
  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, newContact]);
  };

  const handleEditContact = (updatedContact: Contact) => {
    setContacts(contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  // Company handlers
  const handleAddCompany = (company: Omit<Company, 'id'>) => {
    const newCompany = {
      ...company,
      id: Date.now().toString(),
    };
    setCompanies([...companies, newCompany]);
  };

  const handleEditCompany = (updatedCompany: Company) => {
    setCompanies(companies.map((company) => (company.id === updatedCompany.id ? updatedCompany : company)));
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'deals':
        return <PipelineView deals={deals} onAddDeal={handleAddDeal} onEditDeal={handleEditDeal} />;
      case 'contacts':
        return (
          <ContactsView
            contacts={contacts}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
          />
        );
      case 'companies':
        return (
          <CompaniesView
            companies={companies}
            onAddCompany={handleAddCompany}
            onEditCompany={handleEditCompany}
            onDeleteCompany={handleDeleteCompany}
          />
        );
      case 'activities':
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activities</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Activities view coming soon...
            </p>
          </div>
        );
      case 'reports':
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Reports view coming soon...
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Settings view coming soon...
            </p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            theme={theme}
            language={language}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
          />
          <div className="flex-1 overflow-hidden">
            {renderView()}
          </div>
        </div>
      </div>
    </I18nextProvider>
  );
}
