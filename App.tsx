
import React, { useState, useCallback } from 'react';
import { AspectSelector } from './components/AspectSelector';
import { GuideDisplay } from './components/GuideDisplay';
import { LoadingState } from './components/LoadingState';
import { Weapon, Aspect, BuildGuide } from './types';
import { generateBuildGuide } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'selector' | 'loading' | 'guide' | 'error'>('selector');
  const [guideData, setGuideData] = useState<BuildGuide | null>(null);
  const [currentSelection, setCurrentSelection] = useState<{weapon: Weapon, aspect: Aspect} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSelect = useCallback(async (weapon: Weapon, aspect: Aspect) => {
    setCurrentSelection({ weapon, aspect });
    setView('loading');
    try {
      const data = await generateBuildGuide(weapon.name, aspect.name);
      setGuideData(data);
      setView('guide');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to consult the oracle.");
      setView('error');
    }
  }, []);

  const handleRegenerate = useCallback(async (
    pinnedBoons: Partial<BuildGuide['boons']> = {},
    pinnedHammers: BuildGuide['hammers'] = [],
    pinnedDuos: BuildGuide['duos'] = []
  ) => {
    if (!currentSelection) return;
    
    setView('loading');
    try {
      // Pass the current guideData to the service for avoidance context,
      // and pinned items for constraint context
      const data = await generateBuildGuide(
        currentSelection.weapon.name, 
        currentSelection.aspect.name, 
        guideData || undefined,
        pinnedBoons,
        pinnedHammers,
        pinnedDuos
      );
      setGuideData(data);
      setView('guide');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to consult the oracle for a new strategy.");
      setView('error');
    }
  }, [currentSelection, guideData]);

  const handleReset = useCallback(() => {
    setGuideData(null);
    setCurrentSelection(null);
    setView('selector');
    setErrorMsg('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950 z-0"></div>
      
      <main className="relative z-10 container mx-auto px-4 pt-6">
        {view === 'selector' && <AspectSelector onSelect={handleSelect} />}
        
        {view === 'loading' && <LoadingState text={guideData ? "Divining a path..." : "Consulting the Fates..."} />}
        
        {view === 'guide' && guideData && (
          <GuideDisplay 
            guide={guideData} 
            onReset={handleReset} 
            onRegenerate={handleRegenerate}
          />
        )}

        {view === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <div className="bg-red-900/20 border border-red-500/30 p-8 rounded-2xl max-w-md">
              <h2 className="text-2xl font-serif text-red-400 mb-4">The Connection was Severed</h2>
              <p className="text-slate-300 mb-6">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-2 rounded-lg font-bold uppercase tracking-wider transition-all"
              >
                Return to Safety
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full py-2 text-center text-xs text-slate-700 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 z-20">
        Powered by Gemini 2.5 Flash &bull; Fan Content Not Affiliated with Supergiant Games
      </footer>
    </div>
  );
};

export default App;
