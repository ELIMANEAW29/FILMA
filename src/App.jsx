import { useEffect, useState } from 'react';
import { ArrowLeft, Clapperboard, Film, Plus, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

const starterFilms = [
  {
    id: 'film-1',
    title: 'Past Lives',
    description: 'Deux amis d’enfance se retrouvent après vingt ans et interrogent les vies qu’ils auraient pu mener.',
    trailerUrl: 'https://www.youtube.com/embed/kA244xewjcI',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    category: 'Drame',
    year: '2023',
  },
  {
    id: 'film-2',
    title: 'La La Land',
    description: 'À Los Angeles, une actrice et un musicien tentent de faire exister leurs rêves sans se perdre.',
    trailerUrl: 'https://www.youtube.com/embed/0pdqf4P9MB8',
    posterUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
    rating: 4.6,
    category: 'Musical',
    year: '2016',
  },
  {
    id: 'film-3',
    title: 'Interstellar',
    description: 'Un pilote quitte une Terre à bout de souffle pour chercher un nouvel avenir aux confins du cosmos.',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    posterUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    category: 'Science-fiction',
    year: '2014',
  },
  {
    id: 'film-4',
    title: 'Portrait de la jeune fille en feu',
    description: 'Sur une île bretonne, une peintre et son modèle se découvrent dans le silence et la lumière.',
    trailerUrl: 'https://www.youtube.com/embed/R-fQPTwma9o',
    posterUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85',
    rating: 4.7,
    category: 'Romance',
    year: '2019',
  },
  {
    id: 'film-5',
    title: 'The Grand Budapest Hotel',
    description: 'Un concierge légendaire et son jeune protégé traversent une Europe fantasque et mouvementée.',
    trailerUrl: 'https://www.youtube.com/embed/1Fg5iWmQjwk',
    posterUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85',
    rating: 4.4,
    category: 'Comédie',
    year: '2014',
  },
  {
    id: 'film-6',
    title: 'Dune : Deuxième partie',
    description: 'Paul Atréides rejoint les Fremen et choisit le destin qui l’attend sur la planète Arrakis.',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=85',
    rating: 4.5,
    category: 'Aventure',
    year: '2024',
  },
];

function readSavedFilms() {
  try {
    const savedFilms = window.localStorage.getItem('filma-films');
    if (!savedFilms) return starterFilms;

    return JSON.parse(savedFilms).map((film) => {
      const starterFilm = starterFilms.find((item) => item.id === film.id);
      return { ...film, trailerUrl: film.trailerUrl || starterFilm?.trailerUrl || '' };
    });
  } catch {
    return starterFilms;
  }
}

function MovieCard({ film }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link className="movie-card" to={`/films/${film.id}`} aria-label={`Voir ${film.title}, sa description et sa bande-annonce`}>
      <div className="poster-frame">
        {!imageFailed ? (
          <img
            className="poster-image"
            src={film.posterUrl}
            alt={`Affiche de ${film.title}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="poster-fallback" aria-label={`Affiche indisponible pour ${film.title}`}>
            <Clapperboard size={32} strokeWidth={1.3} />
            <span>{film.title}</span>
          </div>
        )}
        <span className="poster-year">{film.year || 'À découvrir'}</span>
      </div>
      <div className="movie-info">
        <div className="movie-heading">
          <div>
            <span className="movie-category">{film.category || 'Film'}</span>
            <h3>{film.title}</h3>
          </div>
          <span className="rating" aria-label={`Note : ${Number(film.rating).toFixed(1)} sur 5`}>
            <Star size={14} fill="currentColor" strokeWidth={1.5} />
            {Number(film.rating).toFixed(1)}
          </span>
        </div>
        <p>{film.description}</p>
      </div>
    </Link>
  );
}

function MovieFilters({ search, onSearchChange, minimumRating, onMinimumRatingChange, resultCount }) {
  return (
    <div className="filter-bar">
      <label className="search-control">
        <Search size={17} />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Rechercher un film…" aria-label="Filtrer par titre" />
        {search && <button type="button" className="clear-search" aria-label="Effacer la recherche" onClick={() => onSearchChange('')}><X size={15} /></button>}
      </label>
      <div className="rating-control">
        <SlidersHorizontal size={16} />
        <label htmlFor="minimum-rating">Note min.</label>
        <select id="minimum-rating" value={minimumRating} onChange={(event) => onMinimumRatingChange(Number(event.target.value))}>
          <option value="0">Toutes</option>
          <option value="3">3,0 +</option>
          <option value="4">4,0 +</option>
          <option value="4.5">4,5 +</option>
        </select>
      </div>
      <span className="result-count">{resultCount} résultat{resultCount > 1 ? 's' : ''}</span>
    </div>
  );
}

function MovieList({ films }) {
  if (!films.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><Film size={24} /></span>
        <h3>Aucun film trouvé</h3>
        <p>Essayez un autre titre ou ajustez la note minimale.</p>
      </div>
    );
  }

  return <div className="movie-grid">{films.map((film) => <MovieCard key={film.id} film={film} />)}</div>;
}

function AddFilmDialog({ onClose, onAdd }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAdd({
      id: crypto.randomUUID(),
      title: formData.get('title').trim(),
      description: formData.get('description').trim(),
      trailerUrl: formData.get('trailerUrl').trim(),
      posterUrl: formData.get('posterUrl').trim(),
      rating: Number(formData.get('rating')),
      category: formData.get('category').trim() || 'Film',
      year: formData.get('year').trim(),
    });
    onClose();
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="add-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading">
          <div>
            <span className="eyebrow">Votre collection</span>
            <h2 id="dialog-title">Ajouter un film</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer">
            <X size={19} />
          </button>
        </div>
        <form className="film-form" onSubmit={handleSubmit}>
          <label>
            Titre
            <input name="title" placeholder="Ex. Le Voyage de Chihiro" required maxLength="90" autoFocus />
          </label>
          <label>
            Description
            <textarea name="description" placeholder="Quelques mots sur le film…" required rows="3" maxLength="240" />
          </label>
          <label>
            URL de la bande-annonce intégrée
            <input name="trailerUrl" type="url" placeholder="https://www.youtube.com/embed/…" required />
          </label>
          <label>
            URL de l’affiche
            <input name="posterUrl" type="url" placeholder="https://…" required />
          </label>
          <div className="form-row">
            <label>
              Note sur 5
              <input name="rating" type="number" min="0" max="5" step="0.1" defaultValue="4.0" required />
            </label>
            <label>
              Année
              <input name="year" type="number" min="1888" max="2100" placeholder="2025" />
            </label>
          </div>
          <label>
            Genre
            <input name="category" placeholder="Ex. Drame, aventure…" maxLength="30" />
          </label>
          <div className="dialog-actions">
            <button className="text-button" type="button" onClick={onClose}>Annuler</button>
            <button className="primary-button" type="submit"><Plus size={17} /> Ajouter à ma liste</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FilmDetail({ films }) {
  const { filmId } = useParams();
  const film = films.find((item) => item.id === filmId);

  if (!film) {
    return (
      <section className="detail-not-found">
        <span className="eyebrow">Collection FILMA</span>
        <h1>Ce film est introuvable.</h1>
        <Link className="back-link" to="/">Retour à l’accueil</Link>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/"><ArrowLeft size={15} aria-hidden="true" /> Retour à l’accueil</Link>
      <div className="detail-overview">
        <div className="detail-poster">
          <img src={film.posterUrl} alt={`Affiche de ${film.title}`} />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{film.category || 'Film'} · {film.year || 'Année inconnue'}</span>
          <h1>{film.title}</h1>
          <p>{film.description}</p>
          <span className="detail-rating"><Star size={16} fill="currentColor" /> {Number(film.rating).toFixed(1)} / 5</span>
        </div>
      </div>
      <div className="trailer-section">
        <div className="trailer-heading">
          <span className="section-index">À VOIR</span>
          <h2>La bande-annonce</h2>
        </div>
        {film.trailerUrl ? (
          <div className="trailer-frame">
            <iframe
              src={film.trailerUrl}
              title={`Bande-annonce de ${film.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="trailer-unavailable">Aucune bande-annonce n’est renseignée pour ce film.</p>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [films, setFilms] = useState(readSavedFilms);
  const [search, setSearch] = useState('');
  const [minimumRating, setMinimumRating] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('filma-films', JSON.stringify(films));
  }, [films]);

  const visibleFilms = films.filter((film) =>
    film.title.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr')) &&
    Number(film.rating) >= minimumRating,
  );

  function addFilm(film) {
    setFilms((currentFilms) => [film, ...currentFilms]);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="wordmark" to="/" aria-label="FILMA, accueil"><span className="brand-mark"><Film size={18} /></span>filma<span className="wordmark-period">.</span></Link>
        <div className="topbar-right">
          <span className="collection-label"><span className="status-dot" /> MA COLLECTION</span>
          <button className="primary-button top-add" onClick={() => setIsDialogOpen(true)}>
            <Plus size={17} /><span>Ajouter un film</span>
          </button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={(
          <>
      <section className="intro" id="accueil">
        <div className="intro-copy">
          <span className="eyebrow">Le cinéma, à votre façon</span>
          <h1>Les histoires<br />qu’on <em>garde.</em></h1>
          <p>Une place pour les films qui restent avec vous,<br className="desktop-break" /> longtemps après le générique.</p>
        </div>
        <div className="intro-art" aria-hidden="true">
          <div className="art-frame art-frame-back"><span>FILM<br />NO. 01</span></div>
          <div className="art-frame art-frame-front"><div className="art-sun" /><div className="art-horizon" /><span className="art-caption">UNE SALLE<br />À SOI</span></div>
          <span className="art-star">✳</span>
          <span className="art-orbit" />
        </div>
      </section>

      <section className="collection-section" aria-labelledby="collection-title">
        <div className="section-heading">
          <div className="section-title-wrap">
            <span className="section-index">01 / COLLECTION</span>
            <h2 id="collection-title">À l’affiche <span>{films.length.toString().padStart(2, '0')}</span></h2>
          </div>
          <button className="small-add" onClick={() => setIsDialogOpen(true)}><Plus size={16} /> Nouveau film</button>
        </div>

        <MovieFilters
          search={search}
          onSearchChange={setSearch}
          minimumRating={minimumRating}
          onMinimumRatingChange={setMinimumRating}
          resultCount={visibleFilms.length}
        />

        <MovieList films={visibleFilms} />
      </section>
          </>
        )} />
        <Route path="/films/:filmId" element={<FilmDetail films={films} />} />
        <Route path="*" element={<FilmDetail films={[]} />} />
      </Routes>

      <footer className="footer"><span>FILMA <span className="wordmark-period">.</span></span><span>FAIT POUR LES BELLES HISTOIRES</span><span>© 2025</span></footer>
      {isDialogOpen && <AddFilmDialog onClose={() => setIsDialogOpen(false)} onAdd={addFilm} />}
    </main>
  );
}