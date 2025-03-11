"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  type: string;
  sku: string;
  stock: number;
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock product data
  const products: Product[] = [
    {
      id: "p1",
      name: "Premium Dog Food (5kg)",
      price: 45.99,
      category: "food",
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&q=80",
      type: "product",
      sku: "DF-5001",
      stock: 24,
    },
    {
      id: "p2",
      name: "Cat Litter (10L)",
      price: 18.5,
      category: "supplies",
      image:
        "https://images.unsplash.com/photo-1604542031658-5799ca5d7936?w=100&q=80",
      type: "product",
      sku: "CL-2002",
      stock: 32,
    },
    {
      id: "p3",
      name: "Dog Collar - Medium",
      price: 12.99,
      category: "accessories",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=100&q=80",
      type: "product",
      sku: "DC-3003",
      stock: 15,
    },
    {
      id: "p4",
      name: "Cat Toy Set",
      price: 9.99,
      category: "toys",
      image:
        "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=100&q=80",
      type: "product",
      sku: "CT-4004",
      stock: 28,
    },
    {
      id: "p5",
      name: "Pet Shampoo (500ml)",
      price: 14.5,
      category: "grooming",
      image:
        "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=100&q=80",
      type: "product",
      sku: "PS-5005",
      stock: 20,
    },
    {
      id: "p6",
      name: "Dog Brush",
      price: 8.99,
      category: "grooming",
      image:
        "https://images.unsplash.com/photo-1559563458-c667ba5f5480?w=100&q=80",
      type: "product",
      sku: "DB-6006",
      stock: 18,
    },
    {
      id: "p7",
      name: "Cat Food - Indoor Formula (2kg)",
      price: 22.99,
      category: "food",
      image:
        "https://images.unsplash.com/photo-1600357077527-930ccbaf7773?w=100&q=80",
      type: "product",
      sku: "CF-7007",
      stock: 22,
    },
    {
      id: "p8",
      name: "Dog Chew Toy",
      price: 7.5,
      category: "toys",
      image:
        "https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=100&q=80",
      type: "product",
      sku: "DT-8008",
      stock: 30,
    },
    {
      id: "p9",
      name: "Pet Bed - Small",
      price: 29.99,
      category: "accessories",
      image:
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&q=80",
      type: "product",
      sku: "PB-9009",
      stock: 12,
    },
    {
      id: "p10",
      name: "Flea & Tick Treatment",
      price: 35.0,
      category: "health",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&q=80",
      type: "product",
      sku: "FT-1010",
      stock: 25,
    },
    {
      id: "p11",
      name: "Pet Vitamins",
      price: 19.99,
      category: "health",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=100&q=80",
      type: "product",
      sku: "PV-1011",
      stock: 40,
    },
    {
      id: "p12",
      name: "Litter Box",
      price: 24.5,
      category: "supplies",
      image:
        "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=100&q=80",
      type: "product",
      sku: "LB-1012",
      stock: 15,
    },
  ];

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(products.map((product) => product.category)),
  );
  const categories = ["all", ...uniqueCategories];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name or SKU..."
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[calc(100vh-20rem)] overflow-y-auto p-1">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-3 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onAddToCart(product)}
            >
              <div className="h-20 w-full mb-2 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">{product.sku}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${product.stock < 5 ? "text-red-500" : ""}`}
                  >
                    {product.stock} in stock
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <Button size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
