const singletonTypes = [
  'siteSettings',
  'home',
  'about',
  'science',
  'careers',
  'contact',
  'termsOfService',
  'privacyPolicy',
  'disclosures',
]

const singletonLabels: Record<string, string> = {
  siteSettings: 'Site Settings',
  home: 'Homepage',
  about: 'About',
  science: 'Science',
  careers: 'Careers',
  contact: 'Contact',
  termsOfService: 'Terms of Service',
  privacyPolicy: 'Privacy Policy',
  disclosures: 'Disclosures',
}

export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site Settings').child(
        S.document().documentId('siteSettings').schemaType('siteSettings')
      ),
      S.divider(),
      S.listItem().title('Pages').child(
        S.list().title('Pages').items(
          singletonTypes
            .filter((id) => id !== 'siteSettings')
            .map((id) =>
              S.listItem()
                .title(singletonLabels[id] || id)
                .child(S.document().documentId(id).schemaType(id))
            )
        )
      ),
      S.divider(),
      S.listItem().title('Press').child(
        S.documentTypeList('pressItem').title('Press Items')
      ),
      S.listItem().title('Press Releases').child(
        S.documentTypeList('pressRelease').title('Press Releases')
      ),
    ])
