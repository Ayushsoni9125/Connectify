import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import useChatStore from '../store/useChatStore';

export default function HomePage() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const pushedStateRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manage browser history for mobile view
  useEffect(() => {
    if (!isMobile) return;

    if (selectedUser) {
      if (!pushedStateRef.current) {
        window.history.pushState({ chatOpen: true }, '');
        pushedStateRef.current = true;
      }
    } else {
      if (pushedStateRef.current) {
        pushedStateRef.current = false;
        if (window.history.state?.chatOpen) {
          window.history.back();
        }
      }
    }
  }, [selectedUser, isMobile]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (isMobile && pushedStateRef.current) {
        setSelectedUser(null);
        pushedStateRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isMobile, setSelectedUser]);

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
