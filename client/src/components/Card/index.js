import styles from './card.module.css';
import { motion } from 'framer';

const Card = ({ children, title, className, style }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{
                opacity: 1,
                x: 0,
                transition: {
                    duration: 0.5,
                    ease: 'circOut'
                }
            }}
            style={{ ...style }}
            className={styles.cardComponent + ' ' + className}>
            <div className={styles.cardHeader}>
            </div>
            <div className='card-body'>
                {children}
            </div>
        </motion.div>
    );
}

export default Card;