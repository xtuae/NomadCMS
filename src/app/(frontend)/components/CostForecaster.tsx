"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface City {
  id: string;
  countryName: string;
  costPerDay: number;
  hidden: number;
}

interface CostForecasterProps {
  onClose: () => void;
}

function CostForecaster({ onClose }: CostForecasterProps) {
  const [days, setDays] = useState(5);
  const [showFees, setShowFees] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [place, setPlace] = useState("");
  const [dailyCost, setDailyCost] = useState(0);
  const [hiddenFees, setHiddenFees] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // This effect ensures the component only renders on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tips = [
    "💡 Tip: Booking for 7+ days gives 10% off",
    "🗓️ Cheapest month: October",
    "🛎️ Try weekdays for cheaper stays",
  ];

  useEffect(() => {
    const loadCities = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL;
        const url = `${baseUrl}/places?limit=100`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCities(data.docs);
        if (data.docs.length > 0) setPlace(data.docs[0].countryName);
      } catch (error) {
        console.error("Failed to fetch cost data", error);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    const selectedCity = cities.find((city) => city.countryName === place);
    if (selectedCity) {
      setDailyCost(selectedCity.costPerDay ?? 0);
      setHiddenFees(showFees ? selectedCity.hidden ?? 0 : 0);
    }
  }, [place, showFees, cities]);

  const baseCost = dailyCost * days;
  const totalCost = baseCost + hiddenFees;

  if (!isMounted) {
    return null;
  }
  
  return createPortal(
    <motion.div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 shadow-2xl relative w-full max-w-3xl mx-auto my-8"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        {/* Cost Forecaster UI */}
        <div className="text-gray-800 rounded-3xl p-6 w-full font-sans">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-4">
            Cost Forecaster
          </h2>

          {/* Place Dropdown */}
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-medium text-slate-800">Place:</label>
            <select
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="ml-4 p-1 rounded-md border border-slate-300 bg-white text-sm"
            >
              {cities.map((city) => (
                <option key={city.id} value={city.countryName}>
                  {city.countryName}
                </option>
              ))}
            </select>
          </div>

          {/* Days Slider */}
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-medium text-slate-800">
              Days: {days}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="ml-4 w-2/3 accent-blue-500"
            />
          </div>

          {/* Hidden Fees Toggle */}
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-medium text-slate-800">
              Show hidden fees:
            </label>
            <input
              type="checkbox"
              checked={showFees}
              onChange={(e) => setShowFees(e.target.checked)}
              className="ml-4 w-5 h-5 bg-white"
            />
          </div>

          {/* Cost Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm text-sm mb-4">
            <p className="flex justify-between mb-1">
              <span>Base Cost:</span> <span>${baseCost}</span>
            </p>
            {showFees && (
              <p className="flex justify-between mb-1">
                <span>Hidden Fee:</span> <span>${hiddenFees}</span>
              </p>
            )}
            <p className="flex justify-between font-bold text-base text-blue-600">
              <span>Total Cost:</span> <span>${totalCost}</span>
            </p>
          </div>

          {/* Tips */}
          <div className="mt-4 bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-sm">
            <h3 className="text-base font-bold text-emerald-800 mb-1">
              Cost Saving Tips
            </h3>
            <ul className="list-disc list-inside text-emerald-800 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default CostForecaster;
