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
import Cookies from 'js-cookie';
import { setUser } from '@/redux/actions/User.actions';

const Navbar = () => {
    const [cep, setCep] = useState('');
    const [showCepError, setShowCepError] = useState(false);
    const [addressNumber, setAddressNumber] = useState('');
    const [screenWidth, setScreenWidth] = useState(undefined);
    const [screenHeight, setScreenHeight] = useState(undefined);
    const [showAlternativeNav, setShowAlternativeNav] = useState(false);
    const [collapseNav, setCollapseNav] = useState(false);
    const stateUser = useSelector(state => state.user);
    const stateMarkers = useSelector(state => state.markers);
    const stateCoordinates = useSelector(state => state.userCoordinates);
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
                <Link key="home-user-link" href='/home-user' style={{ color: 'black' }}>
                    <li className={styles.navbarListItem}>
                        <span>
                            <BiMap />
                        </span>
                        <h3>Mapa</h3>
                    </li>
                </Link>
            )
        }

        if (currentURL !== '/analyze-image') {
            items.push(
                <Link key="analyze-image-link" href='/analyze-image' style={{ color: 'black' }}>
                    <li className={styles.navbarListItem}>
                        <span>
                            <BiRecycle />
                        </span>
                        <h3>Analisar reciclável</h3>
                    </li>
                </Link>
            )
        }

        return items;

    }

    function createPlacesList() {
        const places = [...stateMarkers];
        return places.map((item, index) =>
            <li>
                <h3>{item.title}</h3>
                <h5>{item.address}</h5>
                <h4>{calculateDistance(item)}</h4>
                {/* <Divider /> */}
            </li>
        )
    }

    function calculateDistance(place) {
        const userLocation = stateCoordinates;
        const placeLocation = place.position;

        // Função para converter graus para radianos
        const toRadians = angle => angle * (Math.PI / 180);

        // Função para calcular a distância usando a fórmula de Haversine
        const haversineDistance = (lat1, lon1, lat2, lon2) => {
            // Raio da Terra em metros
            const R = 6371e3; // metros

            // Converter coordenadas para radianos
            const phi1 = toRadians(lat1);
            const phi2 = toRadians(lat2);
            const deltaPhi = toRadians(lat2 - lat1);
            const deltaLambda = toRadians(lon2 - lon1);

            // Calcular a fórmula da Haversine
            const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            // Calcular a distância em metros
            const distance = R * c;

            return distance;
        };

        // Calcular a distância entre o usuário e o local
        const distanceInMeters = haversineDistance(
            userLocation.lat,
            userLocation.lng,
            placeLocation.lat,
            placeLocation.lng
        );

        let distance;
        if (distanceInMeters >= 1000) {
            // Se a distância for maior ou igual a 1000 metros, converter para quilômetros
            distance = (distanceInMeters / 1000).toFixed(2) + " km";
        } else {
            // Se a distância for menor que 1000 metros, manter em metros sem decimais
            distance = Math.floor(distanceInMeters) + " m";
        }

        return distance;
    }

    return (
        <motion.div
            initial='show'
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
                            <li className={styles.searchLocationField}>
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
                            </li>
                            <li variants={listVariants}>
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
                                                    <Button
                                                        onClick={async e => {
                                                            await router.push('/login');
                                                            Cookies.remove('user_token');
                                                            Cookies.remove('user_data');
                                                            dispatch(setUser(null));
                                                        }}
                                                        style={{ margin: 0 }}
                                                        icon={BiExit}>Sair</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </li>

                            <li>
                                {(showAlternativeNav && stateMarkers.length > 0) &&
                                    <div className={styles.placeListContainer}>
                                        <Divider />
                                        <h2 style={{
                                            textAlign: 'center',
                                            fontFamily: 'Inter, sans-serif',
                                            margin: 0
                                        }}>Locais próximos</h2>
                                        <Divider />
                                        <ul className={styles.placesList}>
                                            {createPlacesList()}
                                        </ul>
                                    </div>
                                }
                            </li>
                        </ul>
                    </Row>
                </Col>
            </Row>
        </motion.div>
    );
}

export default Navbar;