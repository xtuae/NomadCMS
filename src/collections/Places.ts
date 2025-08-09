// src/collections/Places.ts
import { CollectionConfig } from 'payload'

export const Places: CollectionConfig = {
  slug: 'places',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'countryName',
  },
  fields: [
    { name: 'countryName', label: 'Country Name', type: 'text', required: true },
    { name: 'image', label: 'Image URL', type: 'text', required: true },
    { name: 'continent', type: 'text', required: true },
    { name: 'costPerDay', type: 'number', required: true },
    { name: 'internetSpeed', type: 'number', required: true },
    { name: 'safetyScore', type: 'number', required: true },
    { name: 'monthlyCost', type: 'text', required: true },
    { name: 'visaDuration', type: 'text', required: true },
    { name: 'visaFees', type: 'text', label: 'Visa Application Fees', required: true },
    { name: 'specialRequirements', type: 'textarea' },
    { name: 'overallScore', type: 'number', required: true },
    { name: 'climate', type: 'text' },
    { name: 'nightlife', type: 'number', required: true },
    { name: 'wellness', type: 'number', required: true },
    { name: 'communityscore', type: 'number', required: true },
    { name: 'crimerate', type: 'text', required: true },

    // ✅ New fields
    { name: 'city_one', label: 'City One', type: 'text' },
    { name: 'city_two', label: 'City Two', type: 'text' },
  ],
}
