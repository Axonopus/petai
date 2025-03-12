"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  CreditCard,
  DollarSign,
  QrCode,
  Percent,
  Check,
} from "lucide-react";
import { createClient } from "../../../../../supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import POSProductCard from "@/components/pos/pos-product-card";
import POSServiceCard from "@/components/pos/pos-service-card";
import POSPaymentModal from "@/components/pos/pos-payment-modal";
import POSCustomerSelect from "@/components/pos/pos-customer-select";

// Define types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "service";
  petId?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  pets: { id: string; name: string; breed: string }[];
}

interface Discount {
  id: number;
  name: string;
  type: "percentage" | "fixed";
  value: string;
}

export default function NewTransactionPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [taxRate, setTaxRate] = useState(8.5);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    { id: string; name: string; enabled: boolean }[]
  >([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [successSound, setSuccessSound] = useState("/sounds/success.mp3");
  const [errorSound, setErrorSound] = useState("/sounds/error.mp3");
  const [scanSound, setScanSound] = useState("/sounds/scan-beep.mp3");

  const router = useRouter();
  const supabase = createClient();

  // Mock data for products and services
  const products = [
    {
      id: "p1",
      name: "Dog Food (Premium)",
      price: 45.99,
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&q=80",
      category: "Food",
    },
    {
      id: "p2",
      name: "Cat Food (Premium)",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&q=80",
      category: "Food",
    },
    {
      id: "p3",
      name: "Dog Toy Bundle",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=150&q=80",
      category: "Toys",
    },
    {
      id: "p4",
      name: "Cat Toy Set",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=150&q=80",
      category: "Toys",
    },
    {
      id: "p5",
      name: "Pet Shampoo",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=150&q=80",
      category: "Grooming",
    },
    {
      id: "p6",
      name: "Pet Brush",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=150&q=80",
      category: "Grooming",
    },
  ];

  const services = [
    {
      id: "s1",
      name: "Basic Grooming",
      price: 35.0,
      image:
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&q=80",
      category: "Grooming",
    },
    {
      id: "s2",
      name: "Full Grooming",
      price: 65.0,
      image:
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&q=80",
      category: "Grooming",
    },
    {
      id: "s3",
      name: "Nail Trim",
      price: 15.0,
      image:
        "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=150&q=80",
      category: "Grooming",
    },
    {
      id: "s4",
      name: "Bath & Brush",
      price: 25.0,
      image:
        "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=150&q=80",
      category: "Grooming",
    },
    {
      id: "s5",
      name: "Daycare (Full Day)",
      price: 35.0,
      image:
        "https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?w=150&q=80",
      category: "Daycare",
    },
    {
      id: "s6",
      name: "Boarding (Per Night)",
      price: 45.0,
      image:
        "https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?w=150&q=80",
      category: "Boarding",
    },
  ];

  // Fetch POS settings from Supabase
  useEffect(() => {
    async function fetchPOSSettings() {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("pos_settings")
          .select("*")
          .eq("business_id", user.user.id)
          .single();

        if (error) {
          console.error("Error fetching POS settings:", error);
          return;
        }

        if (data) {
          // Set tax rate
          if (data.default_tax_rate) {
            setTaxRate(data.default_tax_rate);
          }

          // Set available discounts
          if (data.predefined_discounts) {
            setAvailableDiscounts(data.predefined_discounts);
          }

          // Set payment methods
          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
          }

          // Set sound settings
          setSoundEnabled(data.sound_enabled !== false);
          if (data.success_sound) setSuccessSound(data.success_sound);
          if (data.error_sound) setErrorSound(data.error_sound);
          if (data.scan_sound) setScanSound(data.scan_sound);
        }
      } catch (error) {
        console.error("Error in fetchPOSSettings:", error);
      }
    }

    fetchPOSSettings();
  }, []);

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "percentage"
      ? (subtotal * parseFloat(appliedDiscount.value)) / 100
      : parseFloat(appliedDiscount.value)
    : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = (discountedSubtotal * taxRate) / 100;
  const total = discountedSubtotal + taxAmount;

  // Filter products/services based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Add item to cart
  const addToCart = (
    item: { id: string; name: string; price: number },
    type: "product" | "service",
  ) => {
    // Play scan sound
    if (soundEnabled) {
      const audio = new Audio(scanSound);
      audio.play().catch((e) => console.error("Error playing sound:", e));
    }

    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === type,
    );

    if (existingItemIndex !== -1) {
      // Item already in cart, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1, type }]);
    }
  };

  // Update item quantity in cart
  const updateQuantity = (
    id: string,
    type: "product" | "service",
    newQuantity: number,
  ) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart(cart.filter((item) => !(item.id === id && item.type === type)));
    } else {
      // Update quantity
      setCart(
        cart.map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string, type: "product" | "service") => {
    setCart(cart.filter((item) => !(item.id === id && item.type === type)));
  };

  // Apply discount to cart
  const applyDiscount = (discount: Discount | null) => {
    setAppliedDiscount(discount);
  };

  // Process payment
  const processPayment = async (paymentMethod: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Generate transaction ID
      const transactionId = `TRX-${Date.now().toString().slice(-6)}`;

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from("pos_transactions")
        .insert({
          transaction_id: transactionId,
          business_id: user.user.id,
          customer_id: selectedCustomer?.id || null,
          subtotal,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          total_amount: total,
          payment_method: paymentMethod,
          status: "completed",
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
            pet_id: item.petId || null,
          })),
          discount_applied: appliedDiscount
            ? {
                name: appliedDiscount.name,
                type: appliedDiscount.type,
                value: appliedDiscount.value,
              }
            : null,
          tax_rate: taxRate,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Play success sound
      if (soundEnabled) {
        const audio = new Audio(successSound);
        audio.play().catch((e) => console.error("Error playing sound:", e));
      }

      // Redirect to transaction success page
      router.push(`/dashboard/pos/transaction/${transaction.id}`);
    } catch (error) {
      console.error("Error processing payment:", error);

      // Play error sound
      if (soundEnabled) {
        const audio = new Audio(errorSound);
        audio.play().catch((e) => console.error("Error playing sound:", e));
      }

      alert("Payment processing failed. Please try again.");
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/pos">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to POS
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">New Transaction</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products/Services Selection */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Select Items</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="products"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <POSProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addToCart(product, "product")}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="services" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredServices.map((service) => (
                      <POSServiceCard
                        key={service.id}
                        service={service}
                        onAddToCart={() => addToCart(service, "service")}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Cart & Checkout */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Cart</CardTitle>
                <POSCustomerSelect
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={setSelectedCustomer}
                />
              </div>
              {selectedCustomer && (
                <div className="flex items-center mt-2 p-2 bg-gray-50 rounded-md">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium">{selectedCustomer.name}</span>
                    <span className="text-gray-500 text-xs block">
                      {selectedCustomer.email}
                    </span>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Your cart is empty</p>
                  <p className="text-sm">
                    Add products or services to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.type,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeFromCart(item.id, item.type)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Discount Selection */}
              {cart.length > 0 && availableDiscounts.length > 0 && (
                <div className="mt-4 p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">Apply Discount</Label>
                    {appliedDiscount && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-red-500"
                        onClick={() => applyDiscount(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableDiscounts.map((discount) => (
                      <Button
                        key={discount.id}
                        variant={
                          appliedDiscount?.id === discount.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={
                          appliedDiscount?.id === discount.id
                            ? "bg-[#FC8D68] hover:bg-[#e87e5c]"
                            : ""
                        }
                        onClick={() => applyDiscount(discount)}
                      >
                        {discount.name}
                        {discount.type === "percentage" ? (
                          <Percent className="ml-1 h-3 w-3" />
                        ) : (
                          <DollarSign className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-shrink-0 border-t pt-4">
              <div className="w-full">
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedDiscount.name})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax ({taxRate}%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <POSPaymentModal
          total={total}
          paymentMethods={paymentMethods.filter((method) => method.enabled)}
          onClose={() => setShowPaymentModal(false)}
          onProcessPayment={processPayment}
        />
      )}
    </div>
  );
}
