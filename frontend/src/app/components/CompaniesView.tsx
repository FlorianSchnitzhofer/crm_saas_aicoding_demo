import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Globe, Mail, Phone, MapPin, Users, DollarSign, Edit, Trash2 } from 'lucide-react';
import { CompanyDialog } from './CompanyDialog';

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

interface CompaniesViewProps {
  companies: Company[];
  onAddCompany: (company: Omit<Company, 'id'>) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export function CompaniesView({ companies, onAddCompany, onEditCompany, onDeleteCompany }: CompaniesViewProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setIsDialogOpen(true);
  };

  const handleSave = (company: Omit<Company, 'id'> | Company) => {
    if ('id' in company) {
      onEditCompany(company);
    } else {
      onAddCompany(company);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('companies')}</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addCompany')}
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No companies yet</p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('createFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{company.industry}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCompany(company.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{t('employees')}</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {company.employees.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{t('revenue')}</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${(company.revenue / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {company.website && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4" />
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                {company.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${company.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {company.email}
                    </a>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${company.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {company.phone}
                    </a>
                  </div>
                )}

                {(company.address || company.city) && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {company.address && `${company.address}, `}
                      {company.city}
                      {company.country && `, ${company.country}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Owner: {company.owner}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CompanyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        company={selectedCompany}
      />
    </div>
  );
}
