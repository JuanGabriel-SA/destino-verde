import styles from './button.module.css';
const Button = ({ children, icon, style, ...props }) => {
    const Icon = icon;
    return (
        <button style={{...style}} className={styles.buttonComponent} {...props}>
            {Icon !== undefined &&
                <span className={styles.buttonIcon}>
                    <Icon />
                </span>
            }
            {children}
        </button>
    );
}

export default Button;