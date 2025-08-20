// src/collections/Forms.ts
import { CollectionConfig } from 'payload'

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  access: {
    read: () => true, // allow frontend to fetch
    create: () => true, // allow users to submit
  },
  admin: {
    useAsTitle: 'formType',
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Contact Us',
          value: 'contact',
        },
        {
          label: 'Inquiry',
          value: 'inquiry',
        },
      ],
    },

    // Common fields for both forms
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
    },

    // Only show country when Inquiry form is selected
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'places', // assuming you have a Places collection
      admin: {
        condition: (data, siblingData) => siblingData.formType === 'inquiry',
      },
    },
  ],
}
