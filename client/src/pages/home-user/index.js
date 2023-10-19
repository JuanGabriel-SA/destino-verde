import Navbar from '@/patterns/Navbar';
import styles from './homeUser.module.css';
import Map from '@/patterns/Map';
import { Col, Row } from 'antd';
import { motion } from 'framer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import * as cookie from 'cookie'
export async function getServerSideProps(ctx) {
    if (ctx.req.headers.cookie !== undefined) {
        const { user_token } = cookie.parse(ctx.req.headers.cookie);
        return {
            props: {
                token: user_token
            }
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {}
        }
    }
}

export default function homeUser({ token }) {
    useEffect(() => {
        console.log(token)
    }, [])
    const state = useSelector(state => state);
    return (
        <main className={styles.home}>
            <Row>
                <div className={styles.sideNavbar}>
                    <Navbar />
                </div>
                <Col flex='auto'>
                    <div className={styles.mapContent}>
                        <Map />
                    </div>
                </Col>
            </Row>
        </main>
    );
}
