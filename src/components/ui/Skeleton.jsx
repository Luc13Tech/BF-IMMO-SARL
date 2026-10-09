import React from 'react';

/**
 * Skeleton générique
 * Affiche un bloc animé pendant le chargement du contenu.
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-200 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/**
 * Skeleton d'une carte de service.
 */
export function ServiceCardSkeleton() {
  return (
    <div
      className="h-[220px] rounded-[28px] bg-white p-8 shadow-sm"
      aria-hidden="true"
    >
      <Skeleton className="mb-6 h-14 w-14 rounded-full" />
      <Skeleton className="mb-3 h-5 w-2/3" />
      <Skeleton className="mb-2 h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
  );
}

/**
 * Grille de cartes de services.
 */
export function ServicesGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Chargement des services"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
      <span className="sr-only">Chargement des services...</span>
    </div>
  );
}

/**
 * Skeleton d'une carte immobilière.
 */
export function PropertyCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[26px] rounded-tr-lg bg-white shadow-[0_18px_40px_-24px_rgba(30,32,39,0.25)]"
      aria-hidden="true"
    >
      <Skeleton className="h-56 w-full rounded-none" />

      <div className="p-6">
        <Skeleton className="mb-3 h-4 w-3/4" />
        <Skeleton className="mb-4 h-3 w-1/2" />
        <Skeleton className="mb-4 h-5 w-2/5" />

        <div className="flex gap-4 border-t border-gray-200 pt-4">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grille de cartes immobilières.
 */
export function PropertiesGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Chargement des biens immobiliers"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
      <span className="sr-only">
        Chargement des biens immobiliers...
      </span>
    </div>
  );
}

export default Skeleton;
