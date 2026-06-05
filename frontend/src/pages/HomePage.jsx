import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function HomePage() {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: 'var(--bg-dark)',
  },
};
