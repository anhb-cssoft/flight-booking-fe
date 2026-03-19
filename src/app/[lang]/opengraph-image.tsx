import { ImageResponse } from 'next/og'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n-config'

export const alt = 'SkyBooker - Flight Booking'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { lang: string } }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as Locale)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
           <span style={{ fontSize: '72px', fontWeight: 'bold', color: 'white', marginLeft: '20px' }}>SkyBooker</span>
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#3b82f6',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          {dictionary.home.hero.title} {dictionary.home.hero.subtitle}
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {dictionary.home.hero.description}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
