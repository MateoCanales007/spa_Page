import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import UserForm from './components/UserForm';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = '9a32c7211b134487b055c5b6c05179c3'; 
const REDIRECT_URI = 'http://localhost:5173';
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

  const handleSearch = () => {
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
    setShowForm(false); // Cierra el formulario después de enviar
  };

  return (
    <div className="bg-purple text-white min-vh-100">
      <header className="py-4 text-center">
        
        
        {/* Menú de navegación */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#"><h1>Kodigo Music</h1></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`nav-link ${showForm ? 'active' : ''}`}
                  >
                    Login
                  </button>
                </li>
                {/* Puedes agregar más elementos de menú aquí */}
              </ul>
            </div>
          </div>
        </nav>

        {/* Mostrar el formulario si showForm es verdadero */}
        {showForm && <UserForm onSubmit={handleUserSubmit} />}
        
        {/* Búsqueda de canciones */}
        {!token ? null : (
          <>
            <div className="mt-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar canciones..."
                className="form-control"
              />
              <button onClick={handleSearch} className="btn btn-primary mt-2">Buscar</button>
            </div>
            <div className="mt-4">
              {results.map(track => (
                <div key={track.id} className="card bg-light text-dark mb-2">
                  <div className="card-body">
                    <h5 className="card-title">{track.name}</h5>
                    <p className="card-text">{track.artists.map(artist => artist.name).join(', ')}</p>
                    {track.preview_url && (
                      <audio controls>
                        <source src={track.preview_url} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </header>

      <footer className="text-center py-4">
        <p>&copy; 2024 Kodigo Music. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;