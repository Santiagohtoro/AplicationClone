

import './App.css';
import axios from 'axios';
import { useState,useEffect } from 'react';
import YouTube from 'react-youtube';


function App() {

  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = '3987afdac6883bf0cbce92320ed8403f'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  //variables de estado
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({title: "Loading Movies"});
  const [playing, setPlaying] = useState(false);

  //función para realizar la petición por get a la API
  const fetchMovies = async(searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results},} = await axios.get(`${API_URL}/${type}/movie`,{
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results)
    setMovie(results[0])
  }

  useEffect(()=>{
    fetchMovies();
  },[]) //[]renderizamos solamente la primera vez.


  return (
    <div>
      {/* Contenedor que va a mostrar los poster de las peliculas actuales */}
      <div className='container mt-3'>
      <div className='row'>
        {movies.map((movie)=>(
          <div key={movie.id} className='col-md-4 mb-3'>
            <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="50%"></img>
            <h4 className='text-center'>{movie.title}</h4>
          </div>
        ))}

      </div>

      </div>
    </div>
  );
}

export default App;
