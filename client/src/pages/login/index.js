import { Col, Row, notification } from 'antd'
import styles from './login.module.css'
import Card from '@/components/Card'
import Input from '@/components/Input'
import { AiFillLock, AiOutlineLogin, AiOutlineRedEnvelope } from 'react-icons/ai';
import { MdOutlineMailOutline } from 'react-icons/md';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Alert from '@/components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { newUser } from '@/redux/actions/User.actions';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const state = useSelector(state => state.user);
  const dispatch = useDispatch();

  async function doLogin() {
    
    if (email !== '' && password !== '') {
      const user = await fetch(`http://localhost:4000/login/${email}/${password}`).then(res => res.json());

      //Usuário encontrado...
      if (user.length > 0) {
        router.push('/home-user');

        //Adiciona no estado local...
        dispatch(newUser({
          email: email,
          senha: password
        }));
      }

      //Usuário não encontrado...
      else {
        await setErrorMessage('Email ou senha incorreto(s).');
        setShowError(true);
      }
    } else {
      await setErrorMessage('Não deixe campos em branco.');
      setShowError(true);
    }

  }

  return (
    <main className={styles.main}>
      <Row justify={'center'}>
        <Col xs={{ span: 24 }}>
          <Row justify={'center'}>
            <img src='/imgs/logo.png' width={200} />
          </Row>
        </Col>
        <Col xs={{ span: 6 }}>
          <Row justify={'center'}>
            <Card className={styles.cardSection} title='Login' style={{ padding: 25 }}>
              <Row>
                <Col xs={{ span: 24 }}>
                  <Row>
                    <Col xs={{ span: 24 }}>
                      <Row justify={'center'}>
                        <h1>Login</h1>
                      </Row>
                    </Col>
                    <Col xs={{ span: 24 }}>
                      <Row justify={'center'}>
                        <Input onChange={e => setEmail(e.target.value)} icon={MdOutlineMailOutline} placeholder='Email' />
                      </Row>
                    </Col>
                    <Col xs={{ span: 24 }}>
                      <Row justify='center'>
                        <Input onChange={e => setPassword(e.target.value)} icon={AiFillLock} style={{ marginTop: 20 }} placeholder='Senha' />
                      </Row>
                    </Col>
                    <Alert trigger={setShowError} visible={showError} type='error'>
                      {errorMessage}
                    </Alert>
                    <Col xs={{ span: 24 }}>
                      <Row justify={'center'}>
                        <Button onClick={e => doLogin()} style={{ marginTop: 20 }} icon={AiOutlineLogin}>Login</Button>
                      </Row>
                    </Col>
                    <Col xs={{ span: 24 }}>
                      <Row justify={'center'}>
                        <p>Ainda não tem uma conta?
                          <Link href="/sign-up"> Cadastrar-se</Link>
                        </p>
                      </Row>
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
