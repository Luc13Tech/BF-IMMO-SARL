import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import { getServices, getContent } from '../api/client';

export default function Home() {
  const [services, setServices] = useState([]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getContent()])
      .then(([servicesData, contentData]) => {
        setServices(servicesData);
        setContent(contentData);
      })
      .catch((err) => console.error('Erreur de chargement de l\'accueil :', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero title={content['hero.title']} subtitle={content['hero.subtitle']} />

      {loading ? (
        <div className="py-28 text-center font-mono text-sm text-ink/40">
          Chargement des services…
        </div>
      ) : (
        <ServicesGrid services={services} />
      )}
    </>
  );
}
