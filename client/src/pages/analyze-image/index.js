import { useEffect, useState } from "react";
import styles from './analyzeImage.module.css';
import { Col, Divider, Image, Row, Space, Spin, Upload } from "antd";
import Button from "@/components/Button";
import { BiArrowToRight, BiSearch, BiUpload } from "react-icons/bi";
import Card from "@/components/Card";
import { RiCloseCircleFill } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { FaRecycle } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer";
import Navbar from "@/patterns/Navbar";
import * as cookie from 'cookie'
import { setUser } from "@/redux/actions/User.actions";

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

export default function AnalyzeImage({ user, token }) {
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState();
    const [isReciclabe, setIsReciclable] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const [reciclabeName, setReciclabeName] = useState('');
    const [showReciclabe, setShowReciclabe] = useState(false);
    const dispatch = useDispatch();
    const stateUser = useSelector(state => state.user);

    const modalVariants = {
        show: {
            display: 'flex',
            opacity: 1,
            transition: {
                ease: 'circOut',
                when: 'beforeChildren'
            }
        },
        hide: {
            opacity: 0,
            transition: {
                ease: 'circIn',
                when: 'afterChildren'
            },
            transitionEnd: {
                display: 'none'
            }
        }
    }
    useEffect(() => {
        if (stateUser == null)
            dispatch(setUser(JSON.parse(user)));
    }, [])

    const handleChange = async (e) => {
        const imageFile = e.file.originFileObj;
        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            setImage(imageFile);
            setImageUrl(imageUrl);
        }
    };

    async function verifyImage() {
        const formData = new FormData();
        formData.append('image', image);
        setShowLoading(true);

        try {
            const result = await fetch('https://destino-verde-f6428812864e.herokuapp.com/get-image-info/' + 4, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                method: 'POST',
                body: formData,
            });

            if (result.status === 200) {
                const data = await result.json();
                // Tratar o caso de sucesso
                console.log('Resposta bem-sucedida:', data);

                setShowReciclabe(true);
                setReciclabeName(data.imageContent);

                if (data.reciclabe)
                    setIsReciclable(true);
                else
                    setIsReciclable(false);
            } else {
                // Tratar o caso de erro no status da resposta
                console.log('Erro na solicitação:', result.status);
                // Defina um estado ou aja de acordo com o erro
            }
        } catch (error) {
            // Capturar exceções gerais, como falha na conexão ou outros erros
            console.error('Erro durante a solicitação:', error);
            // Defina um estado ou aja de acordo com o erro
        } finally {
            // Certifique-se de que setShowLoading seja definido como false, independentemente de sucesso ou erro.
            setShowLoading(false);
        }
    }

    return (
        <main className={styles.mainAnalyzeImage}>
            <motion.div
                initial='hide'
                variants={modalVariants}
                animate={showLoading ? 'show' : 'hide'}
                className={styles.modalLoading}>
                <div className={styles.modalLoadingContent}>
                    <Space size="middle">
                        <Spin size="large" />
                    </Space>
                </div>
            </motion.div>
            <Row>
                <Col
                    lg={{ span: 4 }} md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <div className={styles.sideNavbar}>
                        <Navbar />
                    </div>
                </Col>
                <Col lg={{ span: 20 }} md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Row justify={"center"} align="middle" className={styles.rowImageContent}>
                        <Col lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row justify={"center"}>
                                <Card className={styles.imageContainer}>
                                    <Row>
                                        <Col xs={{ span: 24 }}>
                                            <Row>
                                                <Col xs={{ span: 24 }}>
                                                    <Row justify={"center"}>
                                                        <h2>Analisar imagem</h2>
                                                    </Row>
                                                </Col>
                                                <Col xs={{ span: 24 }}>
                                                    <Row justify={"center"}>
                                                        <div className={styles.sendImageContent} style={{ marginBottom: 15 }}>
                                                            {image ?
                                                                <div className={styles.previewImageContent}>
                                                                    <Row>
                                                                        <Col xs={{ span: 24 }}>
                                                                            <Image
                                                                                preview={{
                                                                                    mask:
                                                                                        <div className={styles.previewImageText}>
                                                                                            <span>
                                                                                                <AiOutlineEye />
                                                                                            </span>
                                                                                            <p>Visualizar</p>
                                                                                        </div>
                                                                                }}
                                                                                width={200}
                                                                                src={imageUrl} />
                                                                        </Col>
                                                                        {showReciclabe &&
                                                                            <Col xs={{ span: 24 }}>
                                                                                <Row justify={"center"}>
                                                                                    <Col xs={{ span: 24 }}>
                                                                                        <h2 style={{ fontWeight: 700 }}>{reciclabeName}</h2>
                                                                                    </Col>
                                                                                    <Col xs={{ span: 24 }}>
                                                                                        <motion.span
                                                                                            style={{ color: isReciclabe ? 'green' : 'red' }}
                                                                                            initial={{ height: 0, opacity: 0 }}
                                                                                            animate={{ height: 'initial', opacity: 1 }}
                                                                                            className={styles.recycleIcon}>
                                                                                            <FaRecycle />
                                                                                        </motion.span>
                                                                                    </Col>
                                                                                    <Col xs={{ span: 24 }}>
                                                                                        <h3
                                                                                            style={{
                                                                                                fontFamily: 'Inter, sans-serif',
                                                                                                fontWeight: 500
                                                                                            }}>
                                                                                            {isReciclabe ?
                                                                                                'Objeto reciclável' :
                                                                                                'Objeto não reciclável'
                                                                                            }
                                                                                        </h3>
                                                                                    </Col>

                                                                                </Row>
                                                                            </Col>
                                                                        }
                                                                        <Col flex='auto'>
                                                                            <Row justify='end'>
                                                                                <Button
                                                                                    icon={RiCloseCircleFill}
                                                                                    style={{
                                                                                        backgroundColor: 'rgb(198, 67, 67)'
                                                                                    }}
                                                                                    onClick={e => {
                                                                                        setIsReciclable(null);
                                                                                        setImage(undefined);
                                                                                        setReciclabeName('');
                                                                                        setShowReciclabe(false);
                                                                                    }}>
                                                                                    Fechar
                                                                                </Button>
                                                                            </Row>
                                                                        </Col>
                                                                        <Col flex='auto'>
                                                                            <Row>
                                                                                <Button
                                                                                    icon={BiSearch}
                                                                                    style={{
                                                                                        backgroundColor: 'var(--cor-primaria-01)'
                                                                                    }}
                                                                                    onClick={e => verifyImage()}>
                                                                                    Analisar
                                                                                </Button>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                :
                                                                <Upload.Dragger
                                                                    accept="image/x-png,image/jpeg"
                                                                    onChange={e => handleChange(e)}>
                                                                    <p>
                                                                        <BiUpload />
                                                                    </p>
                                                                    <p>
                                                                        Carregue uma imagem do seu dispositivo.
                                                                    </p>
                                                                </Upload.Dragger>
                                                            }
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col xs={{ span: 24 }}>
                                                    <Row>
                                                        <div className={styles.infoContent}>
                                                            <Divider />
                                                            <p>Envie a imagem de um descartável para descobrir se o item pode ser
                                                                descartado ou não, e onde descartá-lo.
                                                            </p>
                                                            <Button icon={BiArrowToRight}>Saiba mais</Button>
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </main>
    );
}
