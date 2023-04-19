import React from 'react';
import styles from './styles/Card.module.css';

const Card = () => {
    return (
        <div className={styles.card}>
            <div className={styles['image-name']}>
                <img className={styles.image} src="https://i.pinimg.com/originals/f5/d9/8b/f5d98b3e305d45533bd32d558c70c5d9.jpg" alt='Profile'/>
                <p className={styles.name}>pablo</p>
            </div>
            <div className={styles.content}>   
                <p className={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. lore</p>
            </div>
        </div> 
    )
}

export default Card;


