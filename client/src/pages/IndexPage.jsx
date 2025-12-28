import { usePlaces } from '../../hooks';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import Hero from '@/components/ui/Hero';
import Services from '@/components/ui/Services';

const IndexPage = () => {
  const allPlaces = usePlaces();
  const { places, loading } = allPlaces;

  return (
    <div className="flex flex-col">
      <Hero />
      <Services />

      <section id="explore" className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 sm:text-left">
          Explore Top Destinations
        </h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-10">
            {places.length > 0 ? (
              places.map((place) => <PlaceCard place={place} key={place._id} />)
            ) : (
              <div className="flex w-full flex-col items-center justify-center py-20 text-center">
                <h1 className="text-3xl font-semibold">Result not found!</h1>
                <p className="mt-2 text-lg text-gray-500">
                  Sorry, we couldn't find the place you're looking for.
                </p>
                <a
                  href="/"
                  className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Go back
                </a>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default IndexPage;
