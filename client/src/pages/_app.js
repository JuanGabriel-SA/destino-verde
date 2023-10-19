import './globals.css'
import Head from "next/head";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Navbar from '@/patterns/Navbar';
import Modal from '@/components/Modal';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/imgs/favicon.ico" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;