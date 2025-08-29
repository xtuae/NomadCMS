"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { getPayloadUrl } from "@/utils/getPayloadUrl";

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

export default function Header() {
  const [header, setHeader] = useState<HeaderData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const PAYLOAD_URL = getPayloadUrl();

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(`${PAYLOAD_URL}/header/1`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const prependUrl = (url: string) => {
          if (url.startsWith("/api/media")) {
            return `${PAYLOAD_URL}${url.replace(/^\/api/, "")}`;
          }
          return url;
        };

        if (data.logo?.url) {
          data.logo.url = prependUrl(data.logo.url);
        }
        setHeader(data);
      } catch (err) {
        console.error("Error fetching header:", err);
      }
    };

    fetchHeaderData();
  }, [PAYLOAD_URL]);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50
      bg-gray-900/30 backdrop-blur-md border-b border-gray-700/20
      flex items-center justify-between px-6 py-3 text-white shadow-lg"
    >
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
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex space-x-6 text-sm font-medium">
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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full 
          bg-gray-900/80 backdrop-blur-md border-t border-gray-700/20
          flex flex-col items-center space-y-4 py-4 md:hidden"
        >
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
        </div>
      )}
    </header>
  );
}
