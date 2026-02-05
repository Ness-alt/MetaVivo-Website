// Shared object types
import button from './objects/button'
import navLink from './objects/navLink'
import footerColumn from './objects/footerColumn'

// Singletons
import siteSettings from './singletons/siteSettings'
import home from './singletons/home'
import about from './singletons/about'
import science from './singletons/science'
import careers from './singletons/careers'
import contact from './singletons/contact'
import termsOfService from './singletons/termsOfService'
import privacyPolicy from './singletons/privacyPolicy'
import disclosures from './singletons/disclosures'

// Module object types
import hero from './modules/hero'
import textBlock from './modules/textBlock'
import twoColumn from './modules/twoColumn'
import cardGrid from './modules/cardGrid'
import contentWithImage from './modules/contentWithImage'
import pressFeed from './modules/pressFeed'
import pressReleaseFeed from './modules/pressReleaseFeed'
import ctaBanner from './modules/ctaBanner'

// Collection types
import pressItem from './collections/pressItem'
import pressRelease from './collections/pressRelease'
import staffMember from './collections/staffMember'
import portfolioCompany from './collections/portfolioCompany'

export const schemaTypes = [
  // Objects
  button,
  navLink,
  footerColumn,

  // Singletons
  siteSettings,
  home,
  about,
  science,
  careers,
  contact,
  termsOfService,
  privacyPolicy,
  disclosures,

  // Modules
  hero,
  textBlock,
  twoColumn,
  cardGrid,
  contentWithImage,
  pressFeed,
  pressReleaseFeed,
  ctaBanner,

  // Collections
  pressItem,
  pressRelease,
  staffMember,
  portfolioCompany,
]
