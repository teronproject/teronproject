import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Teron Token Leaderboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(to bottom right, #111111, #000000)',
          color: 'white',
          padding: '80px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background gradient blur */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(249, 204, 11, 0.15) 0%, rgba(0,0,0,0) 70%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: 32, color: '#f9cc0b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>Teron Platform</span>
          </div>
          
          <h1 style={{ fontSize: 96, fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff', margin: 0, lineHeight: 1.1 }}>
            Token Leaderboard
          </h1>
          
          <p style={{ fontSize: 36, color: '#aaaaaa', marginTop: '32px', maxWidth: '800px', lineHeight: 1.4 }}>
            Discover and track top BEP-20 tokens deployed cleanly and immutably on the BNB Smart Chain.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          borderTop: '1px solid #333', 
          paddingTop: '40px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, color: '#aaa', fontWeight: 500 }}>
              Premium Web3 Launchpad
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, color: '#f9cc0b', fontWeight: 'bold' }}>teron.io</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
