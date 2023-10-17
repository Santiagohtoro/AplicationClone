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


    if(results.length){
      await fetchMovie (results[0].id)
    }
  }


  //Funcion para seleccionar y abrir el banner
  const selectMovie= async(movie)=>{
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }


  useEffect(()=>{
    fetchMovies();
  },[]) //[]renderizamos solamente la primera vez.


  const searchMovies =(e) =>{
    e.preventDefault();
    fetchMovies(searchKey)
  }


  //Funcion para la peticion de un solo objeto y mostrar en reproductor de video
  const fetchMovie= async (id) => {
    const {data} = await axios.get (`${API_URL}/movie/${id}`,
    {
      params:{
        api_key:API_KEY,
        append_to_reponse:"videos"
      }
    })


    if (data.video && data.video.results){
      const trailer=data.video.results.find(
        (vid)=>vid.name ==="Official Trailer"
      );
      setTrailer(trailer? trailer:data.video.results[0])
    }
    setMovie(data)
 
  }


  return (
    <div>
    <h2 className='text-center mt-5 mb-5'>Trailer Movies </h2>
    {/* {Buscador} */}
    <form className='container mb-4' onSubmit={searchMovies}>
      <input type='text' placeholder='search' onChange={(e)=>setSearchKey(e.target.value)}></input>
      <button className='btn btn-primary'>Search</button>
    </form>
    <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>


      {/* Contenedor que va a mostrar los poster de las peliculas actuales */}
      <div className='container mt-3'>
      <div className='row'>
        {movies.map((movie)=>(
          <div key={movie.id} className='col-md-4 mb-3' onClick={()=>setPlaying(true)}>
            <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%"></img>
            <h4 className='text-center'>{movie.title}</h4>
          </div>
        ))}


      </div>


      </div>


     
    </div>
  );
}


export default App;
