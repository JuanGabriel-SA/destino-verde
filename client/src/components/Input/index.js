import { useEffect } from 'react';
import styles from './input.module.css';
import ReactInputMask from 'react-input-mask';
const Input = ({ icon, style, colorType, placeholder, mask, type, maxLength, onChange, ...props }) => {
    const Icon = icon;

    function getColorType() {
        switch (colorType) {
            case 'secondary':
                return styles.inputSecondary;
            default:
                return styles.inputPrimary
        }
    }
    return (
        <div style={{ ...style }} className={getColorType() + ' ' + styles.inputComponent}>
            {Icon !== undefined &&
                <span className={styles.inputIcon}>
                    <Icon />
                </span>
            }
            {mask !== undefined ?
                <ReactInputMask mask={mask && mask} onChange={onChange}  {...props} >
                    {(props) => <input placeholder={placeholder} type={type} maxLength={maxLength} />}
                </ReactInputMask>
                :
                <input placeholder={placeholder} onChange={onChange} type={type} {...props} />
            }
        </div>
    );
}

export default Input;