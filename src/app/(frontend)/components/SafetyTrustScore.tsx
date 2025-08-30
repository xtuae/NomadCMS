// components/SafetyTrustScore.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { ShieldCheck, Globe2, X } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

interface Place {
  id: string;
  countryName: string;
  safetyScore: number;
  crimerate: string;
  safetyNews: string[];
}

interface SafetyTrustScoreProps {
  onClose: () => void;
}

export default function SafetyTrustScore({ onClose }: SafetyTrustScoreProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch places data from CMS
  useEffect(() => {
    const fetchPlacesData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL?.endsWith("/")
          ? process.env.NEXT_PUBLIC_PAYLOAD_URL.slice(0, -1)
          : process.env.NEXT_PUBLIC_PAYLOAD_URL;
        const url = `${baseUrl}/places?limit=100`;

        const res = await fetch(url);
        const data = await res.json();

        if (data && data.docs) {
          setPlaces(data.docs);
          if (data.docs.length > 0) {
            setSelectedPlaceName(data.docs[0].countryName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch places data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacesData();
  }, []);

  // Utility to get details for a place
  const getPlaceData = (name: string | null) => {
    if (!name) return null;
    const found = places.find((place) => place.countryName === name);
    if (!found) return null;

    return {
      score: found.safetyScore ?? 0,
      reason: `Crime Rate: ${found.crimerate || "unknown"}`,
      icon:
        found.safetyScore >= 85 ? (
          <ShieldCheck className="h-6 w-6 text-green-600" />
        ) : (
          <Globe2 className="h-6 w-6 text-yellow-500" />
        ),
      news: found.safetyNews || [
        `${found.countryName} shows steady improvements in safety metrics.`,
        "Government initiates new public security programs.",
        "Real-time reporting apps improve traveler confidence.",
      ],
    };
  };

  const getColor = (score: number) => {
    if (score > 80) return "bg-blue-500";
    if (score >= 60) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <p className="text-center py-10 text-gray-600 text-lg font-medium">Loading safety scores...</p>
        </div>
      </div>
    );
  }

  const placeNames = places.map((place) => place.countryName);
  const currentPlaceData = getPlaceData(selectedPlaceName);

  return createPortal(
    <motion.div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl relative w-full max-w-5xl mx-auto my-8"
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

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 flex justify-center items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} /> Safety & Trust Score
          </h2>
          <p className="hidden sm:block text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Insights into the safety and trustworthiness of popular destinations.
            Scores are based on crime rates, healthcare, stability, and feedback.
          </p>
        </div>

        {/* City Dropdown */}
        <div className="flex justify-center mb-6 px-2">
          <Listbox value={selectedPlaceName} onChange={setSelectedPlaceName}>
            <div className="relative w-full max-w-xs">
              <Listbox.Button className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left text-gray-800 shadow-sm">
                {selectedPlaceName}
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg z-10 border border-gray-200">
                {placeNames.map((placeName) => (
                  <Listbox.Option
                    key={placeName}
                    value={placeName}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 text-sm ${
                        active ? "bg-blue-100" : "text-gray-800"
                      }`
                    }
                  >
                    {placeName}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* Main Section */}
        {currentPlaceData && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Left */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 text-center w-full md:w-1/3">
              <div className="flex items-center justify-center gap-2 ">
                <div>{currentPlaceData.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedPlaceName}
                </h3>
              </div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto my-3">
                <div
                  className={`absolute inset-0 rounded-full ${getColor(
                    currentPlaceData.score
                  )} opacity-20`}
                />
                <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-600">
                  {currentPlaceData.score}
                </div>
              </div>
              <p className="hidden sm:block text-sm text-gray-600">
                {currentPlaceData.reason}
              </p>
            </div>

            {/* Right */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 w-full md:w-2/3 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-gray-800 ">
                Recent Safety News & Updates
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-4">
                {currentPlaceData.news.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2 text-center">
          Scores are updated regularly. Always research local conditions before
          traveling.
        </p>
      </motion.div>
    </motion.div>,
    document.body
  );
}