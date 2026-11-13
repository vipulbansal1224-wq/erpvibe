"use client";

import React, { useState } from "react";
import { X, Package, ShieldCheck } from "lucide-react";
import { InventoryItem } from "@/types/erp";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: InventoryItem) => void;
}

export function NewItemModal({
  isOpen,
  onClose,
  onSaveItem,
}: NewItemModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<InventoryItem["category"]>("Finished Goods");
  const [hsnSacCode, setHsnSacCode] = useState("84713010");
  const [uom, setUom] = useState<InventoryItem["uom"]>("NOS");
  const [gstRate, setGstRate] = useState<InventoryItem["gstRate"]>(18);
  const [purchasePrice, setPurchasePrice] = useState(1000);
  const [sellingPrice, setSellingPrice] = useState(1500);
  const [currentStock, setCurrentStock] = useState(25);
  const [reorderLevel, setReorderLevel] = useState(10);
  const [warehouse, setWarehouse] = useState("Mumbai Central Warehouse");
  const [barcode, setBarcode] = useState(`890${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [brand, setBrand] = useState("Enterprise Industrial");
  const [binLocation, setBinLocation] = useState("Bin A-04, Rack 2");
  const [minOrderQty, setMinOrderQty] = useState(5);
  const [batchTracking, setBatchTracking] = useState(true);
  const [expiryTracking, setExpiryTracking] = useState(false);
  const [altUom, setAltUom] = useState("BOX");
  const [conversionFactor, setConversionFactor] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `ITEM-${Date.now()}`,
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
      barcode,
      brand,
      binLocation,
      minOrderQty,
      batchTracking,
      expiryTracking,
      altUom,
      conversionFactor,
    };
    onSaveItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Item / Service to Master
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Item / Service Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Enterprise Cloud Firewall Appliance"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                SKU / Item Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              >
                <option value="Finished Goods">Finished Goods</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Services">Services</option>
                <option value="Consumables">Consumables</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                HSN / SAC Code *
              </label>
              <input
                type="text"
                required
                value={hsnSacCode}
                onChange={(e) => setHsnSacCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                GST Slab Rate (%) *
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value) as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              >
                <option value={0}>0% (NIL / Exempt)</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18% (Standard)</option>
                <option value={28}>28% (Luxury/Special)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Unit of Measure (UOM)
              </label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              >
                <option value="NOS">NOS (Numbers / Pieces)</option>
                <option value="KGS">KGS (Kilograms)</option>
                <option value="MTR">MTR (Meters)</option>
                <option value="BOX">BOX (Boxes / Cartons)</option>
                <option value="HRS">HRS (Hourly Service)</option>
                <option value="SET">SET (Sets)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Default Warehouse
              </label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              >
                <option value="Mumbai Central Warehouse">Mumbai Central Warehouse</option>
                <option value="Delhi Hub Warehouse">Delhi Hub Warehouse</option>
                <option value="Bhiwandi Storage Depot">Bhiwandi Storage Depot</option>
                <option value="Cloud Cluster - AWS Mumbai">Cloud Cluster - AWS Mumbai</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Standard Purchase Rate (INR)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Selling Price (INR)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Initial Stock Qty
              </label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Reorder Level (Alert Threshold)
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Barcode / EAN-13
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="8901234567890"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Min Order Qty (MOQ)
              </label>
              <input
                type="number"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Godown / Bin Location
              </label>
              <input
                type="text"
                value={binLocation}
                onChange={(e) => setBinLocation(e.target.value)}
                placeholder="Rack A-04, Bin 2"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Alt Unit & Factor (1 {altUom} = {conversionFactor} {uom})
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={altUom}
                  onChange={(e) => setAltUom(e.target.value.toUpperCase())}
                  placeholder="BOX"
                  className="w-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono uppercase"
                />
                <input
                  type="number"
                  value={conversionFactor}
                  onChange={(e) => setConversionFactor(Number(e.target.value))}
                  placeholder="10"
                  className="w-1/2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={batchTracking}
                  onChange={(e) => setBatchTracking(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Batch / Lot Tracking</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expiryTracking}
                  onChange={(e) => setExpiryTracking(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Expiry Tracking</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Save Item Master
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
