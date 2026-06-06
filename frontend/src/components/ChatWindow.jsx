import { useEffect, useRef, useState } from 'react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import useSocketStore from '../store/useSocketStore';
import { getAvatarUrl } from '../utils/avatar';

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function groupMessagesByDate(messages) {
  const groups = {};
  messages.forEach((msg) => {
    const key = new Date(msg.createdAt).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  });
  return groups;
}

export default function ChatWindow({ isMobile }) {
  const { selectedUser, setSelectedUser, messages, fetchMessages, sendMessage, isLoadingMessages, isSending } = useChatStore();
  const { authUser } = useAuthStore();
  const { socket } = useSocketStore();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      inputRef.current?.focus();
    }
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔴 Real-time: listen for incoming messages from the other person
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleNewMessage = (newMsg) => {
      // Only append if the message is from the currently open conversation
      const isFromSelectedUser =
        newMsg.senderId === selectedUser._id || newMsg.senderId?.toString() === selectedUser._id?.toString();
      if (isFromSelectedUser) {
        useChatStore.setState((state) => ({
          messages: [...state.messages, newMsg],
        }));
      }
    };

    socket.on('newMessage', handleNewMessage);

    // Cleanup listener when chat changes or component unmounts
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || isSending) return;
    setText('');
    await sendMessage(selectedUser._id, msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!selectedUser) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyContent}>
          <div style={styles.emptyIconWrap}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="url(#g1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 style={styles.emptyTitle}>Start a conversation</h2>
          <p style={styles.emptySubtitle}>Select a person from the sidebar to begin chatting</p>
          <div style={styles.emptyHints}>
            <div style={styles.hint}>
              <span>🔍</span> <span>Search for people by name</span>
            </div>
            <div style={styles.hint}>
              <span>💬</span> <span>Pick up where you left off</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const grouped = groupMessagesByDate(messages);
  const dateKeys = Object.keys(grouped);

  return (
    <div style={styles.window}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          {isMobile && (
            <button
              onClick={() => setSelectedUser(null)}
              style={styles.backBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <img
              src={getAvatarUrl(selectedUser)}
              alt={selectedUser.fullname}
              style={styles.avatar}
            />
            <span style={styles.onlineDot} />
          </div>
          <div>
            <div style={styles.chatName}>{selectedUser.fullname}</div>
            <div style={styles.chatHandle}>@{selectedUser.username}</div>
          </div>
        </div>

      </div>

      {/* Messages area */}
      <div style={styles.messages} id="messages-container">
        {isLoadingMessages ? (
          <div style={styles.loadingCenter}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={styles.noMessages}>
            <div style={styles.noMessagesIcon}>👋</div>
            <p style={styles.noMessagesText}>
              Start your conversation with <strong>{selectedUser.fullname}</strong>
            </p>
          </div>
        ) : (
          dateKeys.map((dateKey) => (
            <div key={dateKey}>
              {/* Date divider */}
              <div style={styles.dateDivider}>
                <span style={styles.dateLine} />
                <span style={styles.dateLabel}>{formatDate(grouped[dateKey][0].createdAt)}</span>
                <span style={styles.dateLine} />
              </div>
              {grouped[dateKey].map((msg, i) => {
                const isSelf = msg.senderId === authUser?._id;
                const isLast = i === grouped[dateKey].length - 1;
                return (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    isSelf={isSelf}
                    isLast={isLast}
                    authUser={authUser}
                    selectedUser={selectedUser}
                  />
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} style={styles.inputBar}>
        <div style={styles.inputWrap}>
          <textarea
            ref={inputRef}
            id="message-input"
            style={styles.textarea}
            placeholder={`Message ${selectedUser.fullname}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>
        <button
          id="send-btn"
          type="submit"
          style={{
            ...styles.sendBtn,
            opacity: !text.trim() || isSending ? 0.5 : 1,
            cursor: !text.trim() || isSending ? 'default' : 'pointer',
          }}
          disabled={!text.trim() || isSending}
        >
          {isSending ? (
            <span className="spinner" style={{ width: 18, height: 18, borderTopColor: 'white' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ msg, isSelf, isLast, authUser, selectedUser }) {
  return (
    <div
      style={{
        ...styles.msgRow,
        justifyContent: isSelf ? 'flex-end' : 'flex-start',
        marginBottom: isLast ? '4px' : '2px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {!isSelf && (
        <img
          src={getAvatarUrl(selectedUser)}
          alt=""
          style={styles.msgAvatar}
        />
      )}
      <div
        style={{
          ...styles.bubble,
          ...(isSelf ? styles.bubbleSelf : styles.bubbleOther),
          borderRadius: isSelf
            ? '18px 18px 4px 18px'
            : '18px 18px 18px 4px',
        }}
      >
        <p style={styles.bubbleText}>{msg.message}</p>
        <span style={styles.bubbleTime}>{formatTime(msg.createdAt)}</span>
      </div>
      {isSelf && (
        <img
          src={getAvatarUrl(authUser)}
          alt=""
          style={styles.msgAvatar}
        />
      )}
    </div>
  );
}

const styles = {
  empty: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-dark)',
    padding: '40px',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    maxWidth: '360px',
    textAlign: 'center',
  },
  emptyIconWrap: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptySubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  emptyHints: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  window: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--bg-dark)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(15,15,26,0.9)',
    backdropFilter: 'blur(10px)',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    marginRight: '4px',
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(124,58,237,0.4)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#22c55e',
    border: '2px solid var(--bg-dark)',
  },
  chatName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  chatHandle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },

  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  loadingCenter: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  noMessages: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '60px 20px',
    gap: '12px',
  },
  noMessagesIcon: {
    fontSize: '48px',
  },
  noMessagesText: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    margin: 0,
  },
  dateDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '16px 0 10px',
  },
  dateLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border)',
  },
  dateLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    background: 'rgba(124,58,237,0.1)',
    padding: '3px 10px',
    borderRadius: '20px',
    border: '1px solid rgba(124,58,237,0.2)',
  },
  msgRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '100%',
  },
  msgAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    border: '1px solid rgba(124,58,237,0.3)',
  },
  bubble: {
    maxWidth: '65%',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bubbleSelf: {
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    boxShadow: '0 2px 12px rgba(124,58,237,0.25)',
  },
  bubbleOther: {
    background: 'rgba(30,30,48,0.9)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  bubbleText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text-primary)',
    margin: 0,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  bubbleTime: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.45)',
    alignSelf: 'flex-end',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    padding: '14px 16px',
    borderTop: '1px solid var(--border)',
    background: 'rgba(15,15,26,0.9)',
    backdropFilter: 'blur(10px)',
  },
  inputWrap: {
    flex: 1,
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '2px 4px',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '14px',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    maxHeight: '120px',
    overflowY: 'auto',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s, transform 0.15s',
    boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
  },
};
