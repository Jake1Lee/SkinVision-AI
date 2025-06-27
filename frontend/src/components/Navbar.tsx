'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import AuthForm from './AuthForm';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      {/* Centered Container for Navbar and Auth Button */}
      <div className={styles.navbarContainer}>
        {/* Main Navigation Card */}
        <nav className={styles.navbar}>
          <div className={styles.container}>
            <div className={styles.leftSection}>
              <Link href="/" className={`${styles.homeButton} ${pathname === '/' ? styles.active : ''}`}>
                Home
              </Link>
              <Link href="/benchmarking" className={`${styles.navButton} ${pathname === '/benchmarking' ? styles.active : ''}`}>
                Benchmarking
              </Link>
              <Link href="/about" className={`${styles.aboutButton} ${pathname === '/about' ? styles.active : ''}`}>
                About
              </Link>
            </div>
          </div>
        </nav>

        {/* Auth Button aligned with navbar */}
        <div className={styles.authSection}>
          {currentUser ? (
            <div className={styles.userSection} ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.userButton}
              >
                <FaUser className={styles.icon} />
                <span className={styles.userName}>
                  {currentUser.displayName || currentUser.email || 'User'}
                </span>
              </button>

              {showUserMenu && (
                <div className={styles.userMenu}>
                  <div className={styles.userInfo}>
                    <strong>{currentUser.displayName || 'User'}</strong>
                    <small>{currentUser.email}</small>
                  </div>
                  <hr className={styles.menuDivider} />
                  <button
                    onClick={handleLogout}
                    className={styles.menuItem}
                  >
                    <FaSignOutAlt className={styles.icon} />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthForm(true)}
              className={styles.loginButton}
            >
              Se connecter
            </button>
          )}
        </div>
      </div>

      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </>
  );
};

export default Navbar;
