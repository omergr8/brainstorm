import React, { useState } from 'react';
import styles from './ToggleButton.module.css';

const ToggleButton = () => {
  const [active, setActive] = useState('Option 1');

  const handleToggle = (option) => {
    setActive(option);
  };

  return (
    <div className={styles.toggleContainer}>
      <div
        className={`${styles.option} ${active === 'Option 1' ? styles.active : ''}`}
        onClick={() => handleToggle('Option 1')}
      >
        Option 1
      </div>
      <div
        className={`${styles.option} ${active === 'Option 2' ? styles.active : ''}`}
        onClick={() => handleToggle('Option 2')}
      >
        Option 2
      </div>
    </div>
  );
};

export default ToggleButton;
