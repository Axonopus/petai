"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

export default function CustomerSearch({
  onSelectCustomer,
}: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: "c1",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 123-4567",
      loyaltyPoints: 8,
    },
    {
      id: "c2",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 234-5678",
      loyaltyPoints: 5,
    },
    {
      id: "c3",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 345-6789",
      loyaltyPoints: 12,
    },
    {
      id: "c4",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 456-7890",
      loyaltyPoints: 3,
    },
    {
      id: "c5",
      name: "Jessica Wilson",
      email: "jessica.wilson@example.com",
      phone: "(555) 567-8901",
      loyaltyPoints: 7,
    },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowResults(searchTerm.length > 0)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          New
        </Button>
      </div>

      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCustomers.length > 0 ? (
            <ul className="py-1">
              {filteredCustomers.map((customer) => (
                <li
                  key={customer.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-xs text-gray-500">
                    {customer.email} • {customer.phone}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No customers found. Try a different search or create a new
              customer.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
