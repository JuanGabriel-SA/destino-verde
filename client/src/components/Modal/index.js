import styles from './modal.module.css';
import { motion } from 'framer';

const Modal = ({ children, title, className, trigger, visible, ...props }) => {

    const modalVariants = {
        show: {
            display: 'flex',
            opacity: 1,
            transition: {
                ease: 'circOut',
                when: 'beforeChildren'
            }
        },
        hide: {
            opacity: 0,
            transition: {
                ease: 'circIn',
                when: 'afterChildren'
            },
            transitionEnd: {
                display: 'none'
            }
        }
    }

    const contentVariants = {
        show: {
            x: -0,
            opacity: 1,
            transition: {
                ease: 'circOut',
            }
        },
        hide: {
            x: -200,
            opacity: 0,
            transition: {
                ease: 'circIn'
            }
        }
    }

    function closeModal() {
        trigger(false);
    }

    return (
        <motion.div
            initial='hide'
            variants={modalVariants}
            animate={visible ? 'show' : 'hide'}
            className={styles.modalComponent}>
            <motion.div
                variants={contentVariants}
                className={className ? styles.modalContent + ' ' + className : styles.modalContent}>
                <span onClick={e => closeModal()} className={styles.closeModalButton}>&times;</span>
                {title &&
                    <div className={styles.modalTitle}>
                        <h2>{title}</h2>
                    </div>
                }
                {children}
            </motion.div>
        </motion.div>
    );
}

export default Modal;