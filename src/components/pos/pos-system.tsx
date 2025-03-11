"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CreditCard,
  DollarSign,
  QrCode,
  Send,
  Printer,
  Percent,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductCatalog from "@/components/pos/product-catalog";
import ServiceCatalog from "@/components/pos/service-catalog";
import CashRegister from "@/components/pos/cash-register";
import CustomerSearch from "@/components/pos/customer-search";
import PaymentModal from "@/components/pos/payment-modal";

export default function POSSystem() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashRegisterOpen, setCashRegisterOpen] = useState(false);
  interface Transaction {
    id: string;
    items: any[];
    customer: any;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    timestamp: Date;
    amount: number;
  }

  const [cashRegisterData, setCashRegisterData] = useState({
    isOpen: false,
    openingBalance: 0,
    currentBalance: 0,
    transactions: [] as Transaction[],
    cashier: "John Doe",
    openTime: null as Date | null,
    closeTime: null as Date | null,
  });

  // Sound effects
  const [audio] = useState({
    addItem:
      typeof Audio !== "undefined" ? new Audio("/sounds/add-item.mp3") : null,
    removeItem:
      typeof Audio !== "undefined"
        ? new Audio("/sounds/remove-item.mp3")
        : null,
    cashRegister:
      typeof Audio !== "undefined"
        ? new Audio("/sounds/cash-register.mp3")
        : null,
    payment:
      typeof Audio !== "undefined"
        ? new Audio("/sounds/payment-success.mp3")
        : null,
  });

  const playSound = (sound: string) => {
    if (audio && audio[sound as keyof typeof audio]) {
      audio[sound as keyof typeof audio]
        ?.play()
        .catch((e) => console.error("Audio playback error:", e));
    }
  };

  const addToCart = (item: any) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === item.type,
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }

    playSound("addItem");
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    playSound("removeItem");
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const newCart = [...cartItems];
    newCart[index].quantity = newQuantity;
    setCartItems(newCart);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleOpenRegister = (openingBalance: number) => {
    setCashRegisterData({
      ...cashRegisterData,
      isOpen: true,
      openingBalance,
      currentBalance: openingBalance,
      openTime: new Date(),
      transactions: [],
    });
    setCashRegisterOpen(false);
    playSound("cashRegister");

    toast({
      title: "Cash Register Opened",
      description: `Opening balance: $${openingBalance.toFixed(2)}`,
    });
  };

  const handleCloseRegister = (closingBalance: number) => {
    const expectedBalance =
      cashRegisterData.openingBalance +
      cashRegisterData.transactions.reduce(
        (sum, t) => (t.paymentMethod === "cash" ? sum + t.amount : sum),
        0,
      );

    const discrepancy = closingBalance - expectedBalance;

    setCashRegisterData({
      ...cashRegisterData,
      isOpen: false,
      closeTime: new Date(),
    });

    playSound("cashRegister");

    toast({
      title: "Cash Register Closed",
      description: `Closing balance: $${closingBalance.toFixed(2)}. ${discrepancy !== 0 ? `Discrepancy: $${discrepancy.toFixed(2)}` : "No discrepancies found."}`,
      variant: discrepancy !== 0 ? "destructive" : "default",
    });
  };

  const handlePayment = (paymentMethod: string) => {
    if (cartItems.length === 0) return;

    const total = calculateTotal();
    const transaction = {
      id: `TRX-${Date.now()}`,
      items: [...cartItems],
      customer: selectedCustomer,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total,
      paymentMethod,
      timestamp: new Date(),
      amount: total,
    };

    // Update cash register data if payment is cash
    if (paymentMethod === "cash" && cashRegisterData.isOpen) {
      setCashRegisterData({
        ...cashRegisterData,
        currentBalance: cashRegisterData.currentBalance + total,
        transactions: [...cashRegisterData.transactions, transaction],
      });
    }

    // Clear cart and close payment modal
    setCartItems([]);
    setShowPaymentModal(false);
    playSound("payment");

    toast({
      title: "Payment Successful",
      description: `$${total.toFixed(2)} paid with ${paymentMethod}. Receipt generated.`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <div className="flex gap-2">
          {!cashRegisterData.isOpen ? (
            <Button
              onClick={() => setCashRegisterOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Open Cash Register
            </Button>
          ) : (
            <Button
              onClick={() => setCashRegisterOpen(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              Close Cash Register
            </Button>
          )}
        </div>
      </div>

      {cashRegisterOpen && (
        <CashRegister
          isOpen={cashRegisterData.isOpen}
          onOpenRegister={handleOpenRegister}
          onCloseRegister={handleCloseRegister}
          currentData={cashRegisterData}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Left Panel - Catalog */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {activeTab === "products" ? (
                <ProductCatalog onAddToCart={addToCart} />
              ) : (
                <ServiceCatalog onAddToCart={addToCart} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart & Customer */}
        <div className="flex flex-col gap-4">
          {/* Customer Selection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedCustomer.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <CustomerSearch onSelectCustomer={setSelectedCustomer} />
              )}
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Shopping Cart</CardTitle>
                {cartItems.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setCartItems([])}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
              {cartItems.length > 0 ? (
                <div className="flex-1 overflow-auto mb-4">
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border rounded-md"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{item.name}</p>
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type === "product" ? "Product" : "Service"}
                            </Badge>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateQuantity(index, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateQuantity(index, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeFromCart(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">
                    Add products or services to get started
                  </p>
                </div>
              )}

              {/* Cart Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-[#FC8D68] hover:bg-[#e87e5c]"
                  disabled={cartItems.length === 0 || !cashRegisterData.isOpen}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </Button>

                {!cashRegisterData.isOpen && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Cash register must be open to process transactions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          total={calculateTotal()}
          onPayment={handlePayment}
          customer={selectedCustomer}
          items={cartItems}
        />
      )}
    </div>
  );
}
