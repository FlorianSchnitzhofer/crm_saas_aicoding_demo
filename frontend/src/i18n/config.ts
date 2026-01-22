import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      deals: 'Deals',
      contacts: 'Contacts',
      companies: 'Companies',
      activities: 'Activities',
      reports: 'Reports',
      settings: 'Settings',
      
      // Pipeline
      newDeal: 'New Deal',
      qualified: 'Qualified',
      contact: 'Contact',
      demo: 'Demo',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      won: 'Won',
      lost: 'Lost',
      
      // Actions
      addDeal: 'Add Deal',
      addContact: 'Add Contact',
      addCompany: 'Add Company',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      
      // Details
      dealName: 'Deal Name',
      contactName: 'Contact Name',
      companyName: 'Company Name',
      email: 'Email',
      phone: 'Phone',
      value: 'Value',
      stage: 'Stage',
      owner: 'Owner',
      closeDate: 'Close Date',
      probability: 'Probability',
      description: 'Description',
      
      // Stats
      totalValue: 'Total Value',
      totalDeals: 'Total Deals',
      winRate: 'Win Rate',
      avgDealSize: 'Avg. Deal Size',
      
      // Messages
      noDeals: 'No deals yet',
      noContacts: 'No contacts yet',
      createFirst: 'Create your first one',
      
      // Form fields
      firstName: 'First Name',
      lastName: 'Last Name',
      title: 'Title',
      industry: 'Industry',
      website: 'Website',
      address: 'Address',
      city: 'City',
      country: 'Country',
      notes: 'Notes',
      required: 'Required',
      
      // Contact fields
      position: 'Position',
      department: 'Department',
      
      // Company fields
      employees: 'Employees',
      revenue: 'Revenue',
      
      // Actions
      createDeal: 'Create Deal',
      editDeal: 'Edit Deal',
      createContact: 'Create Contact',
      editContact: 'Edit Contact',
      createCompany: 'Create Company',
      editCompany: 'Edit Company',
      close: 'Close',
    },
  },
  de: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      deals: 'Geschäfte',
      contacts: 'Kontakte',
      companies: 'Unternehmen',
      activities: 'Aktivitäten',
      reports: 'Berichte',
      settings: 'Einstellungen',
      
      // Pipeline
      newDeal: 'Neues Geschäft',
      qualified: 'Qualifiziert',
      contact: 'Kontakt',
      demo: 'Demo',
      proposal: 'Angebot',
      negotiation: 'Verhandlung',
      won: 'Gewonnen',
      lost: 'Verloren',
      
      // Actions
      addDeal: 'Geschäft hinzufügen',
      addContact: 'Kontakt hinzufügen',
      addCompany: 'Unternehmen hinzufügen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      search: 'Suchen',
      filter: 'Filtern',
      
      // Details
      dealName: 'Geschäftsname',
      contactName: 'Kontaktname',
      companyName: 'Unternehmensname',
      email: 'E-Mail',
      phone: 'Telefon',
      value: 'Wert',
      stage: 'Phase',
      owner: 'Verantwortlicher',
      closeDate: 'Abschlussdatum',
      probability: 'Wahrscheinlichkeit',
      description: 'Beschreibung',
      
      // Stats
      totalValue: 'Gesamtwert',
      totalDeals: 'Gesamt Geschäfte',
      winRate: 'Erfolgsquote',
      avgDealSize: 'Durchschn. Geschäftsgröße',
      
      // Messages
      noDeals: 'Noch keine Geschäfte',
      noContacts: 'Noch keine Kontakte',
      createFirst: 'Erstellen Sie Ihr erstes',
      
      // Form fields
      firstName: 'Vorname',
      lastName: 'Nachname',
      title: 'Titel',
      industry: 'Branche',
      website: 'Webseite',
      address: 'Adresse',
      city: 'Stadt',
      country: 'Land',
      notes: 'Notizen',
      required: 'Erforderlich',
      
      // Contact fields
      position: 'Position',
      department: 'Abteilung',
      
      // Company fields
      employees: 'Mitarbeiter',
      revenue: 'Umsatz',
      
      // Actions
      createDeal: 'Geschäft erstellen',
      editDeal: 'Geschäft bearbeiten',
      createContact: 'Kontakt erstellen',
      editContact: 'Kontakt bearbeiten',
      createCompany: 'Unternehmen erstellen',
      editCompany: 'Unternehmen bearbeiten',
      close: 'Schließen',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;