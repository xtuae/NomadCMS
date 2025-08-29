import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { formBuilder } from '@payloadcms/plugin-form-builder'
import { nestedDocs } from '@payloadcms/plugin-nested-docs'
import { redirects } from '@payloadcms/plugin-redirects'
import { search } from '@payloadcms/plugin-search'
import { sentry } from '@payloadcms/plugin-sentry'
import { seo } from '@payloadcms/plugin-seo'
import lexical from 'payload-plugin-lexical'
import { workflow } from 'payload-workflow'
import { webp } from 'payload-webp'
import sitemap from 'payload-sitemap-plugin'
import { pagespeed } from 'payload-plugin-pagespeed'
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
    lexical(),
    workflow(),
    webp(),
    sitemap({}),
    pagespeed({}),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
