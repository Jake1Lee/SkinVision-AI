'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './BackButton.module.css';

const BackButton = () => {
  const router = useRouter();

  return (
    <button className={styles.backButton} onClick={() => router.back()}>
      <FaArrowLeft /> Back
    </button>
  );
};

export default BackButton;
