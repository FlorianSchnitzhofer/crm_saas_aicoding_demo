import { useState, useEffect } from "react";
import type { Contact } from "@/types/api";
import { apiClient } from "@/services/api";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Mail, Phone, Building2 } from "lucide-react";
import { LoadingState } from "../Common/LoadingState";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

export function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getContacts();
      setContacts(response.data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setError(err instanceof Error ? err.message : "Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => {
          const initials = contact.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);

          return (
            <div
              key={contact.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {contact.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {contact.organization_id && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{contact.organization_id}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No contacts found
        </div>
      )}
    </div>
  );
}
