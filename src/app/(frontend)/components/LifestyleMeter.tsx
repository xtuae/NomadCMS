"use client";

import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import styled from 'styled-components';

interface City {
  id: string;
  countryName: string;
  internetSpeed: number;
  safetyScore: number;
  crimerate: string;
  nightlife: number;
  wellness: number;
  costPerDay: number;
  monthlyCost: number;
  communityscore: number;
}

interface LifestyleMetric {
  metric: string;
  score: number;
  icon: string;
  color: string;
  basis: string;
}

async function fetchPlaces(): Promise<City[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL?.endsWith('/')
      ? process.env.NEXT_PUBLIC_PAYLOAD_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_PAYLOAD_URL;
    const url = `${baseUrl}/places?limit=9999`; // Increased limit to fetch more cities, assuming backend supports it
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.docs) {
      return data.docs.map((city: City) => ({
        id: city.id,
        countryName: city.countryName,
        internetSpeed: city.internetSpeed,
        safetyScore: city.safetyScore,
        crimerate: city.crimerate,
        nightlife: city.nightlife,
        wellness: city.wellness,
        costPerDay: city.costPerDay,
        monthlyCost: city.monthlyCost,
        communityscore: city.communityscore,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch places:', error);
  }
  return [];
}

const Container = styled.div`
  padding: 2.5rem;
  border-radius: 24px;
  margin: 2rem auto;
  width: 95%;
  max-width: 1200px;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  background: linear-gradient(90deg, #6c5ce7, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #636e72;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CitySelector = styled.select`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #dcdde1;
  background: white;
  color: #2d3436;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 380px;
  margin: 2rem 0;
  position: relative;
`;


const ScoreCard = styled.div`
  padding: 1.5rem;
  width: 95%;
  max-width: 1200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0,0,0,0.03);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(108, 92, 231, 0.15);
  }
`;

const ScoreHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`;

const MetricIcon = styled.span`
  font-size: 1.8rem;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #6c5ce7, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3436;
  margin: 0.5rem 0;
`;

const ScoreBasis = styled.div`
  font-size: 0.85rem;
  color: #636e72;
  text-align: center;
  line-height: 1.4;
`;

const PulseCircle = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(108,92,231,0.1) 0%, rgba(108,92,231,0) 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const LifestyleMeter = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [lifestyleData, setLifestyleData] = useState<LifestyleMetric[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await fetchPlaces();
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0].countryName);
      } catch (err) {
        console.error('Error loading cities:', err);
      }
    };

    loadCities();
  }, []);

  useEffect(() => {
    if (!selectedCity || cities.length === 0) return;

    const raw = cities.find((c) => c.countryName === selectedCity);
    if (!raw) return;

    const formatted: LifestyleMetric[] = [
      {
        metric: 'Internet',
        score: raw.internetSpeed,
        icon: '🚀',
        color: '#FF6B6B',
        basis: `${raw.internetSpeed} Mbps average`,
      },
      {
        metric: 'Safety',
        score: raw.safetyScore,
        icon: '🛡️',
        color: '#4ECDC4',
        basis: `Crime rate: ${raw.crimerate}`,
      },
      {
        metric: 'Nightlife',
        score: raw.nightlife,
        icon: '🍹',
        color: '#FF9F1C',
        basis: `Nightlife score: ${raw.nightlife}/100`,
      },
      {
        metric: 'Wellness',
        score: raw.wellness,
        icon: '🧘',
        color: '#A78BFA',
        basis: `Wellness score: ${raw.wellness}/100`,
      },
      {
        metric: 'Cost',
        score: raw.costPerDay, // Lower daily cost → higher score
        icon: '💰',
        color: '#2ECC71',
        basis: `Estimated monthly: ${raw.monthlyCost}`,
      },
      {
        metric: 'Community',
        score: raw.communityscore,
        icon: '👥',
        color: '#F9C74F',
        basis: `Community score: ${raw.communityscore}/100`,
      },
    ];

    setLifestyleData(formatted);
  }, [selectedCity, cities]);

  return (
    <Container>
      <Header>
        <Title>Nomad Lifestyle Score</Title>
        <Subtitle>
          Our vibrant rating system evaluates what truly matters for digital nomads —
          combining hard data with community experiences.
        </Subtitle>

        {cities.length > 0 && (
          <CitySelector value={selectedCity} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCity(e.target.value)}>
            {cities.map((city: City) => (
              <option key={city.countryName} value={city.countryName}>
                {city.countryName}
              </option>
            ))}
          </CitySelector>
        )}
      </Header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ChartContainer style={{ flex: '1 1 400px', minWidth: '350px' }}>
          <PulseCircle />
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={lifestyleData}>
              <PolarGrid stroke="#e0e3e6" gridType="circle" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#2d3436', fontSize: 12, fontWeight: 600 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6c5ce7"
                fill="#6c5ce7"
                fillOpacity={0.2}
                strokeWidth={2}
                animationDuration={1800}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '12px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '14px'
                }}
                itemStyle={{
                  color: '#6c5ce7',
                  fontWeight: 600
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div
          style={{
            flex: '1 1 550px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {lifestyleData.map((item: LifestyleMetric) => (
            <ScoreCard key={item.metric} style={{ borderTop: `4px solid ${item.color}` }}>
              <ScoreHeader>
                <MetricIcon>{item.icon}</MetricIcon>
                <ScoreLabel>{item.metric}</ScoreLabel>
              </ScoreHeader>
              <ScoreValue>{item.score}</ScoreValue>
              <ScoreBasis>{item.basis}</ScoreBasis>
            </ScoreCard>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default LifestyleMeter;
