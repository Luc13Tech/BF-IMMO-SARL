import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import { getServices, getContent, getProperties } from '../api/client';

export default function Home() {
  const [services, setServices] = useState([]);
  const [content, setContent] = useState({});
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getServices(),
      getContent(),
      // Un seul bien : celui coché "Mettre en avant" dans l'admin.
      // S'il n'y en a pas encore, on retombe sur le tout dernier bien ajouté
      // plutôt que de ne rien montrer.
      getProperties({ featured: 'true', limit: 1 }).catch(() => []),
    ])
      .then(async ([servicesData, contentData, featuredData]) => {
        setServices(servicesData);
        setContent(contentData);

        if (featuredData.length > 0) {
          setFeaturedProperty(featuredData[0]);
        } else {
          const fallback = await getProperties({ limit: 1 }).catch(() => []);
          if (fallback.length > 0) setFeaturedProperty(fallback[0]);
        }
      })
      .catch((err) => console.error('Erreur de chargement de l\'accueil :', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero
        title={content['hero.title']}
        subtitle={content['hero.subtitle']}
        featuredProperty={featuredProperty}
      />

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
