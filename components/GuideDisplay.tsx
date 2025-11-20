
import React, { useState, useEffect } from 'react';
import { BuildGuide, BuildRecommendation, StaticBoon, RarityStats } from '../types';
import { BOON_DATABASE } from '../boonData';
import { Zap, Sword, Shield, Sparkles, Footprints, Droplet, Hammer, Merge, ExternalLink, BookOpen, RefreshCw, ChevronLeft, Pin, Star } from 'lucide-react';

interface GuideDisplayProps {
  guide: BuildGuide;
  onReset: () => void;
  onRegenerate: (
    pinnedBoons: Partial<BuildGuide['boons']>,
    pinnedHammers: BuildGuide['hammers'],
    pinnedDuos: BuildGuide['duos']
  ) => void;
}

interface BoonCardProps {
  title: string;
  icon: React.ReactNode;
  data: BuildRecommendation;
  color: string;
  isPinned: boolean;
  onTogglePin: () => void;
}

// Helper to generate filename from text (e.g., "King's Ransom" -> "kings_ransom")
const getSlug = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
};

const PinToggle: React.FC<{ isPinned: boolean; onToggle: () => void; className?: string }> = ({ isPinned, onToggle, className = "" }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    className={`absolute top-3 right-3 p-2 rounded-full transition-all z-20 flex items-center justify-center ${className}
      ${isPinned 
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 scale-110' 
        : 'bg-slate-700/50 text-slate-500 hover:bg-slate-600 hover:text-slate-200'
      }`}
    title={isPinned ? "Unpin to allow changes" : "Pin to keep this item"}
  >
    <Pin size={14} className={isPinned ? "fill-current" : ""} />
  </button>
);

const RaritySelector: React.FC<{ 
  values: RarityStats, 
  current: keyof RarityStats, 
  onChange: (r: keyof RarityStats) => void,
  color: string 
}> = ({ values, current, onChange, color }) => {
  const rarities: (keyof RarityStats)[] = ['common', 'rare', 'epic', 'heroic'];
  
  return (
    <div className="flex items-center gap-1 mt-2 bg-slate-900/50 p-1 rounded-lg w-fit">
      {rarities.map(r => {
        if (!values[r]) return null;
        const isActive = current === r;
        let activeClass = '';
        if (isActive) {
          switch(r) {
            case 'common': activeClass = 'bg-slate-600 text-white'; break;
            case 'rare': activeClass = 'bg-blue-600 text-white'; break;
            case 'epic': activeClass = 'bg-purple-600 text-white'; break;
            case 'heroic': activeClass = 'bg-red-600 text-white'; break;
          }
        }
        
        return (
          <button
            key={r}
            onClick={(e) => { e.stopPropagation(); onChange(r); }}
            className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-all ${isActive ? activeClass : 'text-slate-500 hover:bg-slate-800'}`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
};

const EntityIcon: React.FC<{ 
  godName: string; 
  boonName?: string;
  fallbackIcon: React.ReactNode; 
  color: string;
  className?: string;
}> = ({ godName, boonName, fallbackIcon, color, className = "w-10 h-10" }) => {
  const initialSrc = boonName 
    ? `/images/boons/${getSlug(boonName)}.png`
    : `/images/gods/${godName.toLowerCase()}.png`;

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  // Update source if props change
  useEffect(() => {
    setImgSrc(initialSrc);
    setHasError(false);
  }, [initialSrc]);

  const handleError = () => {
    // If we were trying to load a specific boon image, fallback to God image
    if (imgSrc.includes('/images/boons/')) {
      setImgSrc(`/images/gods/${godName.toLowerCase()}.png`);
    } else {
      // If God image also fails (or wasn't tried), show fallback icon
      setHasError(true);
    }
  };

  return (
    <div className={`${className} rounded-lg flex items-center justify-center overflow-hidden border border-${color}-900/30 shrink-0 ${hasError ? `bg-${color}-900/30 text-${color}-400` : 'bg-slate-900'}`}>
      {!hasError ? (
        <img 
          src={imgSrc} 
          alt={boonName || godName}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        fallbackIcon
      )}
    </div>
  );
};

const BoonCard: React.FC<BoonCardProps> = ({ title, icon, data, color, isPinned, onTogglePin }) => {
  const [staticBoon, setStaticBoon] = useState<StaticBoon | null>(null);
  const [rarity, setRarity] = useState<keyof RarityStats>('common');

  useEffect(() => {
    // Find the static boon details from the DB
    if (data.god && BOON_DATABASE[data.god]) {
      const found = BOON_DATABASE[data.god].find(b => b.name === data.boonName);
      if (found) {
        setStaticBoon(found);
        // Always default to common when the boon data loads or changes
        setRarity('common'); 
      }
    }
  }, [data.god, data.boonName]);

  const currentValue = staticBoon?.values?.[rarity];

  return (
    <div 
      className={`relative border rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 shadow-lg backdrop-blur-sm h-full
      ${isPinned 
        ? `bg-slate-800/90 border-${color}-400 ring-1 ring-${color}-400/50 shadow-${color}-900/20` 
        : `bg-slate-800/80 border-slate-700 hover:border-${color}-500/50`
      }`}
    >
      <PinToggle isPinned={isPinned} onToggle={onTogglePin} />

      <div className="flex items-center gap-3 mb-2 border-b border-slate-700 pb-3 pr-8">
        <EntityIcon 
          godName={data.god} 
          boonName={data.boonName}
          fallbackIcon={icon} 
          color={color} 
        />
        <div>
          <span className="font-bold text-slate-200 uppercase tracking-wider text-xs block text-slate-500">{title}</span>
          <span className={`font-bold text-${color}-400 text-sm uppercase tracking-wider`}>{data.god}</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h4 className={`text-xl font-serif font-bold text-${color}-300 mb-1 flex items-baseline gap-2`}>
          {data.boonName} 
        </h4>
        
        {/* In-Game Description & Stats */}
        <div className="bg-slate-900/50 rounded p-3 mb-3 border border-slate-700/50 flex-1">
          <p className="text-sm text-slate-200 leading-relaxed">
            {staticBoon ? staticBoon.effect : data.description}
          </p>
          
          {staticBoon?.values && currentValue && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {staticBoon.statLabel || "Effect Value"}:
                </span>
                <span className={`font-mono font-bold text-${color}-400`}>
                  {currentValue}
                </span>
              </div>
              <RaritySelector 
                values={staticBoon.values} 
                current={rarity} 
                onChange={setRarity} 
                color={color} 
              />
            </div>
          )}
        </div>

        {/* Why It Works */}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Why it works</p>
          <p className="text-sm text-slate-400 leading-relaxed italic">{data.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export const GuideDisplay: React.FC<GuideDisplayProps> = ({ guide, onReset, onRegenerate }) => {
  const [pinnedSlots, setPinnedSlots] = useState<Record<string, boolean>>({});
  const [pinnedHammerNames, setPinnedHammerNames] = useState<Set<string>>(new Set());
  const [pinnedDuoNames, setPinnedDuoNames] = useState<Set<string>>(new Set());

  // Reset pins when guide changes significantly (different playstyle/aspect)
  // but keep them if we are refining (same aspectName)
  // Since guide is a prop, we can't easily differentiate 'refine' vs 'initial' here without logic.
  // But the user likely wants pins to persist across regenerations.
  
  const handleTogglePin = (slotKey: string) => {
    setPinnedSlots(prev => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  const handleToggleHammer = (name: string) => {
    const next = new Set(pinnedHammerNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setPinnedHammerNames(next);
  };

  const handleToggleDuo = (name: string) => {
    const next = new Set(pinnedDuoNames);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setPinnedDuoNames(next);
  };

  const handleRegenerateClick = () => {
    const pinnedBoons: Partial<BuildGuide['boons']> = {};
    if (pinnedSlots['attack']) pinnedBoons.attack = guide.boons.attack;
    if (pinnedSlots['special']) pinnedBoons.special = guide.boons.special;
    if (pinnedSlots['cast']) pinnedBoons.cast = guide.boons.cast;
    if (pinnedSlots['sprint']) pinnedBoons.sprint = guide.boons.sprint;
    if (pinnedSlots['magick']) pinnedBoons.magick = guide.boons.magick;

    const lockedHammers = guide.hammers.filter(h => pinnedHammerNames.has(h.name));
    const lockedDuos = guide.duos.filter(d => pinnedDuoNames.has(d.boonName));

    onRegenerate(pinnedBoons, lockedHammers, lockedDuos);
  };

  const totalPinned = Object.values(pinnedSlots).filter(Boolean).length + pinnedHammerNames.size + pinnedDuoNames.size;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button 
          onClick={onReset}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold tracking-wide uppercase flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-950/30"
        >
          <ChevronLeft size={18} /> Select Different Aspect
        </button>

        <button
          onClick={handleRegenerateClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw size={18} /> 
          {totalPinned > 0 ? 'Refine Strategy (Keep Pinned)' : 'New Strategy'}
        </button>
      </div>

      <header className="mb-12 text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 mb-4 font-serif shadow-emerald-500/20 relative z-10">
          {guide.aspectName}
        </h1>
        <div className="bg-slate-900/80 border border-emerald-500/30 p-6 rounded-2xl max-w-3xl mx-auto shadow-xl shadow-emerald-900/20 relative z-10 backdrop-blur-sm">
          <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-widest text-xs">Playstyle</h3>
          <p className="text-slate-200 text-lg leading-relaxed">{guide.playstyle}</p>
        </div>
      </header>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Sparkles className="text-yellow-400" /> Olympian Boons
          </h2>
          {Object.values(pinnedSlots).some(Boolean) && (
             <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
               {Object.values(pinnedSlots).filter(Boolean).length} Boons Locked
             </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <BoonCard 
            title="Attack" 
            icon={<Sword size={20} />} 
            data={guide.boons.attack} 
            color="red" 
            isPinned={!!pinnedSlots['attack']}
            onTogglePin={() => handleTogglePin('attack')}
          />
          <BoonCard 
            title="Special" 
            icon={<Zap size={20} />} 
            data={guide.boons.special} 
            color="yellow" 
            isPinned={!!pinnedSlots['special']}
            onTogglePin={() => handleTogglePin('special')}
          />
          <BoonCard 
            title="Cast" 
            icon={<Shield size={20} />} 
            data={guide.boons.cast} 
            color="purple" 
            isPinned={!!pinnedSlots['cast']}
            onTogglePin={() => handleTogglePin('cast')}
          />
          <BoonCard 
            title="Sprint" 
            icon={<Footprints size={20} />} 
            data={guide.boons.sprint} 
            color="blue" 
            isPinned={!!pinnedSlots['sprint']}
            onTogglePin={() => handleTogglePin('sprint')}
          />
          <BoonCard 
            title="Magick Gain" 
            icon={<Droplet size={20} />} 
            data={guide.boons.magick} 
            color="green" 
            isPinned={!!pinnedSlots['magick']}
            onTogglePin={() => handleTogglePin('magick')}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Hammers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <Hammer className="text-orange-400" /> Daedalus Hammers
            </h2>
            {pinnedHammerNames.size > 0 && (
               <span className="text-xs font-bold text-orange-400 uppercase tracking-widest animate-pulse">
                 {pinnedHammerNames.size} Locked
               </span>
            )}
          </div>
          <div className="space-y-4">
            {guide.hammers.map((hammer, idx) => {
              const isPinned = pinnedHammerNames.has(hammer.name);
              return (
                <div 
                  key={idx} 
                  className={`relative border p-5 rounded-xl transition-all duration-300
                    ${isPinned 
                      ? 'bg-slate-800/90 border-orange-400 ring-1 ring-orange-400/50 shadow-lg shadow-orange-900/20' 
                      : 'bg-slate-800/60 border-orange-500/20 hover:border-orange-500/50'
                    }`}
                >
                  <PinToggle isPinned={isPinned} onToggle={() => handleToggleHammer(hammer.name)} />
                  <h3 className="text-xl font-bold text-orange-300 mb-1 pr-8">{hammer.name}</h3>
                  <p className="text-slate-300 mb-2 text-sm bg-slate-900/40 p-3 rounded border border-slate-700/30">{hammer.description}</p>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Why it works</p>
                  <p className="text-slate-400 text-sm italic">{hammer.synergy}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Duos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
              <Merge className="text-pink-400" /> Key Synergies
            </h2>
            {pinnedDuoNames.size > 0 && (
               <span className="text-xs font-bold text-pink-400 uppercase tracking-widest animate-pulse">
                 {pinnedDuoNames.size} Locked
               </span>
            )}
          </div>
          <div className="space-y-4">
            {guide.duos.map((duo, idx) => {
              const isPinned = pinnedDuoNames.has(duo.boonName);
              return (
                <div 
                  key={idx} 
                  className={`relative p-5 rounded-xl overflow-hidden border transition-all duration-300
                    ${isPinned 
                      ? 'bg-slate-800/90 border-pink-400 ring-1 ring-pink-400/50 shadow-lg shadow-pink-900/20' 
                      : 'bg-slate-800/60 border-pink-500/20 hover:border-pink-500/50'
                    }`}
                >
                  <PinToggle isPinned={isPinned} onToggle={() => handleToggleDuo(duo.boonName)} />
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Merge size={120} className="text-pink-500" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-4">
                    <div className="shrink-0 pt-1">
                        <EntityIcon 
                            godName={duo.gods[0]} 
                            boonName={duo.boonName}
                            color="pink" 
                            fallbackIcon={<Merge size={20}/>} 
                        />
                    </div>
                    <div className="grow">
                        <h3 className="text-xl font-bold text-pink-300 mb-4 pr-8">
                        {duo.boonName} <span className="text-sm md:text-base font-normal text-pink-200/70">({duo.gods.join(' + ')}{duo.gods.length > 1 ? ' Duo Boon' : ''})</span>
                        </h3>
                        
                        {/* In-Game Description */}
                        <div className="bg-slate-900/60 rounded p-3 mb-3 border border-slate-700/50">
                        <p className="text-sm text-slate-200 leading-relaxed">{duo.description}</p>
                        </div>

                        {/* Why It Works */}
                        <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Why it works</p>
                        <p className="text-sm text-slate-400 leading-relaxed italic">{duo.explanation}</p>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sources Section */}
      {guide.sources && guide.sources.length > 0 && (
        <section className="border-t border-slate-800 pt-8 mt-12">
           <h2 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
            <BookOpen size={18} /> Knowledge Sources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guide.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-900 hover:bg-slate-800 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-all group"
              >
                <span className="text-slate-400 text-sm truncate group-hover:text-emerald-400 transition-colors">
                  {source.title}
                </span>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-emerald-500 ml-2 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
