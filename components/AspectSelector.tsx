
import React, { useState } from 'react';
import { Weapon, Aspect } from '../types';
import { WEAPONS, ASPECTS } from '../constants';
import { Wand, Swords, Axe, Flame, Skull, Shield, ChevronRight, HelpCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AspectSelectorProps {
  onSelect: (weapon: Weapon, aspect: Aspect) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Staff: Wand,
  Scissors: Swords,
  Axe: Axe,
  Flame: Flame,
  Skull: Skull,
  Shield: Shield
};

export const AspectSelector: React.FC<AspectSelectorProps> = ({ onSelect }) => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const handleWeaponClick = (weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setShowHidden(false); // Reset hidden state when switching weapons
  };

  const handleAspectClick = (aspect: Aspect) => {
    if (selectedWeapon) {
      onSelect(selectedWeapon, aspect);
    }
  };

  // Filter aspects based on hidden state
  const currentAspects = selectedWeapon ? (ASPECTS[selectedWeapon.id] || []) : [];
  const visibleAspects = showHidden ? currentAspects : currentAspects.filter(a => !a.hidden);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-emerald-600 font-serif mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          HADES II
        </h1>
        <h2 className="text-2xl text-slate-400 font-light tracking-widest uppercase">Build Oracle</h2>
      </header>

      {!selectedWeapon ? (
        <div className="animate-fade-in-up">
          <h3 className="text-xl text-emerald-400 mb-6 font-semibold uppercase tracking-wider text-center">Choose your Nocturnal Arm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEAPONS.map((weapon) => {
              const Icon = iconMap[weapon.iconName] || HelpCircle;
              return (
                <button
                  key={weapon.id}
                  onClick={() => handleWeaponClick(weapon)}
                  className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-900/20 hover:shadow-xl flex flex-col gap-6 h-auto min-h-[240px]"
                >
                  <div className="flex justify-between items-start w-full">
                     <div className="p-4 bg-slate-900/50 rounded-2xl group-hover:bg-emerald-900/20 transition-colors border border-slate-700/50 group-hover:border-emerald-500/30">
                        <Icon size={40} className="text-slate-400 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                     </div>
                     <ChevronRight className="text-slate-600 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
                  </div>

                  <div className="mt-auto">
                    <h4 className="text-2xl font-serif font-bold text-slate-200 group-hover:text-white transition-colors mb-2">{weapon.name}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">{weapon.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in-right">
          <button 
            onClick={() => setSelectedWeapon(null)}
            className="mb-8 text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider group"
          >
            <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Weapons
          </button>

          <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-800 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg">
                {React.createElement(iconMap[selectedWeapon.iconName] || HelpCircle, { size: 48, className: "text-emerald-400" })}
              </div>
              <div>
                <h3 className="text-4xl font-serif font-bold text-slate-100 mb-2">{selectedWeapon.name}</h3>
                <p className="text-slate-400">Select an aspect to reveal its mysteries</p>
              </div>
            </div>

            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-widest ${
                showHidden 
                  ? 'bg-purple-900/20 border-purple-500/50 text-purple-300' 
                  : 'bg-slate-900/40 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {showHidden ? <EyeOff size={16} /> : <Eye size={16} />}
              {showHidden ? 'Conceal Hidden Aspects' : 'Reveal Hidden Aspects'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAspects.map((aspect) => (
              <button
                key={aspect.id}
                onClick={() => handleAspectClick(aspect)}
                className={`group relative border p-6 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full ${
                  aspect.hidden 
                    ? 'bg-slate-950 border-slate-800 hover:border-purple-500/30 hover:shadow-purple-900/10'
                    : 'bg-slate-900 border-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-900/20'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-lg ${aspect.hidden ? 'bg-purple-900/10 text-purple-400' : 'bg-emerald-900/10 text-emerald-400'}`}>
                      <Sparkles size={24} />
                   </div>
                   {aspect.hidden && (
                    <span className="text-[10px] font-bold bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-800/50">HIDDEN</span>
                   )}
                </div>
                
                <h4 className={`text-xl font-bold mb-2 ${aspect.hidden ? 'text-purple-200' : 'text-emerald-200'}`}>
                  {aspect.name}
                </h4>
                <p className={`text-sm leading-relaxed mb-6 flex-grow ${aspect.hidden ? 'text-slate-500' : 'text-slate-400'}`}>
                  {aspect.description}
                </p>
                <div className={`mt-auto flex items-center text-xs font-bold uppercase tracking-widest ${
                  aspect.hidden 
                    ? 'text-purple-600 group-hover:text-purple-400' 
                    : 'text-emerald-600/50 group-hover:text-emerald-400'
                }`}>
                  Reveal Guide <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
            
            {visibleAspects.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                    No hidden aspects found for this armament... yet.
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
