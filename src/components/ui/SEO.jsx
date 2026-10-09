import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'BF IMMO SARL';
const SITE_URL = 'https://bfimmo-senegal.com';
const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — Votre bien, notre engagement`;

  const url = `${SITE_URL}${path}`;

  const desc =
    description ||
    "BF IMMO SARL accompagne particuliers, investisseurs et entreprises à Dakar : achat, location, gérance, vente, conseils, construction BTP et suivi de chantier.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {noindex && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_SN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}

export { SITE_NAME, SITE_URL };
