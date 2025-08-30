"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { getPayloadUrl } from "@/utils/getPayloadUrl";
import { useRouter } from "next/navigation";

interface Media {
  url: string;
  width?: number;
  height?: number;
}

interface HeaderData {
  title: string;
  logo?: Media;
  links?: { label: string; url: string }[];
}

interface City {
  id: string;
  countryName?: string;
  title?: string;
}

export default function Header() {
  const [header, setHeader] = useState<HeaderData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState<City[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<City[]>([]);

  const PAYLOAD_URL = getPayloadUrl();
  const router = useRouter();

  // fetch header
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(`${PAYLOAD_URL}/header/1`);
        const data = await response.json();
        if (data.logo?.url && data.logo.url.startsWith("/api/media")) {
          data.logo.url = `${PAYLOAD_URL}${data.logo.url.replace(/^\/api/, "")}`;
        }
        setHeader(data);
      } catch (err) {
        console.error("Error fetching header:", err);
      }
    };
    fetchHeaderData();
  }, [PAYLOAD_URL]);

  // fetch countries
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${PAYLOAD_URL}/places?limit=100`, {
          cache: "no-store",
        });
        const data = await res.json();
        setPlaces(data.docs || []);
      } catch (err) {
        console.error("Failed to fetch places", err);
      }
    };
    fetchPlaces();
  }, [PAYLOAD_URL]);

  // filter on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlaces([]);
      return;
    }
    const results = places.filter((place) => {
      const name = place.countryName || place.title || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredPlaces(results);
  }, [searchTerm, places]);

  // handle select
  const handleSelect = (place: City) => {
    setSearchTerm(place.countryName || place.title || "");
    setFilteredPlaces([]);
    setSearchOpen(false);
    router.push(`/cities/${place.countryName}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/30 backdrop-blur-md border-b border-gray-700/20 flex items-center justify-between px-6 py-3 text-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        {header?.logo?.url && (
          <Image
            src={header.logo.url}
            alt={header.title || "Logo"}
            width={120}
            height={80}
            className="rounded-md"
          />
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-center items-center">
        <ul className="flex space-x-8 text-sm font-medium uppercase">
          {header?.links?.map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                className="hover:text-yellow-400 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden md:flex items-center space-x-4">
        {/* 🔍 Search Icon + Bar (Right side only) */}
        <div className="relative flex items-center">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:text-yellow-400 transition"
            >
              <Search size={22} />
            </button>
          ) : (
            <div className="relative flex flex-col w-64">
              <input
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {filteredPlaces.length > 0 && (
                <ul className="absolute top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg z-50">
                  {filteredPlaces.map((place) => (
                    <li
                      key={place.id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleSelect(place)}
                    >
                      {place.countryName || place.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Get Started Button */}
        <a
          href="/get-started"
          className="bg-[#de6076] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#de6076]/90 transition-colors"
        >
          Get Started
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-700/20 flex flex-col items-center space-y-4 py-4 md:hidden">
          {header?.links?.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="text-lg font-medium hover:text-blue-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {/* Mobile search stays simple (always visible) */}
          <div className="w-11/12">
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {filteredPlaces.length > 0 && (
              <ul className="bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto mt-1 shadow-lg z-50">
                {filteredPlaces.map((place) => (
                  <li
                    key={place.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      handleSelect(place);
                      setMenuOpen(false);
                    }}
                  >
                      {place.countryName || place.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
