import { Col, Divider, Row, notification } from 'antd'
import Button from '@/components/Button';
import styles from './home.module.css';
import { BiCheck, BiLogIn, BiSearch } from 'react-icons/bi';
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Modal from '@/components/Modal';
import { MdClose } from 'react-icons/md';
import { acceptCookies } from '@/redux/actions/Cookies.actions';
import { setAddress } from '@/redux/actions/Addres.actions';
export default function Home() {

  const [cep, setCep] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [showModalCookies, setShowModalCookies] = useState(false);
  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user);
  const router = useRouter();

  const animatedProps = useSpring({
    background: 'linear-gradient(45deg, #9CC3CC, #E5FFFF)',
    from: { background: 'linear-gradient(45deg, #FFFFFF, #FFFFFF)' },
    config: { duration: 3000 },
    reverse: true,
    loop: { reverse: true }
  });

  useEffect(() => {
    let aux = localStorage.getItem('allow_cookies');

    if (aux == null) {
      setTimeout(() => {
        setShowModalCookies(true);
      }, 1000)
    }
  }, [])

  async function verifyLogin() {
    await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.erro) {
          let aux = { ...data, numero: addressNumber }
          dispatch(setAddress(aux));
          if (stateUser == null)
            router.push('/login');
          else
            router.push('/home-user');
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
  }

  function cookiesController(allow) {
    dispatch(acceptCookies(allow));
    localStorage.setItem('allow_cookies', true);
    setShowModalCookies(false);
  }

  return (
    <animated.main className={styles.mainHome} style={{ ...animatedProps }}>
      <Row justify={'center'}>
        <Col xs={{ span: 12 }}>
          <Row>
            <img className={styles.logo} src='/imgs/logo02.png' width={200} />
          </Row>
        </Col>
        <Col xs={{ span: 12 }}>
          <Row justify='end'>
            <Link href='/login'>
              <Button icon={BiLogIn}>Entrar</Button>
            </Link>
          </Row>
        </Col>
        <Col lg={{ span: 14 }} xs={{ span: 24 }}>
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
        <Col lg={{ span: 14 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <Row justify={'center'} className={styles.inputField}>
            <Col lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
              <Row justify={'start'}>
                <ReactInputMask mask='99999-999' onChange={e => setCep(e.target.value)}>
                  {(props) => <input
                    placeholder='Digite seu CEP...'
                    className={styles.inputCep} />}
                </ReactInputMask>
              </Row>
            </Col>
            <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
              <Row justify={'start'}>
                <Col flex={'auto'}>
                  <input
                    style={{ width: '88%' }}
                    value={addressNumber}
                    onChange={e => {
                      let formatedValue = e.target.value.replace(/\D/g, '');
                      setAddressNumber(formatedValue);
                    }}
                    onKeyDown={e => {
                      if (e.code == 'Enter')
                        verifyLogin()
                    }}
                    placeholder='Digite seu Número...'
                    className={styles.inputNumber} />
                </Col>
                <Col xs={{ span: 9 }}>
                  <Row justify={'start'}>
                    <button onClick={e => verifyLogin()}>
                      <label>Visualizar pontos</label>
                      <span>
                        <BiSearch />
                      </span>
                    </button>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </animated.main>
  )
}
