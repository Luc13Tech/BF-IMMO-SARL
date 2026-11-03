
import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ServicesGrid from '../components/home/ServicesGrid';
import {
  getServices,
  getContent,
  getProperties,
} from '../api/client';

export default function Home() {
  const [services, setServices] = useState([]);
  const [content, setContent] = useState({});
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getServices(),
      getContent(),

      // Récupération de tous les biens actifs
      // cochés « Mettre en avant » dans l'administration.
      getProperties({ featured: 'true' }).catch(() => []),
    ])
      .then(async ([servicesData, contentData, featuredData]) => {
        setServices(servicesData);
        setContent(contentData);

        if (featuredData.length > 0) {
          // Tous les biens mis en vedette sont transmis au carrousel.
          setFeaturedProperties(featuredData);
        } else {
          // Si aucun bien n'est mis en vedette,
          // on conserve le comportement de secours de l'ancien accueil.
          const fallback = await getProperties({ limit: 1 }).catch(() => []);
          setFeaturedProperties(fallback);
        }
      })
      .catch((err) => {
        console.error(
          "Erreur de chargement de l'accueil :",
          err
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero
        title={content['hero.title']}
        subtitle={content['hero.subtitle']}
        featuredProperties={featuredProperties}
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
