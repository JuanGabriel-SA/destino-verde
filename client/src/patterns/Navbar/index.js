import { Col, Divider, Row } from 'antd';
import styles from './Navbar.module.css';
import { BiExit, BiHome, BiLocationPlus, BiMap, BiSearch, BiSolidUserCircle } from 'react-icons/bi';
import { motion } from 'framer';
import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from '@/redux/actions/Addres.actions';
import Alert from '@/components/Alert';
import { showNavbar } from '@/redux/actions/Navbar.actions';
const Navbar = () => {
    const [cep, setCep] = useState('');
    const [error, setError] = useState(false);
    const [showCepError, setShowCepError] = useState(false);
    const [addressNumber, setAddressNumber] = useState('');
    const [hoverNavbar, setHoverNavbar] = useState(false);
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const navVariants = {
        show: {
            width: '17vw',
            transition: {
                duration: 0.4,
                ease: 'circOut',
                staggerChildren: 0.3
            }
        },
        hidden: {
            width: '4vw',
            transition: {
                duration: 0.4,
                ease: 'circOut',
                when: "afterChildren"
            }
        }
    }

    const childVariants = {
        hidden: {
            opacity: 0,
            x: -20,
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                ease: 'circOut',
                duration: 0.3
            }
        },
    }


    async function getAddres() {
        if (validateAddress())
            await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    if (!data.erro) {
                        let aux = { ...data, numero: addressNumber }
                        dispatch(setAddress(aux));
                    } else {
                        setError('CEP não encontrado.');
                    }
                })
                .catch((error) => {
                    setError('Ocorreu um erro ao buscar o CEP');
                });
        else
            setShowCepError(true);
    }

    function validateAddress() {
        const regexCEP = /^[0-9]{5}-[0-9]{3}$/;
        if (addressNumber !== '')
            return regexCEP.test(cep);
        else
            return false
    }

    return (
        <motion.div
            initial='hidden'
            variants={navVariants}
            animate={state.navbarShow ? 'show' : 'hidden'}
            onMouseEnter={e => dispatch(showNavbar(true))}
            onMouseLeave={e => dispatch(showNavbar(false))}
            className={styles.navbarComponent}>
            <Row style={{ width: '100%' }}>
                <Col xs={{ span: 24 }}>
                    <Row justify={'center'}>
                        <img
                            src={state.navbarShow ? '/imgs/logo02.png' : '/imgs/logo04.png'}
                            className={state.navbarShow ? styles.navbarLogoShow : styles.navbarLogoHidden} />
                    </Row>
                    <Divider />
                </Col>
                <Col xs={{ span: 24 }}>
                    <Row>
                        <ul className={styles.navbarList}>
                            <motion.li variants={childVariants} className={styles.navbarListItem}>
                                <span>
                                    <BiMap />
                                </span>
                                <h3>Cadastrar ponto de coleta</h3>
                            </motion.li>
                            <motion.li variants={childVariants} className={styles.searchLocationField}>
                                <Input
                                    onFocus={e => setShowCepError(false)}
                                    mask='99999-999'
                                    onChange={e => setCep(e.target.value)}
                                    placeholder='Digite o CEP...'
                                    style={{ margin: 0 }}
                                    icon={BiLocationPlus}
                                    colorType='secondary' />
                                <Input
                                    onFocus={e => setShowCepError(false)}
                                    icon={BiHome}
                                    placeholder='Digite o número...'
                                    value={addressNumber}
                                    onChange={e => {
                                        let formatedValue = e.target.value.replace(/\D/g, '');
                                        setAddressNumber(formatedValue);
                                    }}
                                    style={{ marginLeft: 0, marginRight: 0 }}
                                    colorType='secondary' />
                                <Alert
                                    style={{ marginLeft: 0, marginRight: 0 }}
                                    trigger={setShowCepError}
                                    visible={showCepError}
                                    type='error'>
                                    CEP ou número incorreto(s).
                                </Alert>
                                <Button onClick={e => getAddres()} style={{ marginLeft: 0 }} icon={BiSearch}>Buscar</Button>
                            </motion.li>
                            <Divider />
                            <motion.li variants={childVariants}>
                                <Col xs={{ span: 24 }}>
                                    <Row justify={'center'}>
                                        <Col xs={{ span: 24 }}>
                                            <Row>
                                                <div className={styles.userField}>
                                                    <span>
                                                        <BiSolidUserCircle size={25} />
                                                    </span>
                                                    <h3>rewualgabriel@gmail.com</h3>
                                                </div>
                                            </Row>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Row>
                                                <div className={styles.loggoutField}>
                                                    <Button style={{ margin: 0 }} icon={BiExit}>Sair</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </motion.li>
                        </ul>
                    </Row>
                </Col>
            </Row>
        </motion.div>
    );
}

export default Navbar;