'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Icons
import { Wifi, DollarSign, ShieldCheck, Users, HeartPulse, Music2 } from 'lucide-react';

// === Types ===
interface Circle {
  id: string;
  title: string;
  description: string;
  color: 'Purple' | 'Pista' | 'Mango';
}

interface WhatWeDoItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface Hero {
  headline: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  ctaText?: string;
}

interface Mission {
  title: string;
  intro: string;
  circles: Circle[];
}

interface PageData {
  id: number;
  hero: Hero;
  mission: Mission;
  mission_last: string;
  Section_title: string;
  title_describtion: string;
  whatWeDo: WhatWeDoItem[];
}

// Icon mapping
const iconComponentMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Internet/ Wifi': Wifi,
  'Dollar ': DollarSign,
  'Safety': ShieldCheck,
  'Community ': Users,
  'Wellness': HeartPulse,
  'Music ': Music2,
};

const iconColorMap: Record<string, string> = {
  'Internet/ Wifi': 'text-blue-600',
  'Dollar ': 'text-green-600',
  'Safety': 'text-red-600',
  'Community ': 'text-purple-600',
  'Wellness': 'text-pink-600',
  'Music ': 'text-yellow-600',
};

const circleColors = {
  Purple: '#a855f7',
  Pista: '#4ade80',
  Mango: '#facc15',
};

export default function AboutPage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/pages/2`;
        console.log('Fetching:', url);

        const res = await fetch(url);
        const data: PageData = await res.json();

        console.log('Fetched Data:', data); // Inspect the raw data object
        console.log('Hero Background Image URL from data:', data?.hero?.backgroundImage?.url); // Inspect the image URL

        if (data) {
          setPageData(data);
          console.log('Page Data after set:', data);
        }
      } catch (error) {
        console.error('Failed to fetch /about page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!pageData) {
    return <div className="flex items-center justify-center min-h-screen">Failed to load data.</div>;
  }

  const {
    hero,
    mission,
    mission_last,
    Section_title,
    title_describtion,
    whatWeDo,
  } = pageData;

  // ✅ Fix: build proper image URL
  const imageUrl = hero?.backgroundImage?.url?.startsWith('/api/media')
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${hero.backgroundImage.url}`
    : hero?.backgroundImage?.url;

  const handleExploreClick = () => {
    router.push('/');
    setTimeout(() => {
      const citiesSection = document.getElementById('cities');
      if (citiesSection) {
        citiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[60vh] px-4 py-10 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl || "/fallback.webp"}   // ✅ proper URL with fallback
              alt={hero?.backgroundImage?.alt || "Hero background"}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-xl z-10 mt-16 sm:mt-28 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {hero.headline}
          </h1>

          {hero.ctaText && (
            <button
              onClick={handleExploreClick}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              {hero.ctaText}
            </button>
          )}
        </div>
      </div>

      {/* Our Mission */}
      <section className="bg-white text-gray-800 py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">{mission.title}</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-7 mt-4 font-semibold">
            {mission.intro}
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
            {mission.circles.map((circle) => {
              const bgColor = circleColors[circle.color] || '#a855f7';
              return (
                <div
                  key={circle.id}
                  className="w-60 h-60 rounded-full shadow-md flex flex-col items-center justify-center p-6 text-sm font-medium text-white text-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <h4 className="text-base font-semibold mb-2">{circle.title}</h4>
                  <p>{circle.description}</p>
                </div>
              );
            })}
          </div>

          <p className="text-base sm:text-lg text-gray-700 leading-7 mt-6">{mission_last}</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{Section_title}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-10 text-base sm:text-lg font-semibold">
          {title_describtion}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {whatWeDo.map((item) => {
            const IconComponent = iconComponentMap[item.icon] || Wifi;
            const iconColor = iconColorMap[item.icon] || 'text-blue-600';

            return (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                  <h4 className="text-xl font-semibold">{item.title}</h4>
                </div>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
