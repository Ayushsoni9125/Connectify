import { useState, useEffect, useCallback } from 'react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import { getAvatarUrl } from '../utils/avatar';

function Avatar({ user, size = 40, showOnline = false }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <img
        src={getAvatarUrl(user)}
        alt={user?.fullname}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(124,58,237,0.3)',
        }}
      />
      {showOnline && (
        <span style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#22c55e',
          border: '2px solid var(--bg-sidebar)',
        }} />
      )}
    </div>
  );
}

function UserItem({ user, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick(user)}
      style={{
        ...styles.userItem,
        ...(isSelected ? styles.userItemSelected : {}),
      }}
    >
      <Avatar user={user} />
      <div style={styles.userInfo}>
        <span style={styles.userName}>{user.fullname}</span>
        <span style={styles.userHandle}>@{user.username}</span>
      </div>
    </button>
  );
}

export default function Sidebar({ isMobile }) {
  const { logout, authUser } = useAuthStore();
  const {
    selectedUser, setSelectedUser,
    searchUsers, fetchChatters,
    users, chatters,
    isLoadingUsers, searchQuery, setSearchQuery,
  } = useChatStore();

  const [tab, setTab] = useState('chats'); // 'chats' | 'search'

  useEffect(() => {
    fetchChatters();
  }, []);

  const handleSearch = useCallback(
    debounce((q) => {
      if (q.trim()) searchUsers(q);
    }, 350),
    []
  );

  const onSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim()) {
      setTab('search');
      handleSearch(q);
    } else {
      setTab('chats');
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const displayList = tab === 'search' ? users : chatters;

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: isMobile ? '100%' : '300px',
        minWidth: isMobile ? '100%' : '260px',
        borderRight: isMobile ? 'none' : '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" />
            </svg>
          </div>
          <span style={styles.logoText}>Connectify</span>
        </div>
        <button
          id="logout-btn"
          onClick={logout}
          style={styles.logoutBtn}
          title="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Current user */}
      <div style={styles.meRow}>
        <Avatar user={authUser} size={36} showOnline />
        <div style={styles.meInfo}>
          <span style={styles.meName}>{authUser?.fullname}</span>
          <span style={styles.meHandle}>@{authUser?.username}</span>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          id="user-search"
          style={styles.searchInput}
          type="text"
          placeholder="Search people..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        {searchQuery && (
          <button
            style={styles.clearBtn}
            onClick={() => { setSearchQuery(''); setTab('chats'); }}
          >
            ×
          </button>
        )}
      </div>

      {/* Tab labels */}
      <div style={styles.tabRow}>
        <span style={styles.tabLabel}>
          {tab === 'search' ? `Results for "${searchQuery}"` : 'Recent Chats'}
        </span>
        {tab === 'chats' && chatters.length > 0 && (
          <span style={styles.badge}>{chatters.length}</span>
        )}
      </div>

      {/* User List */}
      <div style={styles.list}>
        {isLoadingUsers ? (
          <div style={styles.loadingWrap}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={styles.skeletonItem}>
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 12, width: '60%' }} />
                  <div className="skeleton" style={{ height: 10, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayList.length === 0 ? (
          <div style={styles.emptyState}>
            {tab === 'search' ? (
              <>
                <span style={styles.emptyIcon}>🔍</span>
                <p>No users found</p>
              </>
            ) : (
              <>
                <span style={styles.emptyIcon}>💬</span>
                <p>No chats yet</p>
                <p style={{ fontSize: '12px', marginTop: 4 }}>Search for people to start chatting</p>
              </>
            )}
          </div>
        ) : (
          displayList.map((u) => (
            <UserItem
              key={u._id}
              user={u}
              isSelected={selectedUser?._id === u._id}
              onClick={handleSelectUser}
            />
          ))
        )}
      </div>
    </aside>
  );
}

// Simple debounce utility
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const styles = {
  sidebar: {
    width: '300px',
    minWidth: '260px',
    height: '100%',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 16px 14px',
    borderBottom: '1px solid var(--border)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(124,58,237,0.4)',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '6px 8px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  meRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(124,58,237,0.06)',
    borderBottom: '1px solid var(--border)',
  },
  meInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  meName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  meHandle: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  searchWrap: {
    position: 'relative',
    padding: '12px 12px 8px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '24px',
    color: 'var(--text-muted)',
    display: 'flex',
  },
  searchInput: {
    width: '100%',
    padding: '9px 32px 9px 36px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  clearBtn: {
    position: 'absolute',
    right: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2px',
  },
  tabRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 16px 8px',
  },
  tabLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  badge: {
    background: 'rgba(124,58,237,0.25)',
    color: '#a78bfa',
    borderRadius: '10px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 8px',
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
  },
  skeletonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
  },
  userItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 10px',
    borderRadius: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
    marginBottom: '2px',
  },
  userItemSelected: {
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userHandle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    gap: '8px',
    color: 'var(--text-muted)',
    fontSize: '13px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '36px',
    marginBottom: '8px',
  },
};
