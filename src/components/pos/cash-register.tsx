"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CashRegisterProps {
  isOpen: boolean;
  onOpenRegister: (openingBalance: number) => void;
  onCloseRegister: (closingBalance: number) => void;
  currentData: any;
}

export default function CashRegister({
  isOpen,
  onOpenRegister,
  onCloseRegister,
  currentData,
}: CashRegisterProps) {
  const [openingBalance, setOpeningBalance] = useState("100.00");
  const [closingBalance, setClosingBalance] = useState("");
  const [showDialog, setShowDialog] = useState(true);

  const handleSubmit = () => {
    if (isOpen) {
      // Closing register
      const closingAmount = parseFloat(closingBalance);
      if (isNaN(closingAmount) || closingAmount < 0) return;
      onCloseRegister(closingAmount);
    } else {
      // Opening register
      const openingAmount = parseFloat(openingBalance);
      if (isNaN(openingAmount) || openingAmount < 0) return;
      onOpenRegister(openingAmount);
    }
    setShowDialog(false);
  };

  // Calculate expected closing balance if register is being closed
  const calculateExpectedBalance = () => {
    if (!isOpen || !currentData) return 0;

    const cashTransactionsTotal = currentData.transactions
      .filter((t: any) => t.paymentMethod === "cash")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return currentData.openingBalance + cashTransactionsTotal;
  };

  const expectedBalance = calculateExpectedBalance();

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isOpen ? "Close Cash Register" : "Open Cash Register"}
          </DialogTitle>
          <DialogDescription>
            {isOpen
              ? "Count the cash in your register and enter the closing balance."
              : "Enter the opening cash balance to start your shift."}
          </DialogDescription>
        </DialogHeader>

        {isOpen ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opening-balance">Opening Balance</Label>
              <Input
                id="opening-balance"
                value={`$${currentData.openingBalance.toFixed(2)}`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cash-transactions">Cash Transactions</Label>
              <Input
                id="cash-transactions"
                value={`$${(expectedBalance - currentData.openingBalance).toFixed(2)}`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected-balance">Expected Closing Balance</Label>
              <Input
                id="expected-balance"
                value={`$${expectedBalance.toFixed(2)}`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing-balance">Actual Closing Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="closing-balance"
                  className="pl-7"
                  placeholder="0.00"
                  value={closingBalance}
                  onChange={(e) => {
                    // Allow only numbers and decimal point
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setClosingBalance(value);
                  }}
                />
              </div>
            </div>

            {closingBalance && (
              <div className="space-y-2">
                <Label>Discrepancy</Label>
                <div
                  className={`p-3 rounded-md ${parseFloat(closingBalance) !== expectedBalance ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
                >
                  {parseFloat(closingBalance) !== expectedBalance ? (
                    <>
                      <span className="font-medium">
                        $
                        {Math.abs(
                          parseFloat(closingBalance) - expectedBalance,
                        ).toFixed(2)}
                      </span>
                      <span>
                        {parseFloat(closingBalance) > expectedBalance
                          ? " over"
                          : " short"}
                      </span>
                    </>
                  ) : (
                    <span>No discrepancy</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opening-balance">Opening Cash Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="opening-balance"
                  className="pl-7"
                  placeholder="0.00"
                  value={openingBalance}
                  onChange={(e) => {
                    // Allow only numbers and decimal point
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setOpeningBalance(value);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter the amount of cash in the register at the start of your
                shift.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isOpen ? "Close Register" : "Open Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
