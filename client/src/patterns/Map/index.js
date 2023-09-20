
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from './map.module.css';
import { motion } from 'framer';
import { useSelector } from 'react-redux';
import { Col, Divider, Row } from 'antd';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function Map({ style, ...props }) {

  const [currentLocation, setCurrentLocation] = useState({
    lat: -19.8340078,
    lng: -40.9489089,
  });

  const [mapZoom, setMapZoom] = useState(4);
  const state = useSelector(state => state);
  var currentInfowindow = null;

  useEffect(() => {
    getCurrentLocation();
  }, [])

  useEffect(() => {
    //Toda vez que um endereço válido ser inserido, mostra os locais de descarte próximos dele...
    if (state.address.logradouro !== undefined)
      showMarkers();
  }, [state.address])

  async function showMarkers() {
    let aux = { ...state.address };
    if (aux.logradouro !== undefined) {
      const formatedAddress = aux.logradouro + ',' + aux.numero + ',' + aux.bairro + ',' + aux.localidade + ',' + aux.uf;

      //Pesquisa as coordenadas do endereço digitado...
      const data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formatedAddress}&key=AIzaSyAyVtn3mP9mgyp1CJAnmdZuey-gR_jpnnM`)
        .then(res => res.json());
      const coordinates = data.results[0].geometry.location;
      const lat = coordinates.lat;
      const lng = coordinates.lng;
      const location = {
        lat: lat,
        lng: lng
      }
      setCurrentLocation(location);

      const map = new google.maps.Map(
        document.getElementById('map'), { center: location, zoom: 14 });

      const request = {
        location: location,
        radius: 500, // Raio de pesquisa...
        query: 'descarte de lixo', // Tipo de local...
      };

      var service = new google.maps.places.PlacesService(map);
      service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarkers(results[i], map);
          }

          //Deixa o mapa centralizado na localização fornecida...
          map.setCenter(location);
        }
      }, 1000)
    }
  };

  function createMarkers(place, map) {
    const infowindow = new google.maps.InfoWindow();
    //Cria um marcador para cada lugar próximo encontrado...
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      title: place.name
    });

    marker.addListener("click", () => {

      //Feche a InfoWindow atualmente aberta...
      if (currentInfowindow) {
        currentInfowindow.close();
      }

      //Cria um elemento DOM vazio para o InfoWindow...
      const infowindowComponent = document.createElement("div");
      infowindowComponent.className = 'view-place-component';

      //Renderize o conteúdo JSX...
      const root = ReactDOM.createRoot(infowindowComponent);
      root.render(InfoWindowContent(place));

      //Mostra o conteúdo no mapa...
      infowindow.setContent(infowindowComponent);
      infowindow.open(map, marker);
      currentInfowindow = infowindow;
      
    });
  }

  function InfoWindowContent(place) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          transition: {
            ease: 'circOut',
            duration: 0.4
        } 
      }}
        className={styles.viewPlaceContent}>
        <Row>
          <Col xs={{ span: 24 }}>
            <Row>
              <img src={place.photos && place.photos[0].getUrl()} alt={place.name} width="300" />
            </Row>
            <Divider />
          </Col>
          <Col xs={{ span: 24 }}>
            <h3>{place.name}</h3>
            <p>Endereço: {place.vicinity || place.formatted_address}</p>
            <p>Classificação: {place.rating || "N/A"}</p>
          </Col>
        </Row>
      </motion.div>
    );
  }

  function getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          let data = {
            lat: latitude,
            lng: longitude
          };

          setCurrentLocation(data);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocalização não é suportada neste navegador.');
    }
  }

  return (
    <div className={styles.mapComponent} style={{ ...style }}>
      <LoadScript googleMapsApiKey='AIzaSyAyVtn3mP9mgyp1CJAnmdZuey-gR_jpnnM' libraries={['places']}>
        <GoogleMap id='map' mapContainerStyle={containerStyle} center={currentLocation} zoom={mapZoom}>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
