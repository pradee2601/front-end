'use client';
import React, { useEffect, useState } from 'react';
import { getIdeaById } from '../../api/idea';
import { useRouter } from 'next/navigation';

const bmcSections = [
  { key: 1, title: 'CLIENTS', style: { gridArea: 'clients', background: '#c0392b' }, icon: '👥' },
  { key: 2, title: 'VALUE PROPOSITIONS', style: { gridArea: 'value', background: '#27ae60' }, icon: '💡' },
  { key: 3, title: 'CHANNELS', style: { gridArea: 'channels', background: '#f1c40f' }, icon: '🌉' },
  { key: 4, title: 'RELATIONSHIP', style: { gridArea: 'relationship', background: '#e67e22' }, icon: '💬' },
  { key: 5, title: 'REVENUES', style: { gridArea: 'revenues', background: '#9b59b6' }, icon: '💰' },
  { key: 6, title: 'ACTIVITIES', style: { gridArea: 'activities', background: '#5dade2' }, icon: '🔄' },
  { key: 7, title: 'RESOURCES', style: { gridArea: 'resources', background: '#8e44ad' }, icon: '🧱' },
  { key: 8, title: 'PARTNERS', style: { gridArea: 'partners', background: '#34495e' }, icon: '🤝' },
  { key: 9, title: 'COSTS', style: { gridArea: 'costs', background: '#154360' }, icon: '💲' },
];

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateAreas: `
    'resources activities value channels clients'
    'partners activities value relationship clients'
    'partners costs revenues revenues revenues'
  `,
  gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr',
  gap: '10px',
  height: '100vh',
  padding: '20px',
  background: '#ffffff',
};

const cardStyle: React.CSSProperties = {
  borderRadius: '16px',
  color: 'white',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fontWeight: 600,
  fontSize: '1.2rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  minHeight: '120px',
};

const cardContentStyle: React.CSSProperties = {
  marginTop: 8,
  fontWeight: 400,
  fontSize: '1rem',
  maxHeight: '180px',
  overflowY: 'auto',
  width: '100%',
};

const partnersCardStyle: React.CSSProperties = {
  minHeight: '60px',
  gridRow: '2',
  gridColumn: '1',
};

export default function BMCPage() {
  const [ideaData, setIdeaData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const ideaId = localStorage.getItem('IdeaId');
    if (userId && ideaId) {
      getIdeaById(userId, ideaId, setError).then((data) => {
        if (data) setIdeaData(data);
        setLoading(false);
      });
    } else {
      setError('User ID and Idea ID are required in localStorage.');
      setLoading(false);
    }
  }, []);

  const bmc = ideaData?.bmc?.bmc_draft || {};

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <h1 className='text-2xl font-bold mt-2 ml-2'>
          Business Model Canvas
        </h1>
        <button
          style={{ marginRight: '1.5rem', marginTop: '0.5rem', padding: '0.5rem 1.5rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')}
        >
          Next
        </button>
      </div>
      <div style={gridStyle}>
        {/* Show loading, error, or nothing */}
        {loading && <div style={{ color: 'gray', marginBottom: 16 }}>Loading...</div>}
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        {/* RESOURCES */}
        <div style={{ ...cardStyle, ...bmcSections[6].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[6].icon}</span>
            <div>{'7. ' + bmcSections[6].title}</div>
          </div>
          {bmc.key_resources && (
            <ul style={cardContentStyle}>
              {bmc.key_resources.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* ACTIVITIES */}
        <div style={{ ...cardStyle, ...bmcSections[5].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[5].icon}</span>
            <div>{'6. ' + bmcSections[5].title}</div>
          </div>
          {bmc.key_activities && (
            <ul style={cardContentStyle}>
              {bmc.key_activities.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* VALUE PROPOSITIONS */}
        <div style={{ ...cardStyle, ...bmcSections[1].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[1].icon}</span>
            <div>{'2. ' + bmcSections[1].title}</div>
          </div>
          {bmc.value_proposition && (
            <div style={cardContentStyle}>{bmc.value_proposition}</div>
          )}
        </div>
        {/* CHANNELS */}
        <div style={{ ...cardStyle, ...bmcSections[2].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[2].icon}</span>
            <div>{'3. ' + bmcSections[2].title}</div>
          </div>
          {bmc.channels && (
            <ul style={cardContentStyle}>
              {bmc.channels.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* CLIENTS */}
        <div style={{ ...cardStyle, ...bmcSections[0].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[0].icon}</span>
            <div>{'1. ' + bmcSections[0].title}</div>
          </div>
          {bmc.customer_segments && (
            <ul style={cardContentStyle}>
              {bmc.customer_segments.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* PARTNERS */}
        <div style={{ ...cardStyle, ...bmcSections[7].style, ...partnersCardStyle }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[7].icon}</span>
            <div>{'8. ' + bmcSections[7].title}</div>
          </div>
          {bmc.key_partnerships && (
            <ul style={cardContentStyle}>
              {bmc.key_partnerships.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* RELATIONSHIP */}
        <div style={{ ...cardStyle, ...bmcSections[3].style }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[3].icon}</span>
            <div>{'4. ' + bmcSections[3].title}</div>
          </div>
          {bmc.customer_relationships && (
            <ul style={cardContentStyle}>
              {bmc.customer_relationships.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* COSTS */}
        <div style={{ ...cardStyle, ...bmcSections[8].style, gridColumn: '1 / span 2', gridRow: '3' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[8].icon}</span>
            <div>{'9. ' + bmcSections[8].title}</div>
          </div>
          {bmc.cost_structures && (
            <ul style={cardContentStyle}>
              {bmc.cost_structures.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        {/* REVENUES */}
        <div style={{ ...cardStyle, ...bmcSections[4].style, gridColumn: '3 / span 3', gridRow: '3' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '2rem' }}>{bmcSections[4].icon}</span>
            <div>{'5. ' + bmcSections[4].title}</div>
          </div>
          {bmc.revenue_streams && (
            <ul style={cardContentStyle}>
              {bmc.revenue_streams.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
