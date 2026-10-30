"use client";

import { useMemo, useState } from "react";

type Pro = {
  id: number;
  name: string;
  specialty: string;
  studio: string;
  rating: string;
  reviews: number;
  distance: string;
  next: string;
  price: string;
  color: string;
  initials: string;
  photo?: string;
  tags: string[];
};

const professionals: Pro[] = [
  { id: 1, name: "Omar Chavez", specialty: "Master barber", studio: "Chavez Grooming Studio", rating: "5.0", reviews: 1200, distance: "1.2 mi", next: "Today, 2:30 PM", price: "$50", color: "coral", initials: "OC", photo: "/omar-chavez.jpg", tags: ["Fades", "Beard care"] },
  { id: 2, name: "Rafa Chavez", specialty: "Barber & stylist", studio: "Chavez Grooming Studio", rating: "4.9", reviews: 863, distance: "2.4 mi", next: "Today, 4:00 PM", price: "$50", color: "blue", initials: "RC", photo: "/rafa-chavez.jpg", tags: ["Haircuts", "Styling"] },
];

const services = [
  { name: "Signature haircut", detail: "Consultation, shampoo, cut & finish", duration: "45 min", price: "$65" },
  { name: "Silk press", detail: "Cleanse, treatment, press & style", duration: "1 hr 30 min", price: "$95" },
  { name: "Protective style consultation", detail: "Plan your look and hair preparation", duration: "30 min", price: "$35" },
];

const appointments = [
  { time: "9:00", period: "AM", client: "Nia Carter", service: "Silk press", length: "90 min", tone: "violet" },
  { time: "11:15", period: "AM", client: "Jordan Blake", service: "Signature haircut", length: "45 min", tone: "mint" },
  { time: "1:00", period: "PM", client: "Lunch / blocked", service: "Personal time", length: "30 min", tone: "neutral" },
  { time: "2:30", period: "PM", client: "Amara Stone", service: "Color consultation", length: "45 min", tone: "peach" },
  { time: "4:00", period: "PM", client: "Open slot", service: "Available to book", length: "60 min", tone: "open" },
];

function TimeSlotLogo({ compact = false }: { compact?: boolean }) {
  return <span className={compact ? "timeslot-logo compact" : "timeslot-logo"} aria-hidden="true">
    <svg viewBox="0 0 48 48" role="img">
      <defs><linearGradient id="timeslot-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#35d6ff" /><stop offset=".52" stopColor="#5b7cff" /><stop offset="1" stopColor="#d447ff" /></linearGradient></defs>
      <path d="M10 8v6M25 8v6M7 17h24M8 11h22a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H11a4 4 0 0 1-4-4V14a3 3 0 0 1 3-3Z" fill="none" stroke="url(#timeslot-gradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 23h3M22 23h3M13 29h3" stroke="url(#timeslot-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="34" cy="33" r="9" fill="#0b1023" stroke="url(#timeslot-gradient)" strokeWidth="3.5" />
      <path d="M34 28v5l4 2" fill="none" stroke="url(#timeslot-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>;
}

export default function Home() {
  const [mode, setMode] = useState<"client" | "business">("client");
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedService, setSelectedService] = useState(0);
  const [selectedTime, setSelectedTime] = useState("2:30 PM");
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState("");
  const [businessTab, setBusinessTab] = useState("Calendar");

  const bookingTotal = useMemo(() => services[selectedService].price, [selectedService]);

  function startBooking(pro: Pro) {
    setSelectedPro(pro);
    setBookingStep(0);
    setConfirmed(false);
  }

  function closeBooking() {
    setSelectedPro(null);
    setBookingStep(0);
    setConfirmed(false);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setMode("client")} aria-label="Time Slot home">
          <TimeSlotLogo />
          <span className="brand-word"><span>Time</span><b>Slot</b></span>
        </button>

        <nav className="mode-switch" aria-label="Preview mode">
          <button className={mode === "client" ? "active" : ""} onClick={() => setMode("client")}>For clients</button>
          <button className={mode === "business" ? "active" : ""} onClick={() => setMode("business")}>For professionals</button>
        </nav>

        <div className="top-actions">
          <button className="icon-button" aria-label="Notifications">●<span className="notification-dot" /></button>
          <button className="profile-pill"><span className="avatar tiny">JD</span><span>Jamie</span><b>⌄</b></button>
        </div>
      </header>

      {mode === "client" ? (
        <ClientView onBook={startBooking} onToast={showToast} />
      ) : (
        <BusinessView tab={businessTab} onTab={setBusinessTab} onToast={showToast} />
      )}

      {selectedPro && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeBooking()}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-label="Book an appointment">
            <button className="modal-close" onClick={closeBooking} aria-label="Close booking">×</button>
            {!confirmed ? (
              <>
                <div className="modal-heading">
                  <span className={`avatar ${selectedPro.color}`}>{selectedPro.photo ? <img src={selectedPro.photo} alt="" /> : selectedPro.initials}</span>
                  <div><p className="eyebrow">Book with</p><h2>{selectedPro.name}</h2><p>{selectedPro.studio}</p></div>
                </div>
                <div className="steps" aria-label="Booking progress">
                  {["Service", "Time", "Confirm"].map((label, index) => <span key={label} className={index <= bookingStep ? "active" : ""}><b>{index + 1}</b>{label}</span>)}
                </div>

                {bookingStep === 0 && <div className="modal-body"><h3>Choose a service</h3><div className="service-list">{services.map((service, index) => (
                  <button key={service.name} className={selectedService === index ? "service-option selected" : "service-option"} onClick={() => setSelectedService(index)}>
                    <span><strong>{service.name}</strong><small>{service.detail}</small><small>{service.duration}</small></span><b>{service.price}</b>
                  </button>
                ))}</div></div>}

                {bookingStep === 1 && <div className="modal-body"><h3>Pick a time</h3><div className="date-strip">{["Thu|29", "Fri|30", "Sat|31", "Sun|01", "Mon|02"].map((date, index) => { const [day, number] = date.split("|"); return <button key={date} className={index === 0 ? "selected" : ""}><small>{day}</small><strong>{number}</strong></button>; })}</div><p className="slot-label">Thursday, October 29 · Available times</p><div className="time-grid">{["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map(time => <button key={time} className={selectedTime === time ? "selected" : ""} onClick={() => setSelectedTime(time)}>{time}</button>)}</div></div>}

                {bookingStep === 2 && <div className="modal-body"><h3>Review your appointment</h3><div className="confirmation-card"><div><span>Service</span><strong>{services[selectedService].name}</strong></div><div><span>Date & time</span><strong>Thu, Oct 29 at {selectedTime}</strong></div><div><span>Professional</span><strong>{selectedPro.name}</strong></div><div><span>Due at appointment</span><strong>{bookingTotal}</strong></div></div><label className="policy-check"><input type="checkbox" defaultChecked /> I agree to the 24-hour cancellation policy.</label></div>}

                <div className="modal-footer">
                  {bookingStep > 0 && <button className="text-button" onClick={() => setBookingStep(step => step - 1)}>Back</button>}
                  <button className="primary-button wide" onClick={() => bookingStep < 2 ? setBookingStep(step => step + 1) : setConfirmed(true)}>{bookingStep < 2 ? "Continue" : "Confirm booking"}</button>
                </div>
              </>
            ) : (
              <div className="success-state"><span className="success-mark">✓</span><p className="eyebrow">You’re all set</p><h2>Appointment confirmed</h2><p>Your {services[selectedService].name.toLowerCase()} with {selectedPro.name} is booked for Thursday, October 29 at {selectedTime}.</p><div className="success-summary"><span>Confirmation sent to</span><strong>jamie@example.com</strong></div><button className="primary-button wide" onClick={closeBooking}>View my appointments</button></div>
            )}
          </section>
        </div>
      )}

      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function ClientView({ onBook, onToast }: { onBook: (pro: Pro) => void; onToast: (message: string) => void }) {
  const [category, setCategory] = useState("All");
  return <div className="client-view">
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow light">YOUR TIME, YOUR STYLE</p><h1>Book your next look.<br /><em>Skip the back and forth.</em></h1><p>Find trusted barbers, stylists, and beauty professionals near you—then book in seconds.</p></div>
      <div className="hero-art"><span className="art-orbit one" /><span className="art-orbit two" /><div className="floating-card"><span className="avatar blue"><img src="/rafa-chavez.jpg" alt="Rafa Chavez" /></span><div><b>Next opening</b><small>Today · 4:00 PM</small></div><span className="check">✓</span></div></div>
    </section>

    <section className="content-wrap">
      <div className="quick-row"><div><p className="eyebrow">EXPLORE</p><h2>What are you looking for?</h2></div><button className="link-button">View all services →</button></div>
      <div className="category-row">{[
        ["All", "✦", "all"], ["Barber", "✂", "barber"], ["Hair", "⌁", "hair"], ["Nails", "◉", "nails"], ["Brows & lashes", "⌒", "brows"], ["Skin", "◇", "skin"]
      ].map(([label, icon, tone]) => <button key={label} className={`${category === label ? "category active" : "category"} ${tone}`} onClick={() => setCategory(label)}><span>{icon}</span>{label}<i>→</i></button>)}</div>

      <div className="section-heading"><div><p className="eyebrow">AVAILABLE SOON</p><h2>Top professionals near you</h2></div><div className="filter-pills"><button className="active">Recommended</button><button>Top rated</button><button>Nearest</button></div></div>
      <div className="pro-grid">{professionals.map(pro => <article className="pro-card" key={pro.id}>
        <div className={`pro-cover ${pro.color} ${pro.photo ? "has-photo" : ""}`}>{pro.photo ? <img className="pro-photo" src={pro.photo} alt={`${pro.name}, ${pro.specialty}`} /> : <span className="pro-monogram">{pro.initials}</span>}<button aria-label={`Save ${pro.name}`} onClick={() => onToast(`${pro.name} added to favorites`)}>♡</button><span className="available-badge">Available today</span></div>
        <div className="pro-body"><div className="rating">★ {pro.rating} <span>({pro.reviews})</span></div><h3>{pro.name}</h3><p>{pro.specialty} · {pro.studio}</p><div className="tag-row">{pro.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="pro-meta"><span>⌖ {pro.distance}</span><span>From <b>{pro.price}</b></span></div><div className="next-slot"><span><small>Next available</small><b>{pro.next}</b></span><button onClick={() => onBook(pro)}>Book</button></div></div>
      </article>)}</div>

      <section className="rebook-banner"><div className="rebook-icon">↻</div><div><p className="eyebrow">WELCOME BACK</p><h2>Loved your last appointment?</h2><p>Rebook with Omar at the same time next Thursday.</p></div><button className="secondary-button" onClick={() => onBook(professionals[0])}>Rebook in one tap</button></section>
    </section>
    <footer><div className="brand"><TimeSlotLogo compact /><span className="brand-word"><span>Time</span><b>Slot</b></span></div><p>Appointments that fit your life.</p><span>© 2026 Time Slot</span></footer>
  </div>;
}

function BusinessView({ tab, onTab, onToast }: { tab: string; onTab: (tab: string) => void; onToast: (message: string) => void }) {
  const tabs = ["Overview", "Calendar", "Clients", "Services", "Team"];
  return <div className="business-view">
    <aside className="sidebar"><div className="business-profile"><span className="avatar coral">MT</span><div><strong>The Texture Room</strong><small>Phoenix, Arizona</small></div></div><nav>{tabs.map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => onTab(item)}><span>{({Overview:"▦",Calendar:"□",Clients:"♙",Services:"✦",Team:"♧"} as Record<string,string>)[item]}</span>{item}</button>)}</nav><div className="sidebar-bottom"><button><span>⚙</span>Settings</button><div className="trial-card"><b>Time Slot Pro</b><p>Your booking page is live.</p><span>View public profile →</span></div></div></aside>
    <section className="dashboard">
      <div className="dashboard-top"><div><p className="eyebrow">THURSDAY, OCTOBER 29</p><h1>{tab === "Calendar" ? "Today’s schedule" : tab}</h1><p>Good morning, Maya. Here’s what’s happening today.</p></div><div><button className="secondary-button" onClick={() => onToast("Public booking link copied")}>⌁ Share booking link</button><button className="primary-button" onClick={() => onToast("New appointment form opened")}>＋ New appointment</button></div></div>
      <div className="stat-grid"><div><span className="stat-icon mint">□</span><p>Today’s bookings</p><strong>6</strong><small>2 spots available</small></div><div><span className="stat-icon peach">$</span><p>Expected revenue</p><strong>$485</strong><small className="positive">↑ 12% vs last Thu</small></div><div><span className="stat-icon violet">♙</span><p>New clients</p><strong>2</strong><small>8 total this week</small></div><div><span className="stat-icon gold">★</span><p>Profile rating</p><strong>4.9</strong><small>184 client reviews</small></div></div>
      <div className="dashboard-grid">
        <div className="schedule-card"><div className="card-title"><div><h2>Thursday, October 29</h2><p>6 appointments · 7.5 hours booked</p></div><div><button>‹</button><button className="today">Today</button><button>›</button></div></div><div className="week-strip">{[["MON","26"],["TUE","27"],["WED","28"],["THU","29"],["FRI","30"],["SAT","31"],["SUN","1"]].map(day => <button key={day[1]} className={day[1] === "29" ? "active" : ""}><small>{day[0]}</small><strong>{day[1]}</strong><i /></button>)}</div><div className="timeline">{appointments.map(item => <div className="appointment-row" key={item.time + item.client}><div className="time"><b>{item.time}</b><small>{item.period}</small></div><div className={`appointment ${item.tone}`}><span className="appointment-avatar">{item.client === "Open slot" ? "+" : item.client.split(" ").map(word => word[0]).join("").slice(0,2)}</span><div><strong>{item.client}</strong><small>{item.service}</small></div><span className="appointment-length">{item.length}</span><button aria-label="Appointment menu">•••</button></div></div>)}</div></div>
        <aside className="today-panel"><div className="card-title"><div><h2>At a glance</h2><p>Your day in focus</p></div><button>•••</button></div><div className="progress-ring"><div><strong>75%</strong><span>booked</span></div></div><p className="center-copy">6 of 8 available hours</p><div className="mini-stats"><div><span>First appointment</span><b>9:00 AM</b></div><div><span>Last appointment</span><b>5:30 PM</b></div><div><span>Open time</span><b>2 hours</b></div></div><div className="waitlist"><span>⌛</span><div><b>3 clients waiting</b><p>Notify them about your 4:00 PM opening.</p></div><button onClick={() => onToast("Waitlist clients notified")}>Notify</button></div></aside>
      </div>
    </section>
  </div>;
}
