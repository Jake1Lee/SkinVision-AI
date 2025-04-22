import Link from 'next/link';
import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.homeButton}>
          Home
        </Link>
        <Link href="/about" className={styles.aboutButton}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
