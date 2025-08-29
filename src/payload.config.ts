import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
const { formBuilder } = require('@payloadcms/plugin-form-builder')
const { nestedDocs } = require('@payloadcms/plugin-nested-docs')
const { redirects } = require('@payloadcms/plugin-redirects')
const { search } = require('@payloadcms/plugin-search')
const { sentry } = require('@payloadcms/plugin-sentry')
const { seo } = require('@payloadcms/plugin-seo')
const lexical = require('payload-plugin-lexical').default
const { workflow } = require('payload-workflow')
const { webp } = require('payload-webp')
const { sitemap } = require('payload-sitemap-plugin')
const { pagespeed } = require('payload-plugin-pagespeed')
const { emailTemplate } = require('payload-email-template')
// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Places } from './collections/Places'
import { Header } from './collections/Header'
import { Footer } from './collections/Footer'
import { Blogs } from './collections/Blog'
import { Pages } from './collections/Page'
import { Forms } from './collections/Form'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: ['https://nomad-frontend-xi.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],

  collections: [Users, Media, Places, Header, Footer, Blogs, Pages, Forms],
  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false } // required in Vercel/Render
          : false, // disable SSL for local
    },
  }),

  sharp,
  plugins: [
    webp(),
    sitemap({
      // sitemap options
    }),
    pagespeed({
      // pagespeed options
    }),
    emailTemplate({
      // email template options
    }),
    lexical(),
    workflow(),
    formBuilder({
      fields: {
        payment: true,
      },
    }),
    nestedDocs({
      collections: ['pages'],
    }),
    redirects({
      collections: ['pages', 'posts'],
    }),
    search({
      collections: ['posts'],
    }),
    sentry({
      dsn: process.env.SENTRY_DSN,
    }),
    seo({
      collections: ['pages', 'posts'],
    }),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
