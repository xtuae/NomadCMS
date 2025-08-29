'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCcVisa } from '@fortawesome/free-brands-svg-icons'

import './citypreview.css'

interface Media {
  id: string
  url: string
  filename: string
}
interface City {
  id: string
  countryName: string
  imageMedia?: Media // updated to match Payload upload object
  monthlyCost?: number
  climate?: number
  visaDuration?: string
  continent?: string
  costPerDay?: number
  internetSpeed?: number
  safetyScore?: number
  overallScore?: number
}

export default function CityPreview() {
  const [places, setPlaces] = useState<City[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [visaFilter, setVisaFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  const router = useRouter()
  const CMS_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace('/api', '')

  // Fetch places from Payload
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/places?limit=100`, {
          cache: 'no-store',
        })
        const data = await res.json()
        setPlaces(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch cities', err)
      }
    }
    loadData()
  }, [])

  const getRatingLevel = (value: number) => {
    if (value >= 80) return { level: 'Excellent', color: '#22c55e' }
    if (value >= 70) return { level: 'Good', color: '#facc15' }
    if (value >= 60) return { level: 'Fair', color: '#f97316' }
    if (value >= 50) return { level: 'Poor', color: '#ef4444' }
    return { level: 'Poor', color: '#ef4444' }
  }

  const filteredPlaces = places
    .filter((place) => {
      const matchesSearch =
        place.countryName?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const matchesVisa = visaFilter ? place.visaDuration?.includes(visaFilter) : true
      const matchesRegion = regionFilter
        ? place.continent?.toLowerCase() === regionFilter.toLowerCase()
        : true
      return matchesSearch && matchesVisa && matchesRegion
    })
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return (a.monthlyCost || 0) - (b.monthlyCost || 0)
      if (sortOrder === 'highToLow') return (b.monthlyCost || 0) - (a.monthlyCost || 0)
      return 0
    })

  return (
    <div className="city-preview-wrapper">
      {/* Filters */}
      <section className="filter-section">
        <div className="filter-toolbar">
          <input
            type="text"
            placeholder="Search by Country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Regions</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>Central America</option>
            <option>South America</option>
            <option>Middle East</option>
          </select>
          <select
            value={visaFilter}
            onChange={(e) => setVisaFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Visa Durations</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>1 Year</option>
            <option>1 Year 6 Months</option>
          </select>

          <select
            className="filter-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort by Cost</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
          <button
            className="filter-button reset"
            onClick={() => {
              setSearchTerm('')
              setVisaFilter('')
              setRegionFilter('')
              setSortOrder('')
            }}
          >
            Reset
          </button>
        </div>
      </section>

      {/* City Cards */}
      <div className="city-grid">
        {filteredPlaces.map((city) => {
          return (
            <div key={city.countryName} className="city-card">
              <div className="city-image-container">
                {city.imageMedia && (
                  <Image
                    src={`${CMS_URL}${city.imageMedia.url}`} // now allowed
                    alt={city.countryName}
                    width={400}
                    height={300}
                    className="city-image"
                    placeholder="blur"
                    blurDataURL={`${CMS_URL}${city.imageMedia.url}`}
                  />
                )}

                <div className="overlay-top">
                  <h3>{city.countryName}</h3>
                </div>
              </div>

              <div className="city-info">
                <div className="city-meta">
                  <span className="price">${city.monthlyCost}/monthly</span>
                  <span className="temp">{city.climate}°C</span>
                  <span className="aqi">
                    {city.visaDuration} <FontAwesomeIcon icon={faCcVisa} />
                  </span>
                </div>

                <div className="rating-bars">
                  {['costPerDay', 'internetSpeed', 'safetyScore', 'overallScore'].map((key) => {
                    const value = Number(city[key as keyof City] || 0)
                    const { level, color } = getRatingLevel(value)
                    return (
                      <div key={key} className="rating">
                        <span>{key}</span>
                        <div className="bar">
                          <div className="fill" style={{ width: `${value}%`, background: color }} />
                        </div>
                        <div>{level}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="card-buttons">
                  <button
                    className="details-btn"
                    onClick={() => router.push(`/cities/${city.countryName}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
