import styles from './signUp.module.css';
import { Col, Row, message, notification } from 'antd'
import Card from '@/components/Card'
import Input from '@/components/Input'
import { AiFillLock, AiOutlineLogin, AiOutlineRedEnvelope } from 'react-icons/ai';
import { RiLoginCircleFill } from 'react-icons/ri';
import { MdOutlineMailOutline } from 'react-icons/md';
import Button from '@/components/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Alert from '@/components/Alert';
import { useRouter } from 'next/router';
import validator from 'validator';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function createUser() {
        if (await validateUser()) {
            const data = {
                email: email,
                senha: password
            }
            await fetch('http://localhost:4000/new-user', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(data)
            });

            notification.success({
                message: 'Conta criada com sucesso.',

            })
            router.push('/login');
        }
    }

    async function validateUser() {
        if (password !== confirm) {
            await setErrorMessage('As senhas devem ser iguais.');
            setShowError(true);
            return false;
        }
        if (password === '' || email === '') {
            await setErrorMessage('Não deixe campos em branco.');
            setShowError(true);
            return false;
        }

        if (!validator.isEmail(email)) {
            await setErrorMessage('Digite um email válido.');
            setShowError(true);
            return false;
        }

        const user = await fetch(`http://localhost:4000/verify-user/${email}`).then(res => res.json());

        if (user.length > 0) {
            await setErrorMessage('Já existe um usuário com esse email.');
            setShowError(true);
            return false;
        }

        if (!validatePassword()) {
            await setErrorMessage('A senha deve conter pelo menos 6 carácteres e uma letra em maiúsculo.');
            setShowError(true);
            return false;
        }

        return true;
    }

    function validatePassword() {
        if (password.length < 6)
            return false;
        if (!/[A-Z]/.test(password))
            return false;

        return true;
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
                                                <h1>Cadastrar-se</h1>
                                            </Row>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Row justify={'center'}>
                                                <Input type='email' onChange={e => setEmail(e.target.value)} icon={MdOutlineMailOutline} placeholder='Email' />
                                            </Row>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Row justify='center'>
                                                <Input type='password' onChange={e => setPassword(e.target.value)} icon={AiFillLock} style={{ marginTop: 20 }} placeholder='Senha' />
                                            </Row>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Row justify='center'>
                                                <Input type='password' onChange={e => setConfirm(e.target.value)} icon={AiFillLock} style={{ marginTop: 20 }} placeholder='Confirmar senha' />
                                            </Row>
                                        </Col>

                                        <Alert trigger={setShowError} visible={showError} type='error'>
                                            {errorMessage}
                                        </Alert>

                                        <Col xs={{ span: 24 }}>
                                            <Row justify={'center'}>
                                                <Button onClick={() => createUser()} style={{ marginTop: 20 }} icon={RiLoginCircleFill}>Cadastrar-se</Button>
                                            </Row>
                                        </Col>
                                        <Col xs={{ span: 24 }}>
                                            <Row justify={'center'}>
                                                <p>Já tem uma conta?
                                                    <Link href="/login"> Entrar</Link>
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
    );
}
