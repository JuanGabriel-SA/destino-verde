import styles from './button.module.css';
const Button = ({ children, icon, style, ...props }) => {
    const Icon = icon;
    return (
        <button style={{ ...style }} className={styles.buttonComponent} {...props}>
            {children}
            {Icon !== undefined &&
                <span className={styles.buttonIcon}>
                    <Icon />
                </span>
            }
        </button>
    );
}

export default Button;