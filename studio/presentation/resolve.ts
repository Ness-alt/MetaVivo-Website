import type { PresentationPluginOptions } from '@sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    // Singletons
    home: {
      select: {
        title: 'title',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Homepage',
            href: '/',
          },
        ],
      }),
    },
    about: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'About', href: '/about' }],
      }),
    },
    science: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Science', href: '/science' }],
      }),
    },
    careers: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Careers', href: '/careers' }],
      }),
    },
    contact: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Contact', href: '/contact' }],
      }),
    },
    termsOfService: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Terms of Service', href: '/terms-of-service' }],
      }),
    },
    privacyPolicy: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Privacy Policy', href: '/privacy-policy' }],
      }),
    },
    disclosures: {
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Disclosures', href: '/disclosures' }],
      }),
    },

    // Collections
    pressRelease: {
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/news/${doc?.slug}`,
          },
        ],
      }),
    },
  },
}
