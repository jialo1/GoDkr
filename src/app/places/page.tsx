'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  imageUrl?: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const response = await fetch('/api/places');
      if (!response.ok) throw new Error('Erreur lors du chargement des lieux');
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      setError('Erreur lors du chargement des lieux');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Lieux à Dakar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Découvrez les meilleurs endroits à Dakar, des restaurants aux sites touristiques.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/places/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              Ajouter un lieu
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <div
              key={place.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              {place.imageUrl ? (
                <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ) : (
                <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75">
                  <MapPinIcon className="h-full w-full text-gray-400" />
                </div>
              )}
              <div className="flex flex-1 flex-col space-y-6 p-6">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href={`/places/${place.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {place.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{place.description}</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                      {place.category}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-500">{place.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 