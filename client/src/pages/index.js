import { Col, Divider, Row } from 'antd'
import Card from '@/components/Card'
import Input from '@/components/Input'
import { AiFillLock, AiOutlineLogin, AiOutlineRedEnvelope } from 'react-icons/ai';
import { MdOutlineMailOutline } from 'react-icons/md';
import Button from '@/components/Button';
import Link from 'next/link';
import styles from './home.module.css';
export default function Home() {
  return (
    <main className={styles.mainHome}>
      <Row justify={'center'}>
        <Col xs={{ span: 8 }}>
          <Row justify='center'>
            <Card className={styles.cardHome}>
              <Row justify='center'>
                <Col xs={{ span: 24 }}>
                  <Row justify={'center'}>
                    <img style={{marginBottom: -40}} src='/imgs/logo.png' width={300} />
                  </Row>
                </Col>
                <Col xs={{ span: 24 }}>
                  <Row justify={'center'}>
                    <h2 style={{ fontWeight: 400, margin: 25, fontFamily: 'Montserrat, sans-serif' }}>
                      Auxilie no descarte de resíduos.
                    </h2>
                  </Row>
                  <Divider />
                </Col>
                <Col xs={{ span: 24 }}>
                  <Row justify={'center'}>
                    <Col flex='auto'>
                      <Link href='/login'>
                        <Button style={{ width: '90%' }} icon={AiOutlineLogin}>Entrar</Button>
                      </Link>
                    </Col>
                    <Col flex='auto'>
                      <Link href='/sign-up'>
                        <Button style={{ width: '90%' }} icon={AiOutlineLogin}>Cadastrar-se</Button>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Row>
        </Col>
      </Row>
    </main>
  )
}
