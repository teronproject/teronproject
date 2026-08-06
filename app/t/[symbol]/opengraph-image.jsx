import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Teron Token Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://teron.io';
  
  let tokenData = null;
  try {
    const res = await fetch(`${baseUrl}/api/projects/${symbol}`);
    if (res.ok) {
      const data = await res.json();
      tokenData = data.token;
    }
  } catch (err) {
    console.error("Failed to fetch token for OG Image:", err);
  }

  const name = tokenData?.name || symbol.toUpperCase();
  const logoUrl = tokenData?.profile?.logoUrl;
  const chain = tokenData?.chain || "BNB Chain";
  const isConfirmed = tokenData?.deploymentStatus === "CONFIRMED";

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

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              width={140} 
              height={140} 
              style={{ 
                borderRadius: '70px', 
                border: '4px solid #f9cc0b',
                objectFit: 'cover'
              }} 
            />
          ) : (
            <div 
              style={{ 
                width: 140, 
                height: 140, 
                borderRadius: 70, 
                border: '4px solid #f9cc0b', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 48, 
                backgroundColor: '#222',
                color: '#f9cc0b',
                fontWeight: 'bold'
              }}
            >
              {symbol.slice(0,3).toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '40px' }}>
            <span style={{ fontSize: 72, fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>{name}</span>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: 32, color: '#f9cc0b', fontWeight: 'bold' }}>${symbol.toUpperCase()}</span>
              <span style={{ fontSize: 32, color: '#666', margin: '0 16px' }}>•</span>
              <span style={{ fontSize: 32, color: '#888' }}>{chain}</span>
            </div>
          </div>
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
              {isConfirmed ? 'Verified Smart Contract' : 'Token Profile'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 24, color: '#888', marginRight: '16px' }}>Deployed via</span>
            <span style={{ fontSize: 32, color: '#f9cc0b', fontWeight: 'bold' }}>Teron Platform</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
