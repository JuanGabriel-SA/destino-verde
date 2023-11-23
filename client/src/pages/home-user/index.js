import Navbar from '@/patterns/Navbar';
import styles from './homeUser.module.css';
import Map from '@/patterns/Map';
import { Col, Divider, Row } from 'antd';
import { motion } from 'framer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import * as cookie from 'cookie'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { setUser } from '@/redux/actions/User.actions';

export async function getServerSideProps(ctx) {
    if (ctx.req.headers.cookie !== undefined) {
        const { user_token } = cookie.parse(ctx.req.headers.cookie);
        const { user_data } = cookie.parse(ctx.req.headers.cookie);
        return {
            props: {
                token: user_token,
                user: user_data
            }
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {}
        }
    }
}

export default function HomeUser({ user, token }) {
    const stateCoordinates = useSelector(state => state.userCoordinates);
    const stateMarkers = useSelector(state => state.markers);
    const stateUser = useSelector(state => state.user)
    const [showPlaceList, setShowPlaceList] = useState(false);
    const [screenWidth, setScreenWidth] = useState(undefined);
    const [collapseList, setCollapseList] = useState(false);
    const dispatch = useDispatch();

    const listVariants = {
        show: {
            x: 0,
            transition: {
                duration: 0.4,
                ease: 'circOut',
            }
        },
        hide: {
            x: 300,
            transition: {
                duration: 0.4,
                ease: 'circIn',
            }
        }
    }

    const buttonVariants = {
        show: {
            x: -20,
            transition: {
                duration: 0.4,
                ease: 'circOut',
            }
        },
        hide: {
            x: -30,
            transition: {
                duration: 0.36,
                ease: 'circIn',
            }
        }
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

    function createPlacesList() {
        const places = [...stateMarkers];
        return places.map((item, index) =>
            <li style={{ marginBottom: index == 19 && 130 }}>
                <h3>{item.title}</h3>
                <h5>{item.address}</h5>
                <h4>{calculateDistance(item)}</h4>
            </li>
        )
    }

    function togglePlaceList() {
        setShowPlaceList(!showPlaceList);

    }

    function attScreen() {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        //Assim que o usuário buscar um cep, abre a lista...
        if (stateMarkers.length > 0)
            setShowPlaceList(true);
    }, [stateMarkers])

    useEffect(() => {
        if (stateUser == null)
            dispatch(setUser(JSON.parse(user)));
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Apenas no lado do cliente (navegador), acesse window.innerWidth
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', attScreen);
        return () => {
            window.removeEventListener('resize', attScreen);
        };
    }, []);

    useEffect(() => {
        if (screenWidth <= 768)
            setCollapseList(true);
        else
            setCollapseList(false);
    }, [screenWidth])

    return (
        <main className={styles.home}>
            {(stateMarkers.length > 0 && !collapseList) &&
                <motion.div
                    initial='hide'
                    variants={listVariants}
                    animate={showPlaceList ? 'show' : 'hide'}
                    className={styles.placeListContainer}>
                    <motion.span
                        initial='hide'
                        animate={showPlaceList ? 'show' : 'hide'}
                        variants={buttonVariants}
                        onClick={e => togglePlaceList()}>
                        {!showPlaceList ?
                            <BiChevronLeft />
                            :
                            <BiChevronRight />
                        }
                    </motion.span>
                    <h2 style={{
                        textAlign: 'center',
                        fontFamily: 'Inter, sans-serif',
                        marginTop: 20
                    }}>Locais próximos</h2>
                    <Divider />
                    <motion.ul
                        style={{
                            overflowY: showPlaceList ? 'auto' : 'hidden',
                        }}
                        className={styles.placesList}>
                        {createPlacesList()}
                    </motion.ul>
                </motion.div>
            }
            <Row>
                <Col
                    lg={{ span: 4 }} md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}
                    className={styles.colNavbar}>
                    <div className={styles.sideNavbar}>
                        <Navbar />
                    </div>
                </Col>
                <Col lg={{ span: 20 }} md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <div className={styles.mapContent}>
                        <Map />
                    </div>
                </Col>
            </Row>
        </main>
    );
}
