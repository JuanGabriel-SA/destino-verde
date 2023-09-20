import { motion } from 'framer-motion';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillInfoCircle, AiOutlineClose } from 'react-icons/ai';
import styles from './alert.module.css';

const Alert = ({ children, type, style, visible, trigger, ...props }) => {
    const variants = {
        show: {
            display: 'flex',
            opacity: 1,
            height: '60px',
            transition: {
                duration: 0.2,
                ease: 'circOut'
            }
        },
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.2,
                ease: 'circIn',
            },
            transitionEnd: {
                display: 'none'
            }
        }
    }
    function getType() {
        switch (type) {
            case 'info':
                return styles.alertMessageInfo;
            case 'error':
                return styles.alertMessageError;
            case 'sucess':
                return styles.alertMessageSucess;
            default:
                return null;
        }
    }

    function getIcon() {
        switch (type) {
            case 'info':
                return <AiFillInfoCircle />;
            case 'error':
                return <AiFillCloseCircle />;
            case 'sucess':
                return <AiFillCheckCircle />;
            default:
                return null;
        }
    }
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            className={styles.alertComponent}
            whileInView={{
                scale: [1, 1.04, 1],
                transition: {
                    duration: 2,
                    ease: 'circOut',
                    repeat: Infinity
                }
            }}
            variants={variants}
            animate={visible ? 'show' : 'hidden'}
            layout
            style={{...style}}
            {...props}>
            <span className={styles.closeIcon} onClick={() => trigger(false)}>
                <AiOutlineClose />
            </span>
            <div className={getType()}>
                <span className={styles.alertIcon}>
                    {getIcon()}
                </span>
                <label style={{ color: 'white' }}>
                    {children}
                </label>
            </div>
        </motion.div>
    )
}

export default Alert;