import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Mail, Phone, Building2, Edit, Trash2 } from 'lucide-react';
import { ContactDialog } from './ContactDialog';

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

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

export function ContactsView({ contacts, onAddContact, onEditContact, onDeleteContact }: ContactsViewProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const handleSave = (contact: Omit<Contact, 'id'> | Contact) => {
    if ('id' in contact) {
      onEditContact(contact);
    } else {
      onAddContact(contact);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('contacts')}</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addContact')}
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('noContacts')}</p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('createFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.position}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {contact.email}
                  </a>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${contact.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {contact.phone}
                    </a>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{contact.company}</span>
                  </div>
                )}

                {contact.department && (
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {contact.department}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Owner: {contact.owner}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        contact={selectedContact}
      />
    </div>
  );
}
