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
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdMenu } from 'react-icons/md';

const Navbar = () => {
    const [cep, setCep] = useState('');
    const [showCepError, setShowCepError] = useState(false);
    const [addressNumber, setAddressNumber] = useState('');
    const [screenWidth, setScreenWidth] = useState(undefined);
    const [screenHeight, setScreenHeight] = useState(undefined);
    const [showAlternativeNav, setShowAlternativeNav] = useState(false);
    const [collapseNav, setCollapseNav] = useState(true);
    const stateUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const attScreen = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Apenas no lado do cliente (navegador), acesse window.innerWidth
            setScreenWidth(window.innerWidth);
            setScreenHeight(window.innerHeight);
        }
        window.addEventListener('resize', attScreen);
        return () => {
            window.removeEventListener('resize', attScreen);
        };
    }, []);

    useEffect(() => {
        if (screenWidth <= 768)
            setShowAlternativeNav(true);
        else
            setShowAlternativeNav(false);
    }, [screenWidth])

    useEffect(() => {
        if (!showAlternativeNav)
            setCollapseNav(false);
        else
            setCollapseNav(true);
    }, [showAlternativeNav])

    const navVariants = {
        show: {
            height: '100vh',
            transition: {
                duration: 0.4,
                ease: 'circOut',
                staggerChildren: 0.2
            }
        },

        hide: {
            height: '20vh',
            transition: {
                duration: 0.4,
                ease: 'circOut',
                when: "afterChildren"
            }
        }
    }

    const listVariants = {
        show: {
            opacity: 1,
            transition: {
                ease: 'circOut',
                duration: 0.3
            }
        },

        hide: {
            opacity: 0
        }
    }

    async function getAddres() {
        if (validateAddress())
            await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    if (!data.erro) {
                        let aux = { ...data, numero: addressNumber }
                        setCollapseNav(true);
                        setAddressNumber('');
                        setCep('');
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
                <motion.li variants={listVariants} className={styles.navbarListItem}>
                    <span>
                        <BiMap />
                    </span>
                    <h3>Mapa</h3>
                </motion.li>
            )
        }

        if (currentURL !== '/analyze-image') {
            items.push(
                <Link href='/analyze-image' style={{ color: 'black' }}>
                    <motion.li className={styles.navbarListItem}>
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
            initial='hide'
            variants={navVariants}
            animate={!collapseNav ? 'show' : 'hide'}
            className={styles.navbarComponent}>
            <Row>
                <Col xs={{ span: 24 }}>
                    <Row justify={'center'}>
                        <img
                            src={'/imgs/logo02.png'}
                            className={styles.navbarLogoShow} />
                    </Row>
                    {showAlternativeNav &&
                        <button onClick={e => setCollapseNav(!collapseNav)} className={styles.collapseButton}>
                            <MdMenu />
                        </button>
                    }

                    <Divider />
                </Col>
                <Col xs={{ span: 24 }}>
                    <Row>
                        <ul className={styles.navbarList}>
                            {createItems()}
                            <motion.li variants={listVariants} className={styles.navbarListItem}>
                                <span>
                                    <BiMap />
                                </span>
                                <h3>Cadastrar ponto de coleta</h3>
                            </motion.li>
                            <motion.li variants={listVariants} className={styles.searchLocationField}>
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
                            <motion.li variants={listVariants}>
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