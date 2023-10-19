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
      <Modal visible={showModalCookies} trigger={setShowModalCookies} className={styles.modalCookies}>
        <Row>
          <Col xs={{ span: 24 }}>
            <Row>
              <h1>Nós utilizamos cookies</h1>
            </Row>
          </Col>
          <Col xs={{ span: 24 }}>
            <Row>
              <p>
                Nós utilizamos <b>cookies</b> para tornar a sua experiência mais dinâmica.
              </p>
            </Row>
          </Col>
          <Col xs={{ span: 24 }}>
            <Row justify={'start'}>
              <Button
                icon={BiCheck}
                onClick={e => cookiesController(true)}
                style={{
                  fontSize: 20,
                  maxHeight: 70,
                  height: 70,
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  width: '60%'
                }}>
                Aceitar todos os cookies
              </Button>
              <Button
                icon={MdClose}
                onClick={e => cookiesController(false)}
                style={{
                  fontSize: 20,
                  maxHeight: 70,
                  height: 70,
                  borderRadius: 0,
                  marginLeft: 20,
                  marginRight: 0,
                  width: '36%'
                }}>
                Rejeitar
              </Button>
            </Row>
          </Col>
        </Row>
      </Modal>

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
              <ReactInputMask mask='99999-999' onChange={e => setCep(e.target.value)}>
                {(props) => <input
                  placeholder='Digite seu CEP...'
                  className={styles.inputCep} />}
              </ReactInputMask>
              <input
                value={addressNumber}
                onChange={e => {
                  let formatedValue = e.target.value.replace(/\D/g, '');
                  setAddressNumber(formatedValue);
                }}
                placeholder='Digite seu Número...'
                className={styles.inputNumber} />
              <button onClick={e => verifyLogin()}>
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
