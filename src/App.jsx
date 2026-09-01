import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingButtons from './components/layout/FloatingButtons';
import Home from './pages/Home';
import { getContent } from './api/client';

export default function App() {
  const [content, setContent] = useState({});

  useEffect(() => {
    getContent().then(setContent).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/*
            Les routes suivantes arrivent dans le prochain lot de fichiers :
            /services/:slug  → page générique de service + formulaire dynamique
            /biens           → galerie des biens
            /a-propos        → page À propos
            /contact         → page Contact
            /admin/*         → espace administrateur
          */}
        </Routes>
      </main>

      <Footer content={content} />
      <FloatingButtons whatsapp="221778294142" onOpenAssistant={() => console.log('Ouvrir Assistant IA')} />
    </div>
  );
}
