"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  duration: string;
  type: string;
  code: string;
  description: string;
}

interface ServiceCatalogProps {
  onAddToCart: (service: Service) => void;
}

export default function ServiceCatalog({ onAddToCart }: ServiceCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock service data
  const services: Service[] = [
    {
      id: "s1",
      name: "Basic Grooming - Small Dog",
      price: 35.0,
      category: "grooming",
      duration: "45 min",
      type: "service",
      code: "GRM-S",
      description: "Bath, brush, nail trim, ear cleaning",
    },
    {
      id: "s2",
      name: "Basic Grooming - Medium Dog",
      price: 45.0,
      category: "grooming",
      duration: "60 min",
      type: "service",
      code: "GRM-M",
      description: "Bath, brush, nail trim, ear cleaning",
    },
    {
      id: "s3",
      name: "Basic Grooming - Large Dog",
      price: 55.0,
      category: "grooming",
      duration: "75 min",
      type: "service",
      code: "GRM-L",
      description: "Bath, brush, nail trim, ear cleaning",
    },
    {
      id: "s4",
      name: "Full Grooming - Small Dog",
      price: 55.0,
      category: "grooming",
      duration: "60 min",
      type: "service",
      code: "GRM-FS",
      description: "Bath, haircut, brush, nail trim, ear cleaning",
    },
    {
      id: "s5",
      name: "Full Grooming - Medium Dog",
      price: 65.0,
      category: "grooming",
      duration: "75 min",
      type: "service",
      code: "GRM-FM",
      description: "Bath, haircut, brush, nail trim, ear cleaning",
    },
    {
      id: "s6",
      name: "Full Grooming - Large Dog",
      price: 75.0,
      category: "grooming",
      duration: "90 min",
      type: "service",
      code: "GRM-FL",
      description: "Bath, haircut, brush, nail trim, ear cleaning",
    },
    {
      id: "s7",
      name: "Nail Trim Only",
      price: 15.0,
      category: "grooming",
      duration: "15 min",
      type: "service",
      code: "GRM-NT",
      description: "Nail trimming service only",
    },
    {
      id: "s8",
      name: "Daycare - Half Day",
      price: 20.0,
      category: "daycare",
      duration: "5 hours",
      type: "service",
      code: "DAY-H",
      description: "5 hours of supervised play and care",
    },
    {
      id: "s9",
      name: "Daycare - Full Day",
      price: 35.0,
      category: "daycare",
      duration: "10 hours",
      type: "service",
      code: "DAY-F",
      description: "Full day of supervised play and care",
    },
    {
      id: "s10",
      name: "Boarding - One Night",
      price: 45.0,
      category: "boarding",
      duration: "24 hours",
      type: "service",
      code: "BRD-1",
      description: "Overnight stay with feeding and walks",
    },
    {
      id: "s11",
      name: "Boarding - Premium Suite",
      price: 65.0,
      category: "boarding",
      duration: "24 hours",
      type: "service",
      code: "BRD-P",
      description: "Overnight stay in premium suite with extra amenities",
    },
    {
      id: "s12",
      name: "Basic Health Check",
      price: 40.0,
      category: "health",
      duration: "30 min",
      type: "service",
      code: "HLT-B",
      description: "Basic health assessment and consultation",
    },
  ];

  // Filter services based on search term and category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "all",
    ...new Set(services.map((service) => service.category)),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services by name or code..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto bg-transparent p-0 mb-4">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="capitalize mr-2 mb-2 data-[state=active]:bg-[#FC8D68] data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-20rem)] overflow-y-auto p-1">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onAddToCart(service)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm line-clamp-2 flex-1">
                  {service.name}
                </h3>
                <Badge className="ml-2 bg-[#FC8D68] hover:bg-[#e87e5c]">
                  {service.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center mt-2">
                <Clock className="h-3 w-3 text-gray-500 mr-1" />
                <span className="text-xs text-gray-500">
                  {service.duration}
                </span>
                <span className="text-xs text-gray-500 ml-3 mr-1">Code:</span>
                <span className="text-xs font-medium">{service.code}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t">
                <span className="font-bold">${service.price.toFixed(2)}</span>
                <Button size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No services found matching your search.
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
