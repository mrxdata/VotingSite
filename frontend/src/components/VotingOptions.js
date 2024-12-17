import React from 'react';
import styles from './VotingOptions.module.css'; // Импорт стилей

const VotingOptions = ({ options, selectedOption, setSelectedOption }) => {
    return (
        <div className={styles.optionsList}>
            {options.map((option, index) => (
                <label key={index} className={styles.optionItem}>
                    <input
                        type="radio"
                        name="votingOption"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                        className={styles.voteRadioButton}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default VotingOptions;
