import Navbar from '@/patterns/Navbar';
import styles from './homeUser.module.css';
import Map from '@/patterns/Map';
import { Col, Row } from 'antd';
import { motion } from 'framer';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
export default function homeUser() {

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
