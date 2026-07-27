"use client";

import { useMemo } from "react";
import { Slider } from "antd";

interface FilterSidebarProps {
  priceRange: { from: number; to: number };
  setPriceRange: (range: { from: number; to: number }) => void;
  selectedBindings: string[];
  setSelectedBindings: (val: string[]) => void;
  selectedAvailabilities: string[];
  setSelectedAvailabilities: (val: string[]) => void;
  selectedTags: string[];
  setSelectedTags: (val: string[]) => void;
  dateRange: { from: number; to: number };
  setDateRange: (range: { from: number; to: number }) => void;
  products?: any[];
  defaultBindings?: string[];      // Sayfaya özel varsayılan binding/format seçenekleri
  defaultAvailabilities?: string[]; // Sayfaya özel varsayılan availability seçenekleri
}

export default function FilterSidebar({
  priceRange, setPriceRange,
  selectedBindings, setSelectedBindings,
  selectedAvailabilities, setSelectedAvailabilities,
  selectedTags, setSelectedTags,
  dateRange, setDateRange,
  products = [],
  defaultBindings = [],
  defaultAvailabilities = [
    "Within 24 hours",
    "Within three days",
    "Within a week",
    "Within two weeks",
    "Within a month",
    "More than a month",
    "Pre-order",
    "Availability unknown",
  ],
}: FilterSidebarProps) {

  // ── Binding / Format ──────────────────────────────────────────────────────
  const bindings = useMemo(() => {
    const counts: Record<string, number> = {};

    // Önce ürünlerden dinamik olarak say
    products.forEach((p) => {
      const b = p.details?.binding || p.details?.format || p.details?.material;
      if (!b) return;
      if (Array.isArray(b)) {
        b.forEach((item: string) => { counts[item] = (counts[item] || 0) + 1; });
      } else {
        counts[b] = (counts[b] || 0) + 1;
      }
    });

    // Varsayılan seçenekleri de ekle (sayısı 0 olsa bile)
    defaultBindings.forEach((label) => {
      if (!(label in counts)) counts[label] = 0;
    });

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [products, defaultBindings]);

  // ── Availability ──────────────────────────────────────────────────────────
  const availabilities = useMemo(() => {
    const counts: Record<string, number> = {};

    products.forEach((p) => {
      const a = p.details?.availability;
      if (a) counts[a] = (counts[a] || 0) + 1;
    });

    // Varsayılan listeden gelip 0 olanları da ekle
    defaultAvailabilities.forEach((label) => {
      if (!(label in counts)) counts[label] = 0;
    });

    // Ürünlerden gelen ama listede olmayan ekstra değerler
    Object.keys(counts).forEach((label) => {
      if (!defaultAvailabilities.includes(label)) {
        // zaten counts'ta var, geçiyoruz
      }
    });

    return defaultAvailabilities
      .map((label) => ({ label, count: counts[label] || 0 }))
      .filter((item) => item.count > 0 || defaultAvailabilities.includes(item.label));
  }, [products, defaultAvailabilities]);

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagsList = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const t = p.details?.tags;
      if (t && Array.isArray(t)) {
        t.forEach((tag: string) => { counts[tag] = (counts[tag] || 0) + 1; });
      }
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const handleCheckboxChange = (
    item: string,
    selectedItems: string[],
    setSelectedItems: (val: string[]) => void
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const CheckboxRow = ({
    item,
    checked,
    onChange,
  }: {
    item: { label: string; count: number };
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-gray-300 accent-[#00C49F] cursor-pointer"
        />
        <span className="text-[13px] text-[#1A2E35]">{item.label}</span>
      </div>
      {item.count > 0 && (
        <span className="text-[11px] text-gray-300 italic group-hover:text-gray-400 transition-colors">
          {item.count}
        </span>
      )}
    </label>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <>
      <h3 className="font-bold text-[#1A2E35] mb-1 text-[15px]">{title}</h3>
      <div className="border-b border-gray-200 mb-4" />
    </>
  );

  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-8">

      {/* BINDING / FORMAT */}
      {bindings.length > 0 && (
        <div>
          <SectionTitle title="Binding" />
          <div className="space-y-3">
            {bindings.map((item) => (
              <CheckboxRow
                key={item.label}
                item={item}
                checked={selectedBindings.includes(item.label)}
                onChange={() => handleCheckboxChange(item.label, selectedBindings, setSelectedBindings)}
              />
            ))}
          </div>
        </div>
      )}

      {/* AVAILABILITY */}
      <div>
        <SectionTitle title="Availability" />
        <div className="space-y-3">
          {availabilities.map((item) => (
            <CheckboxRow
              key={item.label}
              item={item}
              checked={selectedAvailabilities.includes(item.label)}
              onChange={() => handleCheckboxChange(item.label, selectedAvailabilities, setSelectedAvailabilities)}
            />
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div>
        <SectionTitle title="Price" />
        <div className="mb-4 px-1">
          <Slider
            range
            min={0}
            max={1000}
            value={[priceRange.from, priceRange.to]}
            onChange={(val) => setPriceRange({ from: val[0], to: val[1] })}
            tooltip={{ formatter: (value) => `€${value}` }}
            styles={{
              track: { backgroundColor: "#00C49F" },
              handle: { borderColor: "#00C49F" },
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-500">From</span>
          <input
            type="number"
            value={priceRange.from}
            onChange={(e) => setPriceRange({ ...priceRange, from: Number(e.target.value) })}
            className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center focus:outline-none focus:border-[#00C49F]"
          />
          <span className="text-[12px] text-gray-500">To</span>
          <input
            type="number"
            value={priceRange.to}
            onChange={(e) => setPriceRange({ ...priceRange, to: Number(e.target.value) })}
            className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center focus:outline-none focus:border-[#00C49F]"
          />
        </div>
      </div>

      {/* TAGS */}
      {tagsList.length > 0 && (
        <div>
          <SectionTitle title="Tags" />
          <div className="space-y-3">
            {tagsList.map((item) => (
              <CheckboxRow
                key={item.label}
                item={item}
                checked={selectedTags.includes(item.label)}
                onChange={() => handleCheckboxChange(item.label, selectedTags, setSelectedTags)}
              />
            ))}
          </div>
        </div>
      )}

      {/* DATE OF ISSUE */}
      <div>
        <SectionTitle title="Date of issue" />
        <div className="mb-4 px-1">
          <Slider
            range
            min={1900}
            max={new Date().getFullYear() + 5}
            value={[dateRange.from, dateRange.to]}
            onChange={(val) => setDateRange({ from: val[0], to: val[1] })}
            styles={{
              track: { backgroundColor: "#00C49F" },
              handle: { borderColor: "#00C49F" },
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-500">From</span>
          <input
            type="number"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: Number(e.target.value) })}
            className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center focus:outline-none focus:border-[#00C49F]"
          />
          <span className="text-[12px] text-gray-500">To</span>
          <input
            type="number"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: Number(e.target.value) })}
            className="w-16 h-8 px-2 border border-gray-300 rounded text-[13px] text-center focus:outline-none focus:border-[#00C49F]"
          />
        </div>
      </div>

    </div>
  );
}
