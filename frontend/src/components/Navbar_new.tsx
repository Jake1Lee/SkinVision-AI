'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import AuthForm from './AuthForm';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (showUserMenu || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, isMobileMenuOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <Link href="/" className={`${styles.homeButton} ${pathname === '/' ? styles.active : ''}`}>
              SkinVision AI
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className={styles.desktopNav}>
              <Link href="/benchmarking" className={`${styles.navButton} ${pathname === '/benchmarking' ? styles.active : ''}`}>
                Benchmarking
              </Link>
              <Link href="/about" className={`${styles.aboutButton} ${pathname === '/about' ? styles.active : ''}`}>
                About
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={styles.rightSection}>
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu} ref={mobileMenuRef}>
            <Link 
              href="/benchmarking" 
              className={`${styles.mobileNavButton} ${pathname === '/benchmarking' ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Benchmarking
            </Link>
            <Link 
              href="/about" 
              className={`${styles.mobileNavButton} ${pathname === '/about' ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </nav>

      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
    </>
  );
};

export default Navbar;
