import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    gender: 'male',
  });
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return;
    const ok = await register(form);
    if (ok) navigate('/');
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" />
            </svg>
          </div>
          <span style={styles.logoText}>Connectify</span>
        </div>

        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Join thousands of people chatting today</p>

        {/* Step indicator */}
        <div style={styles.steps}>
          <div style={{ ...styles.stepDot, ...(step >= 1 ? styles.stepActive : {}) }} />
          <div style={styles.stepLine} />
          <div style={{ ...styles.stepDot, ...(step >= 2 ? styles.stepActive : {}) }} />
        </div>

        <form onSubmit={step === 1 ? nextStep : handleSubmit} style={styles.form}>
          {step === 1 ? (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    id="reg-fullname"
                    style={styles.input}
                    type="text"
                    name="fullname"
                    placeholder="John Doe"
                    value={form.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>@</span>
                  <input
                    id="reg-username"
                    style={styles.input}
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="reg-email"
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={styles.btn}>
                Continue →
              </button>
            </>
          ) : (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="reg-password"
                    style={styles.input}
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {form.password.length > 0 && form.password.length < 6 && (
                  <span style={styles.hint}>Password must be at least 6 characters</span>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Gender</label>
                <div style={styles.genderRow}>
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      style={{
                        ...styles.genderBtn,
                        ...(form.gender === g ? styles.genderActive : {}),
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                      />
                      {g === 'male' ? '👨' : '👩'} {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={styles.backBtn}
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  id="reg-submit"
                  type="submit"
                  style={{ ...styles.btn, flex: 1, opacity: isLoading ? 0.7 : 1 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span style={styles.btnContent}>
                      <span className="spinner" style={{ borderTopColor: 'white' }} />
                      Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-dark)',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  blob1: {
    position: 'absolute',
    bottom: '-15%',
    left: '-15%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    top: '-15%',
    right: '-10%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(19,19,31,0.85)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    animation: 'fadeIn 0.4s ease',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '0',
  },
  stepDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    transition: 'background 0.3s',
  },
  stepActive: {
    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    boxShadow: '0 0 8px rgba(124,58,237,0.6)',
  },
  stepLine: {
    flex: 1,
    height: '2px',
    background: 'rgba(255,255,255,0.1)',
    margin: '0 8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
    display: 'flex',
    fontSize: '14px',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    padding: '4px',
  },
  hint: {
    fontSize: '12px',
    color: '#f87171',
  },
  genderRow: {
    display: 'flex',
    gap: '10px',
  },
  genderBtn: {
    flex: 1,
    padding: '10px 12px',
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  genderActive: {
    border: '1px solid rgba(124,58,237,0.6)',
    background: 'rgba(124,58,237,0.15)',
    color: '#a78bfa',
  },
  btn: {
    marginTop: '4px',
    padding: '13px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    padding: '13px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    color: '#a78bfa',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
