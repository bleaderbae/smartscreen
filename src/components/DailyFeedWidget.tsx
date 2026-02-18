import React, { useState, useEffect } from 'react';
import { Rocket, PawPrint, X, Maximize2, Loader } from 'lucide-react';
import { getNASAData, getDogData, type FeedItem } from '../services/dailyFeedService';

const DailyFeedWidget: React.FC = () => {
  const [currentFeed, setCurrentFeed] = useState<'nasa' | 'dog'>('nasa');
  const [feedData, setFeedData] = useState<{ nasa: FeedItem | null; dog: FeedItem | null }>({ nasa: null, dog: null });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      try {
        const [nasa, dog] = await Promise.all([getNASAData(), getDogData()]);
        setFeedData({ nasa, dog });
      } catch (error) {
        console.error("Failed to load feeds", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();

    // Toggle every 10 minutes
    const interval = setInterval(() => {
      setCurrentFeed(prev => (prev === 'nasa' ? 'dog' : 'nasa'));
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = feedData[currentFeed];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  if (loading || !currentItem) {
    return (
      <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2 flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {/* Widget Card */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`View ${currentItem.type === 'nasa' ? 'Astronomy Picture' : 'Daily Dog Fact'}: ${currentItem.title}`}
        className="bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-800 col-span-2 relative group cursor-pointer min-h-[200px] focus-visible:ring-2 focus-visible:ring-blue-400 outline-none active:scale-95 transition-transform"
        onClick={() => setIsOpen(true)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentItem.url}
            alt={currentItem.title}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {currentItem.type === 'nasa' ? (
                <Rocket className="text-blue-400" size={16} />
              ) : (
                <PawPrint className="text-orange-400" size={16} />
              )}
              <span className="text-xs font-medium uppercase tracking-wider text-gray-200">
                {currentItem.type === 'nasa' ? 'Astronomy Picture' : 'Daily Dog Fact'}
              </span>
            </div>
            <Maximize2 className="text-white/50 transition-opacity" size={20} />
          </div>

          <div>
            <h3 className="text-2xl font-light text-white leading-tight mb-1 line-clamp-2">
              {currentItem.title}
            </h3>
            {currentItem.type === 'dog' && (
              <p className="text-gray-300 text-sm line-clamp-2 font-light">
                {currentItem.explanation}
              </p>
            )}
            {currentItem.type === 'nasa' && (
               <p className="text-gray-400 text-xs">Tap to explore</p>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-all active:scale-90 bg-white/10 p-2 rounded-full hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white outline-none"
          >
            <X size={32} />
          </button>

          <div
            className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center bg-gray-900/40 p-8 rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={currentItem.url}
                alt={currentItem.title}
                className="rounded-xl max-h-[70vh] object-contain shadow-lg border border-white/5"
              />
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                {currentItem.type === 'nasa' ? (
                  <Rocket className="text-blue-400" size={32} />
                ) : (
                  <PawPrint className="text-orange-400" size={32} />
                )}
                <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {currentItem.type === 'nasa' ? 'Astronomy Picture of the Day' : 'Daily Dog Fact'}
                </span>
              </div>

              <h2 id="modal-title" className="text-4xl font-light text-white leading-tight">
                {currentItem.title}
              </h2>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mt-4">
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {currentItem.explanation}
                </p>
              </div>

              {currentItem.type === 'nasa' && (
                <div className="mt-4 text-xs text-gray-500">
                   Image Credit: NASA APOD
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(DailyFeedWidget);
