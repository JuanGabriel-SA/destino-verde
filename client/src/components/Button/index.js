import styles from './button.module.css';
const Button = ({ children, icon, style, iconStyle, ...props }) => {
    const Icon = icon;
    return (
        <button style={{ ...style }} className={styles.buttonComponent} {...props}>
            <label style={{cursor: 'pointer'}}>
                {children}
            </label>
            {Icon !== undefined &&
                <span className={styles.buttonIcon} style={{ ...iconStyle }}>
                    <Icon />
                </span>
            }
        </button>
    );
}

export default Button;