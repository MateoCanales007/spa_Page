import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import UserForm from './components/UserForm';
import { Container, Navbar, Nav, Form, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Music } from 'lucide-react';

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = '9a32c7211b134487b055c5b6c05179c3';
const REDIRECT_URI = 'http://localhost:5174'; // Actualizado a 5174
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function App() {
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.split('&')[0].split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
    spotifyApi.setAccessToken(token);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      spotifyApi.searchTracks(query).then(response => {
        setResults(response.tracks.items);
      }).catch(error => {
        console.error('Error al buscar canciones:', error);
      });
    }
  };

  const handleUserSubmit = (data) => {
    console.log('Datos del usuario:', data);
    setShowForm(false);
  };

  const login = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-light">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <Music size={24} className="me-2" />
            <span className="h4 mb-0">Kodigo Music</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!token ? (
                <Nav.Link onClick={login}>Login</Nav.Link>
              ) : (
                <Nav.Link onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cerrar' : 'Perfil'}
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 py-4">
        {showForm && (
          <Card className="mb-4 bg-secondary text-light">
            <Card.Body>
              <UserForm onSubmit={handleUserSubmit} />
            </Card.Body>
          </Card>
        )}

        {token && (
          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="g-2">
              <Col xs={12} md={8} lg={10}>
                <Form.Control
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar canciones..."
                  className="bg-dark text-light border-secondary"
                />
              </Col>
              <Col xs={12} md={4} lg={2}>
                <Button variant="primary" type="submit" className="w-100">Buscar</Button>
              </Col>
            </Row>
          </Form>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {results.map(track => (
            <Col key={track.id}>
              <Card className="h-100 bg-secondary text-light">
                <Card.Img variant="top" src={track.album.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Card.Text>{track.artists.map(artist => artist.name).join(', ')}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-dark border-0">
                  {track.preview_url && (
                    <audio controls className="w-100">
                      <source src={track.preview_url} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <footer className="bg-dark text-light text-center py-3 mt-auto border-top border-light">
        <p className="mb-0">&copy; 2024 Kodigo Music. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;