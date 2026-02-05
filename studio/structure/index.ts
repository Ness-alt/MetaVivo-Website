const pageTypes = [
  { id: 'home', label: 'Homepage' },
  { id: 'about', label: 'About' },
  { id: 'science', label: 'Science' },
  { id: 'careers', label: 'Careers' },
  { id: 'contact', label: 'Contact' },
]

const adminTypes = [
  { id: 'siteSettings', label: 'Site Settings' },
  { id: 'termsOfService', label: 'Terms of Service' },
  { id: 'privacyPolicy', label: 'Privacy Policy' },
  { id: 'disclosures', label: 'Disclosures' },
]

export const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Pages').child(
        S.list().title('Pages').items(
          pageTypes.map(({ id, label }) =>
            S.listItem()
              .title(label)
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
      S.divider(),
      S.listItem().title('Staff').child(
        S.documentTypeList('staffMember').title('Staff Members')
      ),
      S.listItem().title('Portfolio').child(
        S.documentTypeList('portfolioCompany').title('Portfolio Companies')
      ),
      S.divider(),
      S.listItem().title('Admin').child(
        S.list().title('Admin').items(
          adminTypes.map(({ id, label }) =>
            S.listItem()
              .title(label)
              .child(S.document().documentId(id).schemaType(id))
          )
        )
      ),
    ])
