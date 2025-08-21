import { CollectionConfig } from 'payload'
import { createClient } from '@supabase/supabase-js'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // ✅ Allowed in v3
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
      },
      {
        name: 'card',
        width: 600,
      },
      {
        name: 'tablet',
        width: 1024,
      },
    ],
    adminThumbnail: 'thumbnail',
    // ✅ mimeTypes filter (optional)
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
    },
  ],
  // Optional: hooks will go here later

  // Inside Media collection
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return doc

        const file = doc.file
        if (!file?.buffer || !file.filename) return doc

        const supabase = createClient(
          `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/storage/v1`,
          process.env.SUPABASE_ANON_KEY!,
        )

        const { error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET_NAME!)
          .upload(file.filename, file.buffer, {
            contentType: file.mimeType,
            upsert: true,
          })

        if (error) {
          console.error('Supabase upload failed:', error.message)
        } else {
          console.log('Uploaded to Supabase:', file.filename)
        }

        return doc
      },
    ],
  },
}
