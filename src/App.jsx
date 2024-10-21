import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Music } from 'lucide-react';
import UserForm from './components/UserForm';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

/* Colores pagina */
const colors = {
  primaryColor: '#1f1955',
  secondaryColor: '#e1462d',
  accentColor: '#8e10e9',
  darkColor: '#4a0e4e',
  newColor: '#00bc97',
  white: '#ffffff'
};

/* Estas son las llaves para conectarnos con Spotify */
const CLIENT_ID = '9a32c7211b134487b055c5b6c05179c3'; 
const REDIRECT_URI = 'http://localhost:5175'; 
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function App() {
  /* Estas son las cosas que nuestra app necesita recordar */
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  /* Esto se hace cuando la app se abre por primera vez */
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
    spotifyApi.setAccessToken(token);
  }, []);

  /* Esta función nos ayuda a entrar a Spotify */
  const login = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  };

  /* Esta función busca canciones cuando le decimos qué queremos escuchar */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!isRegistered) {
      setShowAlert(true);
      return;
    }
    if (!token) {
      login();
      return;
    }
    if (query) {
      try {
        const data = await spotifyApi.searchTracks(query);
        setResults(data.tracks.items);
      } catch (error) {
        console.error('Error al buscar canciones:', error);
      }
    }
  };

  /* Esta función guarda la información del usuario cuando se registra */
  const handleUserSubmit = (data) => {
    console.log('Datos del usuario:', data);
    setUserProfile(data);
    setIsRegistered(true);
    setShowForm(false);
  };

  /* Esta función nos ayuda a ver o esconder el perfil del usuario */
  const toggleProfileView = () => {
    if (isRegistered) {
      setShowProfile(!showProfile);
    } else {
      setShowForm(!showForm);
    }
  };

  /* Comienzo hacer el diseño */
  return (
    <div style={{ backgroundColor: colors.primaryColor, color: colors.white, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Esta es la barra de arriba de nuestra app */}
      <Navbar expand="lg" style={{ backgroundColor: colors.secondaryColor }}>
        <Container>
          <Navbar.Brand href="#home" style={{ color: colors.white }}>
            <Music size={24} style={{ marginRight: '0.5rem' }} />
            <span className="h4 mb-0">Kodigo Music</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={toggleProfileView} style={{ color: colors.white }}>
                {isRegistered ? 'Ver Perfil' : 'Crear Perfil'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal de nuestra app */}
      <Container className="flex-grow-1 py-4">
        {/* Este es el formulario para registrarse */}
        {showForm && !isRegistered && (
          <Card style={{ backgroundColor: colors.darkColor, color: colors.white, marginBottom: '1rem' }}>
            <Card.Body>
              <UserForm onSubmit={handleUserSubmit} />
            </Card.Body>
          </Card>
        )}

        {/* Esto muestra la información del perfil del usuario */}
        {showProfile && isRegistered && (
          <Card style={{ backgroundColor: colors.newColor, color: colors.white, marginBottom: '1rem' }}>
            <Card.Body>
              <h3>Perfil de Usuario</h3>
              <p><strong>Nombre:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Género musical favorito:</strong> {userProfile.favoriteGenre}</p>
            </Card.Body>
          </Card>
        )}

        {/* Este es un mensaje que aparece si intentas buscar sin registrarte */}
        {showAlert && (
          <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
            Por favor, regístrate antes de buscar música.
          </Alert>
        )}

        {/* El buscador de canciones */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="g-2">
            <Col xs={12} md={8} lg={10}>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar canciones..."
                style={{ backgroundColor: colors.accentColor, color: colors.white }}
              />
            </Col>
            <Col xs={12} md={4} lg={2}>
              <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: colors.newColor }}>Buscar</Button>
            </Col>
          </Row>
        </Form>

        {/* Aquí mostramos las canciones que encontramos */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {results.map(track => (
            <Col key={track.id}>
              <Card style={{ backgroundColor: colors.darkColor, color: colors.white }}>
                <Card.Img variant="top" src={track.album.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Card.Text>{track.artists.map(artist => artist.name).join(', ')}</Card.Text>
                </Card.Body>
                {track.preview_url && (
                  <Card.Footer>
                    <audio controls className="w-100">
                      <source src={track.preview_url} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <footer style={{ backgroundColor: colors.secondaryColor, color: colors.white, textAlign: 'center', padding: '1rem 0', marginTop: 'auto' }}>
        <p className="mb-0">&copy; 2024 Kodigo Music. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;