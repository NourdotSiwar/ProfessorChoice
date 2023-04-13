import React from 'react'
import styles from './styles/Loading.module.css'

const Loading = () => {

      return (
            <div className={styles['loading-container']}>
            <div className={styles.spinner}></div>
          </div>
      )
}

export default Loading