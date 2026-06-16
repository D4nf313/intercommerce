const styles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    background: 'linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  },
  body: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  line: {
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
  },
};

const SkeletonCard = () => (
  <>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
    <div style={styles.card}>
      <div style={styles.image} />
      <div style={styles.body}>
        <div style={{ ...styles.line, height: '18px', width: '70%' }} />
        <div style={{ ...styles.line, height: '14px', width: '90%' }} />
        <div style={{ ...styles.line, height: '14px', width: '40%' }} />
      </div>
    </div>
  </>
);

export default SkeletonCard;
