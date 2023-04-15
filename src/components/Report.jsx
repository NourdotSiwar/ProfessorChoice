import React, {useState} from 'react'
import { FiFlag } from 'react-icons/fi'
import styles from './styles/Report.module.css'


const Report = () => {
      const [showReportForm, setShowReportForm] = useState(false)

      const toggleReportForm = () => {
            setShowReportForm(!showReportForm);};

      return (
            <>
                  <button onClick={toggleReportForm} className={styles.report}><FiFlag/></button>

                  <div
                  className={`${styles['report-form']} ${
                  showReportForm ? styles.active : ''
                  }`}
                  >
                  <h2>Report Post</h2>
                  <form>
                  <label htmlFor="reason">Reason:</label>
                  <input type="text" id="reason" name="reason" />
                  <button
                  onClick={() => {
                  alert(
                  'Thank you for your report! We will review it as soon as possible.'
                  );
                  setShowReportForm(false);
                  }}
                  type="submit"
                  >
                  Submit
                  </button>
                  </form>
                  </div>

                  {showReportForm && (
        <div className={styles.overlay} onClick={toggleReportForm} />
      )}
            </>
      )
}

export default Report