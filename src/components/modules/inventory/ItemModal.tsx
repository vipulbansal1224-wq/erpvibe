"use client";

import React, { useState, useEffect } from "react";
import { X, Package, ShieldCheck } from "lucide-react";
import { InventoryItem } from "@/types/erp";

interface ItemModalProps {
  isOpen: boolean;
  item?: InventoryItem | null;
  onClose: () => void;
  onSaveItem: (item: InventoryItem) => void;
}

export function ItemModal({
  isOpen,
  item,
  onClose,
  onSaveItem,
}: ItemModalProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<InventoryItem["category"]>("Finished Goods");
  const [hsnSacCode, setHsnSacCode] = useState("84713010");
  const [uom, setUom] = useState<InventoryItem["uom"]>("NOS");
  const [gstRate, setGstRate] = useState<InventoryItem["gstRate"]>(18);
  const [purchasePrice, setPurchasePrice] = useState(1000);
  const [sellingPrice, setSellingPrice] = useState(1500);
  const [currentStock, setCurrentStock] = useState(25);
  const [reorderLevel, setReorderLevel] = useState(10);
  const [warehouse, setWarehouse] = useState("Mumbai Central Warehouse");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSku(item.sku);
      setCategory(item.category);
      setHsnSacCode(item.hsnSacCode);
      setUom(item.uom);
      setGstRate(item.gstRate);
      setPurchasePrice(item.purchasePrice);
      setSellingPrice(item.sellingPrice);
      setCurrentStock(item.currentStock);
      setReorderLevel(item.reorderLevel);
      setWarehouse(item.warehouse);
    } else {
      setName("");
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory("Finished Goods");
      setHsnSacCode("84713010");
      setUom("NOS");
      setGstRate(18);
      setPurchasePrice(1000);
      setSellingPrice(1500);
      setCurrentStock(25);
      setReorderLevel(10);
      setWarehouse("Mumbai Central Warehouse");
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const record: InventoryItem = {
      id: item ? item.id : `ITEM-${Date.now()}`,
      sku,
      name,
      category,
      hsnSacCode,
      uom,
      gstRate,
      purchasePrice,
      sellingPrice,
      currentStock,
      reorderLevel,
      warehouse,
      status: currentStock <= reorderLevel ? "Low Stock" : "In Stock",
    };
    onSaveItem(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
              <Package className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {item ? "Edit Stock Item" : "New Inventory Item Master"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Item SKU / Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="Raw Materials">Raw Materials</option>
                <option value="Work in Progress">Work in Progress</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Consumables">Consumables</option>
                <option value="Services">Services (SAC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Item Name / Description *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mild Steel Beam 150mm"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                HSN/SAC Code
              </label>
              <input
                type="text"
                value={hsnSacCode}
                onChange={(e) => setHsnSacCode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                UOM Unit
              </label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="NOS">NOS (Numbers)</option>
                <option value="KGS">KGS (Kilograms)</option>
                <option value="MTR">MTR (Meters)</option>
                <option value="LTR">LTR (Liters)</option>
                <option value="BOX">BOX (Boxes)</option>
                <option value="SET">SET (Sets)</option>
                <option value="HRS">HRS (Hours)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GST Rate (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value) as any)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value={18}>18% Standard</option>
                <option value={12}>12%</option>
                <option value={28}>28% Luxury</option>
                <option value={5}>5%</option>
                <option value={0}>0% Exempt</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reorder Alert
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Warehouse Location
              </label>
              <input
                type="text"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white truncate"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
            >
              {item ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
