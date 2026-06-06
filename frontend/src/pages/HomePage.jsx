import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import useChatStore from '../store/useChatStore';

export default function HomePage() {
  const { selectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.layout}>
      {(!isMobile || !selectedUser) && <Sidebar isMobile={isMobile} />}
      {(!isMobile || selectedUser) && <ChatWindow isMobile={isMobile} />}
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
