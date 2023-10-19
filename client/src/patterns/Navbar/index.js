import { Col, Divider, Row, notification } from 'antd';
import styles from './Navbar.module.css';
import { BiExit, BiHome, BiLocationPlus, BiMap, BiRecycle, BiSearch, BiSolidUserCircle } from 'react-icons/bi';
import { motion } from 'framer';
import { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from '@/redux/actions/Addres.actions';
import Alert from '@/components/Alert';
import { showNavbar } from '@/redux/actions/Navbar.actions';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
    const [cep, setCep] = useState('');
    const [showCepError, setShowCepError] = useState(false);
    const [addressNumber, setAddressNumber] = useState('');
    const navbarShow = useSelector(state => state.navbarShow);
    const stateUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

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
                        notification.error({
                            message: 'CEP não encontrado',
                            description: 'Digite um CEP válido.',
                            placement: 'topLeft'
                        });
                    }
                })
                .catch((error) => {
                    notification.error({
                        message: 'Ocorreu um erro ao buscar o CEP',
                        description: 'Digite um CEP válido.',
                        placement: 'topLeft'
                    });
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

    function createItems() {
        let items = [];
        const currentURL = router.asPath;

        if (currentURL !== '/home-user') {
            items.push(
                <motion.li variants={childVariants} className={styles.navbarListItem}>
                    <span>
                        <BiMap />
                    </span>
                    <h3>Mapa</h3>
                </motion.li>
            )
        }

        if (currentURL !== '/analyze-image') {
            items.push(
                <Link href='/analyze-image' style={{color: 'black'}}>
                    <motion.li variants={childVariants} className={styles.navbarListItem}>
                        <span>
                            <BiRecycle />
                        </span>
                        <h3>Analisar reciclável</h3>
                    </motion.li>
                </Link>
            )
        }

        return items;

    }

    return (
        <motion.div
            initial='hidden'
            variants={navVariants}
            animate={navbarShow ? 'show' : 'hidden'}
            onMouseEnter={e => dispatch(showNavbar(true))}
            onMouseLeave={e => dispatch(showNavbar(false))}
            className={styles.navbarComponent}>
            <Row style={{ width: '100%' }}>
                <Col xs={{ span: 24 }}>
                    <Row justify={'center'}>
                        <img
                            src={navbarShow ? '/imgs/logo02.png' : '/imgs/logo04.png'}
                            className={navbarShow ? styles.navbarLogoShow : styles.navbarLogoHidden} />
                    </Row>
                    <Divider />
                </Col>
                <Col xs={{ span: 24 }}>
                    <Row>
                        <ul className={styles.navbarList}>
                            {createItems()}
                            <motion.li variants={childVariants} className={styles.navbarListItem}>
                                <span>
                                    <BiMap />
                                </span>
                                <h3>Cadastrar ponto de coleta</h3>
                            </motion.li>
                            <motion.li variants={childVariants} className={styles.searchLocationField}>
                                <Input
                                    onFocus={e => setShowCepError(false)}
                                    value={cep}
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
                            <motion.li variants={childVariants}>
                                <Col xs={{ span: 24 }}>
                                    <Divider />
                                    <Row justify={'center'}>
                                        <Col xs={{ span: 24 }}>
                                            <Row>
                                                <div className={styles.userField}>
                                                    <span>
                                                        <BiSolidUserCircle size={25} />
                                                    </span>
                                                    <h3>{stateUser !== null && stateUser.email}</h3>
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