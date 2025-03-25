import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur GoDkr
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Découvrez et partagez les meilleurs endroits de votre région
          </p>
          <div className="space-x-4">
            <Link 
              href="/places" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Explorer les lieux
            </Link>
            <Link 
              href="/auth/login" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Découvrez</h2>
            <p className="text-gray-300">
              Explorez les meilleurs endroits recommandés par la communauté
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Partagez</h2>
            <p className="text-gray-300">
              Ajoutez vos propres découvertes et partagez-les avec d'autres
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Connectez-vous</h2>
            <p className="text-gray-300">
              Rejoignez une communauté passionnée d'explorateurs
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 