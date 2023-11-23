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
import cookie from 'js-cookie';
import validator from 'validator';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  async function doLogin() {

    if (await validateLogin()) {
      const user = await fetch(`https://destino-verde-f6428812864e.herokuapp.com/login/${email}/${password}`).then(res => res.json());
   
      //Usuário encontrado...
      if (user.length > 0) {
        //Adiciona no estado local...
        dispatch(newUser({
          email: email,
          senha: password
        }));

        const token = await fetch(`https://destino-verde-f6428812864e.herokuapp.com/get-token/${user[0].id}`).then(res => res.json());
        
        cookie.set('user_token', token);
        cookie.set('user_data', JSON.stringify(user[0]));

        router.push('/home-user');
      }
      //Usuário não encontrado...
      else {
        setShowError(true);
      }
    }
  }

  function validateLogin() {
    if (email === "" || password === "") {
      setShowError(true);
      return false;
    } else
      return (validator.isEmail(email));
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
                        <Input
                          type='password'
                          onKeyPress={e => {
                            if (e.key === 'Enter')
                              doLogin();
                          }}
                          onChange={e => setPassword(e.target.value)}
                          icon={AiFillLock}
                          style={{ marginTop: 20 }}
                          placeholder='Senha' />
                      </Row>
                    </Col>
                    <Alert trigger={setShowError} visible={showError} type='error'>
                      Email ou senha incorreto(s).
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
