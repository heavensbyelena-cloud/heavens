export default function SkeletonCard() {
  return (
    <div style={{ border: '1px solid var(--bordure)', background: 'var(--blanc)' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1', display: 'block' }} />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '18px', width: '70%', margin: '0 auto 10px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', margin: '0 auto' }} />
      </div>
    </div>
  );
}
