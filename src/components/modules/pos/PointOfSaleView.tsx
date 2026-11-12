"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Printer,
  CheckCircle2,
  Search,
  ShoppingCart,
  Banknote,
} from "lucide-react";
import { InventoryItem, POSCartItem, POSTransaction } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface PointOfSaleViewProps {
  items: InventoryItem[];
  recentTransactions: POSTransaction[];
  onCompleteTransaction?: (txn: POSTransaction) => void;
}

export function PointOfSaleView({
  items,
  recentTransactions,
  onCompleteTransaction,
}: PointOfSaleViewProps) {
  const [cart, setCart] = useState<POSCartItem[]>([
    {
      itemId: items[0]?.id || "ITEM-101",
      name: items[0]?.name || "Dell Latitude 7440",
      price: items[0]?.sellingPrice || 118000,
      quantity: 1,
      gstRate: items[0]?.gstRate || 18,
    },
  ]);

  const [paymentMode, setPaymentMode] = useState<"UPI / QR" | "Cash" | "Card">("UPI / QR");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedReceipt, setCompletedReceipt] = useState<POSTransaction | null>(null);

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: InventoryItem) => {
    const existing = cart.find((c) => c.itemId === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.itemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          itemId: item.id,
          name: item.name,
          price: item.sellingPrice,
          quantity: 1,
          gstRate: item.gstRate,
        },
      ]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((c) => {
          if (c.itemId === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as POSCartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.itemId !== itemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity) / (1 + item.gstRate / 100), 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = grandTotal - subtotal;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newTxn: POSTransaction = {
      id: `POS-${Date.now()}`,
      receiptNumber: `POS/2026/0${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      cashierName: "Current Cashier",
      items: [...cart],
      subtotal: Math.round(subtotal),
      taxAmount: Math.round(taxAmount),
      grandTotal: Math.round(grandTotal),
      paymentMode,
      status: "Completed",
    };

    setCompletedReceipt(newTxn);
    if (onCompleteTransaction) {
      onCompleteTransaction(newTxn);
    }
    setCart([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Point of Sale (POS) Cashier Terminal
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Instant retail billing, barcode search, dynamic UPI QR code payments, and automated inventory sync.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Register Session #04 Open
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Catalog Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search product name or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all shadow-sm flex flex-col justify-between h-32 group"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5 group-hover:text-blue-600">
                    {item.name}
                  </h4>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {formatINR(item.sellingPrice)}
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                    {item.gstRate}% GST
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Payment Checkout */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              Current Order ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Cart is empty. Click items from catalog to add.
              </div>
            ) : (
              cart.map((c) => (
                <div
                  key={c.itemId}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {formatINR(c.price)} x {c.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(c.itemId, -1)}
                      className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-mono font-bold w-6 text-center">{c.quantity}</span>
                    <button
                      onClick={() => updateQuantity(c.itemId, 1)}
                      className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(c.itemId)}
                      className="p-1 text-slate-400 hover:text-red-500 ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Taxable Subtotal:</span>
              <span className="font-mono">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimated GST (CGST + SGST):</span>
              <span className="font-mono">{formatINR(taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm text-slate-900 dark:text-white">
              <span>Total Payable:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {formatINR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "UPI / QR", icon: QrCode },
                { id: "Cash", icon: Banknote },
                { id: "Card", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMode(m.id as any)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{m.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic UPI Preview if UPI selected */}
          {paymentMode === "UPI / QR" && grandTotal > 0 && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Dynamic UPI QR Active
                </p>
                <p className="text-[10px] text-emerald-600 font-mono">
                  Scan via GPay / PhonePe / Paytm
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded border border-emerald-300 bg-white p-1">
                <QrCode className="h-10 w-10 text-slate-900" />
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            Complete Sale & Print Receipt ({formatINR(grandTotal)})
          </button>
        </div>
      </div>

      {/* Completed Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="text-center border-b pb-3 space-y-1">
              <h3 className="font-black text-sm uppercase">ApexTech ERPVibe POS</h3>
              <p className="text-[10px] text-slate-500">Retail Terminal #04</p>
              <p className="font-bold text-xs">{completedReceipt.receiptNumber}</p>
              <p className="text-[10px] text-slate-400">{completedReceipt.timestamp}</p>
            </div>

            <div className="space-y-1.5 border-b pb-3">
              {completedReceipt.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.name} (x{i.quantity})</span>
                  <span>{formatINR(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 border-b pb-3 text-right">
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span>{formatINR(completedReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax:</span>
                <span>{formatINR(completedReceipt.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t">
                <span>PAID ({completedReceipt.paymentMode}):</span>
                <span>{formatINR(completedReceipt.grandTotal)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500">
              Thank you for shopping with ERPVibe!
            </div>

            <div className="flex gap-2 pt-2 font-sans">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-lg bg-blue-600 text-white py-2 text-xs font-bold hover:bg-blue-700"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
