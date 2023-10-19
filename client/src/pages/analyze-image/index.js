import { useEffect, useState } from "react";
import styles from './analyzeImage.module.css';
import { Col, Divider, Image, Row, Space, Spin, Upload } from "antd";
import Button from "@/components/Button";
import { BiArrowToRight, BiSearch, BiUpload } from "react-icons/bi";
import Card from "@/components/Card";
import { RiCloseCircleFill, RiEye2Line, RiEyeFill } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { FaRecycle } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { motion } from "framer";
import Navbar from "@/patterns/Navbar";

export default function analyzeImage() {
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState();
    const [isReciclabe, setIsReciclable] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    const [reciclabeName, setReciclabeName] = useState('');
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
        const result = await fetch('http://localhost:4000/get-image-info/' + 4, {
            method: 'POST',
            body: formData
        }).then(res => {
            setShowLoading(false);
            return res.json();
        });

        console.log(result)
        if (result.imageContent !== null) {
            setReciclabeName(result.imageContent);
        } else
            setReciclabeName('');
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
                <div className={styles.sideNavbar}>
                    <Navbar />
                </div>
                <Col flex='auto'>
                    <div className={styles.content}>
                        <Row justify={"center"} align="middle" style={{ minHeight: "100vh", width: '100%' }}>
                            <Col xs={{ span: 8 }}>
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
                                                                            {reciclabeName !== '' &&
                                                                                <Col xs={{ span: 24 }}>
                                                                                    <Row justify={"center"}>
                                                                                        <Col xs={{span: 24}}>
                                                                                            <h2 style={{fontWeight: 700}}>{reciclabeName}</h2>
                                                                                        </Col>
                                                                                        <Col xs={{ span: 24 }}>
                                                                                            <motion.span
                                                                                                style={{ color: reciclabeName !== '' ? 'green' : 'red' }}
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
                                                                                                {reciclabeName !== '' ?
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
                                                                                            setImage(undefined)
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
                                                                    <Upload.Dragger onChange={e => handleChange(e)}>
                                                                        <p>
                                                                            <BiUpload />
                                                                        </p>
                                                                        <p>Clique ou arraste uma imagem para analisar.</p>
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
                    </div>
                </Col>
            </Row>

        </main>
    );
}
