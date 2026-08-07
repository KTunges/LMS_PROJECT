import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div className="skeleton skeleton-avatar"></div>
      <div className="skeleton skeleton-title" style={{ margin: 0, width: '60%' }}></div>
    </div>
    <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
    <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '8px' }}>
      <div className="skeleton skeleton-text" style={{ width: '80px', height: '24px', margin: 0 }}></div>
      <div className="skeleton skeleton-text" style={{ width: '60px', height: '24px', margin: 0 }}></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="glass-card" style={{ padding: '20px', width: '100%', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {Array(cols).fill(0).map((_, i) => (
            <th key={i} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--theme-glass-border)' }}>
              <div className="skeleton skeleton-text" style={{ width: '60%', margin: 0 }}></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array(rows).fill(0).map((_, i) => (
          <tr key={i}>
            {Array(cols).fill(0).map((_, j) => (
              <td key={j} style={{ padding: '16px', borderBottom: '1px solid var(--theme-glass-border-light)' }}>
                <div className="skeleton skeleton-text" style={{ width: j === 0 ? '80%' : '50%', margin: 0 }}></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonProfile = () => (
  <div className="glass-card" style={{ padding: '32px', display: 'flex', gap: '32px', alignItems: 'center' }}>
    <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%', flexShrink: 0 }}></div>
    <div style={{ flex: 1 }}>
      <div className="skeleton skeleton-title" style={{ width: '200px', height: '32px' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '150px' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '36px', borderRadius: '8px', margin: 0 }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '36px', borderRadius: '8px', margin: 0 }}></div>
      </div>
    </div>
  </div>
);
