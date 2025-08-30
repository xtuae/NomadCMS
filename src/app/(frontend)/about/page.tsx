'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';

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
  whatWeDoImage?: {
    url: string;
    alt?: string;
  };
  icon: string;
  title: string;
  description: string;
}

interface Hero {
  headline: string;
  subheadline?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  ctaText?: string;
}

interface Mission {
  title: string;
  intro: string;
  missionImage?: {
    url: string;
    alt?: string;
  };
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

  const missionImageUrl = mission?.missionImage?.url?.startsWith('/api/media')
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${mission.missionImage.url}`
    : mission?.missionImage?.url;

  const whatWeDoImageUrl = whatWeDo?.[0]?.whatWeDoImage?.url?.startsWith('/api/media')
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${whatWeDo[0].whatWeDoImage.url}`
    : whatWeDo?.[0]?.whatWeDoImage?.url;

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
      <PageHeader title={hero.headline} backgroundImage={imageUrl || null} subheadline={hero.subheadline} />
      {/* Our Mission */}
      <section className="bg-white text-gray-800 py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-stretch">
            <div className="md:col-span-2 relative">
              <Image
                src={missionImageUrl || imageUrl || "/fallback.webp"}
                alt={mission?.missionImage?.alt || "Our Mission"}
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="md:col-span-3">
              <span className="text-[#de6076] bg-[#de6076]/20 px-3 py-1 rounded-full text-sm font-semibold">
                Why Choosing Us?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4">{mission.title}</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-7 mt-4">
                {mission.intro}
              </p>
              <div className="grid grid-cols-1 gap-6 mt-8">
                {mission.circles.map((circle, index) => (
                  <div key={circle.id} className={`p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-gray-800 text-white'}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${index % 2 === 0 ? 'bg-[#de6076]/20' : 'bg-[#de6076]'}`}>
                        <svg className={`w-6 h-6 ${index % 2 === 0 ? 'text-[#de6076]' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{circle.title}</h4>
                        <p className={`${index % 2 === 0 ? 'text-gray-600' : 'text-gray-300'}`}>{circle.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3 text-left">
              <span className="text-[#de6076] bg-[#de6076]/20 px-3 py-1 rounded-full text-sm font-semibold">
                Our Focused
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4">{Section_title}</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-7 mt-4">
                {title_describtion}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {whatWeDo.map((item, index) => (
                  <div key={item.id} className={`p-6 rounded-lg shadow-md ${index === 0 ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${index === 0 ? 'bg-[#de6076]' : 'bg-[#de6076]/20'}`}>
                        <svg className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-[#de6076]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className={`${index === 0 ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 relative h-full">
              <Image
                src={whatWeDoImageUrl || imageUrl || "/fallback.webp"}
                alt="What We Do"
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
