"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  QrCode,
  Printer,
  Send,
  Check,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPayment: (method: string) => void;
  customer: any;
  items: any[];
}

export default function PaymentModal({
  isOpen,
  onClose,
  total,
  onPayment,
  customer,
  items,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cashAmount, setCashAmount] = useState("");
  const [cardProcessing, setCardProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [emailReceipt, setEmailReceipt] = useState(true);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [notes, setNotes] = useState("");

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCashAmount(value);
  };

  const calculateChange = () => {
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount < total) return 0;
    return amount - total;
  };

  const handlePayment = () => {
    if (
      paymentMethod === "cash" &&
      (parseFloat(cashAmount) < total || isNaN(parseFloat(cashAmount)))
    ) {
      return; // Cash amount is insufficient
    }

    if (paymentMethod === "card") {
      // Simulate card processing
      setCardProcessing(true);
      setTimeout(() => {
        setCardProcessing(false);
        setPaymentComplete(true);
        setTimeout(() => {
          onPayment(paymentMethod);
        }, 1000);
      }, 2000);
    } else {
      // Cash or QR payment
      setPaymentComplete(true);
      setTimeout(() => {
        onPayment(paymentMethod);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Complete the transaction with your preferred payment method.
          </DialogDescription>
        </DialogHeader>

        {paymentComplete ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-1">Payment Successful</h3>
            <p className="text-gray-500 mb-4">Transaction has been completed</p>
            <div className="flex gap-2">
              {emailReceipt && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Send className="h-3 w-3 mr-1" />
                  Email Receipt Sent
                </Badge>
              )}
              {printReceipt && (
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  <Printer className="h-3 w-3 mr-1" />
                  Receipt Printed
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>

              {customer && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium">Customer: </span>
                  <span className="text-sm">{customer.name}</span>
                  {customer.loyaltyPoints > 0 && (
                    <Badge className="ml-2 bg-[#FC8D68] hover:bg-[#e87e5c]">
                      {customer.loyaltyPoints} Loyalty Points
                    </Badge>
                  )}
                </div>
              )}

              <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="card" className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="cash" className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Cash
                  </TabsTrigger>
                  <TabsTrigger
                    value="qrpay"
                    className="flex items-center gap-1"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Pay
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card">
                  {cardProcessing ? (
                    <div className="py-8 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-t-[#FC8D68] border-gray-200 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Processing payment...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Process card payment through your connected terminal or
                        manually enter card details.
                      </p>
                      <Button
                        className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                        onClick={handlePayment}
                      >
                        Process Card Payment
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cash">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cash-amount">Cash Amount Received</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="cash-amount"
                          className="pl-7"
                          placeholder="0.00"
                          value={cashAmount}
                          onChange={handleCashAmountChange}
                        />
                      </div>
                    </div>

                    {parseFloat(cashAmount) >= total && (
                      <div className="p-3 bg-green-50 rounded-md flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">
                          Change Due:
                        </span>
                        <span className="text-lg font-bold text-green-800">
                          ${calculateChange().toFixed(2)}
                        </span>
                      </div>
                    )}

                    <Button
                      className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                      disabled={
                        parseFloat(cashAmount) < total ||
                        isNaN(parseFloat(cashAmount))
                      }
                      onClick={handlePayment}
                    >
                      Complete Cash Payment
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="qrpay">
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-md flex items-center justify-center">
                      <div className="w-48 h-48 bg-white p-2 rounded-md">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gopet.ai/payment/123456"
                          alt="Payment QR Code"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Scan this QR code with your payment app to complete the
                      transaction.
                    </p>
                    <Button
                      className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
                      onClick={handlePayment}
                    >
                      Confirm QR Payment
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="transaction-notes">
                  Transaction Notes (Optional)
                </Label>
                <Textarea
                  id="transaction-notes"
                  placeholder="Add any notes about this transaction..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="email-receipt"
                    checked={emailReceipt}
                    onChange={(e) => setEmailReceipt(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="email-receipt"
                    className="text-sm cursor-pointer"
                  >
                    Email Receipt
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="print-receipt"
                    checked={printReceipt}
                    onChange={(e) => setPrintReceipt(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="print-receipt"
                    className="text-sm cursor-pointer"
                  >
                    Print Receipt
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
