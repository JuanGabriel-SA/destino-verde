import { Col, Divider, Row } from 'antd'
import Button from '@/components/Button';
import styles from './home.module.css';
import { BiLogIn, BiSearch } from 'react-icons/bi';
import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';
export default function Home() {

  const animatedProps = useSpring({
    background: 'linear-gradient(180deg, #9CC3CC, #E5FFFF)',
    from: { background: 'linear-gradient(360deg, #6E8CBD, #94D5FF)' }, 
    config: { duration: 3000 },
    reverse: true,
    loop: { reverse: true }
  });

  return (
    <animated.main className={styles.mainHome} style={{  ...animatedProps}}>
      <Row justify={'center'}>
        <Col xs={{ span: 12 }}>
          <Row>
            <img className={styles.logo} src='/imgs/logo02.png' width={200} />
          </Row>
        </Col>
        <Col xs={{ span: 12 }}>
          <Row justify='end'>
            <Button icon={BiLogIn}>Entrar</Button>
          </Row>
        </Col>
        <Col xs={{ span: 24 }}>
          <Row justify={'center'}>
            <div className={styles.titleField}>
              <h1>
                Contribua para um planeta mais limpo.
              </h1>
              <p>Cadastre e visualize pontos de descarte
                <b> pertinhos de você.</b>
              </p>
            </div>
          </Row>
        </Col>
        <Col xs={{ span: 24 }}>
          <Row justify={'center'}>
            <div className={styles.inputField}>
              <input placeholder='Digite seu CEP...' className={styles.inputCep} />
              <input placeholder='Digite seu Número...' className={styles.inputNumber} />
              <button>
                Visualizar pontos
                <span>
                  <BiSearch />
                </span>
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </animated.main>
  )
}
