import React from "react";
import NoticiaCard from "./components/NoticiaCard/NoticiaCard.jsx";
import { useEffect, useState } from "react";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const App = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [termino, setTermino] = useState("");

  function buscar(evento) {
    evento.preventDefault();
    setTermino(evento.currentTarget.elements.q.value.trim());
  }

  useEffect(() => {
    const controlador = new AbortController();
    const parametros = new URLSearchParams({ limit: 12, search: termino });

    setCargando(true);
    setError(null);

    fetch(`${VITE_API_URL}/articles/?${parametros}`, {
      signal: controlador.signal,
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}`);
        }
        return respuesta.json();
      })
      .then((datos) => {
        setNoticias(datos.results);
        setCargando(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setCargando(false);
        }
      });
    return () => controlador.abort();
  }, [termino]);
  return (
    <>
      <header className="contenedor-cabecera">
        Bitacora Espacial
        <nav aria-label="Principal">
          <ul>
            <li>
              <a href="">Noticias</a>
            </li>
            <li>
              <a href="">Blogs</a>
            </li>
            <li>
              <a href="">Acerca</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="contenedor">
        <h1>Noticias del espacio</h1>

        <form className="buscador" onSubmit={buscar}>
          <label htmlFor="busqueda">Buscar por tema</label>
          <input
            id="busqueda"
            name="q"
            type="search"
            placeholder="Ej.: Mars, Artemis, SpaceX"
          />
          <button type="submit">Buscar</button>
        </form>

        <section aria-labelledby="titulo-noticias">
          <h2 id="titulo-noticias">Últimas noticias</h2>
          {cargando && <p role="status">Cargando noticias…</p>}
          {!cargando && error && (
            <p role="alert">No se pudieron cargar las noticias: {error}</p>
          )}
          {!cargando && !error && noticias.length === 0 && (
            <p role="status">No hay noticias para "{termino}".</p>
          )}
          <div className="grid-noticias">
            {noticias.map((noticia) => (
              <NoticiaCard
                key={noticia.id}
                titulo={noticia.title}
                resumen={noticia.summary}
                imagen={noticia.image_url}
                fuente={noticia.news_site}
                fecha={noticia.published_at}
                enlace={noticia.url}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="contenedor">
        <p>
          <a href="https://spaceflightnewsapi.net">Spaceflight News API</a>
        </p>
      </footer>
    </>
  );
};

export default App;
