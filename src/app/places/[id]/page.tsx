'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Remplacez par votre token Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function PlacePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    fetchPlace();
  }, [params.id]);

  useEffect(() => {
    if (place && !map) {
      const newMap = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [place.longitude, place.latitude],
        zoom: 15,
      });

      newMap.on('load', () => {
        const newMarker = new mapboxgl.Marker()
          .setLngLat([place.longitude, place.latitude])
          .addTo(newMap);
        setMarker(newMarker);
      });

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
      if (marker) {
        marker.remove();
        setMarker(null);
      }
    };
  }, [place, map]);

  async function fetchPlace() {
    try {
      const response = await fetch(`/api/places/${params.id}`);
      if (!response.ok) throw new Error('Lieu non trouvé');
      const data = await response.json();
      setPlace(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return;

    try {
      const response = await fetch(`/api/places/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      router.push('/places');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Lieu non trouvé'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{place.name}</h1>
            {session?.user?.email === place.author.email && (
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push(`/places/${place.id}/edit`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            {place.imageUrl ? (
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Aucune image</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                {place.category}
              </span>
              <span className="text-sm text-gray-500">
                Ajouté par {place.author.name} le{' '}
                {new Date(place.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{place.description}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">Adresse</h2>
              <p className="mt-2 text-gray-600">{place.address}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-medium text-gray-900">Localisation</h2>
              <div id="map" className="mt-2 h-96 w-full rounded-lg border border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 