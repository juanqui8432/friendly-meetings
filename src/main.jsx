import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const initialMeetings = [
  { id: 1, date: "Hoy", time: "09:30", title: "Revisión de producto", people: ["AM", "LC", "+2"], duration: "45 min", location: "Sala Laurel", type: "Equipo", accent: "coral", done: false },
  { id: 2, date: "Hoy", time: "11:00", title: "Café con Martina", people: ["MA"], duration: "30 min", location: "Café Nube", type: "Personal", accent: "lilac", done: false },
  { id: 3, date: "Hoy", time: "14:15", title: "Demo: nueva navegación", people: ["AM", "JP", "SR"], duration: "30 min", location: "Google Meet", type: "Demo", accent: "lime", done: false },
  { id: 4, date: "Mañana", time: "10:00", title: "Planificación semanal", people: ["AM", "LC", "JP", "+4"], duration: "60 min", location: "Sala Olmo", type: "Equipo", accent: "blue", done: false },
  { id: 5, date: "Mañana", time: "16:30", title: "Cierre con diseño", people: ["SR", "MA"], duration: "45 min", location: "Google Meet", type: "Revisión", accent: "coral", done: false },
];

const navItems = [
  { label: "Agenda", icon: "calendar" },
  { label: "Personas", icon: "people" },
  { label: "Notas", icon: "note" },
];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    calendar: <><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M16 2v4M8 2v4M3 9h18" /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></>,
    people: <><path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H7.4A3.4 3.4 0 0 0 4 18.4V20" /><circle cx="10" cy="7" r="3" /><path d="M17 11a3 3 0 1 0-1.1-5.8M20 20v-1.6a3.4 3.4 0 0 0-2.5-3.3" /></>,
    note: <><path d="M5 3h11l3 3v15H5z" /><path d="M15 3v4h4M8 12h8M8 16h5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
    pin: <><path d="m15 4 5 5-2.5 2.5.5 5.5-5.5-.5L10 19l-5-5 2.5-2.5L7 6l5.5.5z" /><path d="m9 15 6-6" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function AvatarStack({ people }) {
  return <div className="avatar-stack" aria-label={`${people.length} participantes`}>
    {people.map((person, index) => <span className={`avatar avatar-${index % 4}`} key={`${person}-${index}`}>{person}</span>)}
  </div>;
}

function MeetingCard({ meeting, onToggle }) {
  return <article className={`meeting-card accent-${meeting.accent} ${meeting.done ? "is-done" : ""}`}>
    <div className="meeting-time"><span>{meeting.time}</span><small>{meeting.duration}</small></div>
    <div className="meeting-line" aria-hidden="true"><span className="meeting-dot" /></div>
    <div className="meeting-body">
      <div className="meeting-heading">
        <div><span className="eyebrow">{meeting.type}</span><h3>{meeting.title}</h3></div>
        <button className="dots-button" aria-label={`Más opciones para ${meeting.title}`}><Icon name="dots" /></button>
      </div>
      <div className="meeting-meta"><span><Icon name="pin" size={14} />{meeting.location}</span><AvatarStack people={meeting.people} /></div>
      <button className="complete-button" onClick={() => onToggle(meeting.id)} aria-pressed={meeting.done}>
        <span className="check-circle"><Icon name="check" size={13} /></span>{meeting.done ? "Marcada como lista" : "Marcar como lista"}
      </button>
    </div>
  </article>;
}

function App() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [activeDate, setActiveDate] = useState("Hoy");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const visibleMeetings = useMemo(() => meetings.filter(meeting => {
    const matchesDate = activeDate === "Todas" || meeting.date === activeDate;
    const haystack = `${meeting.title} ${meeting.location} ${meeting.type}`.toLowerCase();
    return matchesDate && haystack.includes(query.toLowerCase());
  }), [activeDate, meetings, query]);

  const toggleMeeting = (id) => setMeetings(current => current.map(meeting => meeting.id === id ? { ...meeting, done: !meeting.done } : meeting));

  const addMeeting = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const meeting = {
      id: Date.now(), date: "Hoy", time: form.get("time"), title: form.get("title"), people: ["Tú"], duration: `${form.get("duration")} min`, location: form.get("location") || "Por definir", type: "Nuevo", accent: "blue", done: false,
    };
    setMeetings(current => [...current, meeting].sort((a, b) => a.time.localeCompare(b.time)));
    setIsModalOpen(false);
    setToast("Reunión agregada a tu agenda");
    window.setTimeout(() => setToast(""), 2800);
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">F</span><span>Friendly<span>Meetings</span></span></div>
      <div className="workspace-switcher"><span className="workspace-avatar">J</span><span><b>Juanqui</b><small>Espacio personal</small></span><Icon name="dots" size={16} /></div>
      <nav className="main-nav" aria-label="Navegación principal">
        <span className="nav-label">Workspace</span>
        {navItems.map(item => <button key={item.label} className={`nav-item ${item.label === "Agenda" ? "active" : ""}`}><Icon name={item.icon} /><span>{item.label}</span>{item.label === "Notas" && <span className="nav-count">4</span>}</button>)}
      </nav>
      <div className="sidebar-bottom"><div className="week-note"><span className="week-note-number">72%</span><span>de tu semana<br /><b>está enfocada</b></span></div><div className="sidebar-help">Tu agenda, sin ruido.</div></div>
    </aside>

    <main className="main-content">
      <header className="top-header"><div><span className="eyebrow">Lunes, 7 de septiembre</span><h1>Buen día, Juanqui <span className="wave">✦</span></h1><p>Un espacio claro para las conversaciones que importan.</p></div><div className="header-actions"><label className="search-box"><Icon name="search" size={16} /><input aria-label="Buscar reuniones" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar en agenda" /></label><button className="button button-dark" onClick={() => setIsModalOpen(true)}><Icon name="plus" size={17} />Nueva reunión</button></div></header>

      <section className="hero-strip"><div className="hero-copy"><span className="hero-kicker">Tu próxima conversación</span><h2>El trabajo avanza<br /><em>cuando se encuentra.</em></h2><p>Tenés <b>{meetings.filter(item => !item.done).length} reuniones</b> por delante. Guardá un poco de aire entre una y otra.</p></div><div className="hero-orbit" aria-hidden="true"><span className="orbit-ring ring-one" /><span className="orbit-ring ring-two" /><span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" /><span className="orbit-core">FM</span></div></section>

      <section className="agenda-section"><div className="section-header"><div><span className="eyebrow">Agenda viva</span><h2>Próximos encuentros</h2></div><div className="date-tabs" role="tablist" aria-label="Filtrar reuniones">{["Hoy", "Mañana", "Todas"].map(date => <button role="tab" aria-selected={activeDate === date} className={activeDate === date ? "selected" : ""} onClick={() => setActiveDate(date)} key={date}>{date}</button>)}</div></div><div className="meeting-list">{visibleMeetings.length ? visibleMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} onToggle={toggleMeeting} />) : <div className="empty-state"><span>◌</span><h3>No encontramos reuniones</h3><p>Probá con otro día o limpiá la búsqueda.</p></div>}</div></section>
    </main>

    <aside className="right-rail"><div className="rail-heading"><span className="eyebrow">Resumen</span><button className="dots-button" aria-label="Más opciones"><Icon name="dots" /></button></div><div className="focus-card"><div className="focus-card-top"><span className="focus-label">Tiempo en foco</span><span className="focus-status">+12%</span></div><strong>4h 20m</strong><div className="focus-bars" aria-hidden="true">{[42, 68, 54, 84, 64, 91, 72, 100, 80, 56, 74, 46].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div><p>vs. 3h 50m la semana pasada</p></div><div className="mini-section"><div className="mini-heading"><h3>Personas frecuentes</h3><button className="text-link">Ver todas <Icon name="arrow" size={13} /></button></div><div className="people-list"><div className="person-row"><span className="avatar avatar-0">LC</span><span><b>Laura Costa</b><small>Diseño · 3 encuentros</small></span><span className="person-pulse" /></div><div className="person-row"><span className="avatar avatar-1">JP</span><span><b>Julián Paz</b><small>Producto · 2 encuentros</small></span><span className="person-pulse" /></div><div className="person-row"><span className="avatar avatar-2">SR</span><span><b>Sofía Ríos</b><small>Ingeniería · 2 encuentros</small></span><span className="person-pulse" /></div></div></div><div className="quote-card"><span className="quote-mark">“</span><p>Las mejores ideas aparecen cuando dejamos espacio para escucharlas.</p><span className="quote-by">— nota de la semana</span></div></aside>

    {isModalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && setIsModalOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="eyebrow">Nueva entrada</span><h2 id="modal-title">Agendá una conversación</h2></div><button className="dots-button" onClick={() => setIsModalOpen(false)} aria-label="Cerrar"><Icon name="close" /></button></div><form onSubmit={addMeeting}><label>Título<input name="title" required placeholder="Ej. Revisión de proyecto" /></label><div className="form-grid"><label>Hora<input name="time" type="time" defaultValue="15:00" required /></label><label>Duración<select name="duration" defaultValue="30"><option value="15">15</option><option value="30">30</option><option value="45">45</option><option value="60">60</option></select></label></div><label>Lugar<input name="location" placeholder="Ej. Google Meet" /></label><div className="modal-actions"><button type="button" className="button button-light" onClick={() => setIsModalOpen(false)}>Cancelar</button><button className="button button-dark" type="submit">Agregar reunión <Icon name="arrow" size={16} /></button></div></form></section></div>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
