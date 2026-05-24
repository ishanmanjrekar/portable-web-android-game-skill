import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { BoundingBox } from './components/BoundingBox';

function App() {
  const {
    shards,
    shardsPerClick,
    shardsPerSecond,
    totalClicks,
    activeMultiplier,
    upgrades,
    collectShards,
    purchaseUpgrade,
    resetGame,
    tick
  } = useGameStore((state) => state);

  // Trigger automated shards-per-second clock at 100ms ticks
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 100);
    return () => clearInterval(timer);
  }, [tick]);

  return (
    <div className="flex h-[100dvh] w-screen bg-[#05050a] overflow-hidden select-none">
      <BoundingBox width={480} height={850}>
        <div className="flex flex-col h-full w-full space-gradient px-4 py-6 text-white justify-between overflow-hidden relative">
          
          {/* HEADER SECTION (Bolted Top) */}
          <div className="flex-none flex flex-col items-center gap-1 border-b border-white/5 pb-4">
            <h1 className="font-headline text-3xl tracking-widest text-[#06b6d4] text-glow select-none">
              COSMIC DUST
            </h1>
            <div className="flex flex-col items-center">
              <span className="font-headline text-5xl text-white tracking-wide mt-1">
                {shards.toLocaleString()}
              </span>
              <span className="text-[#ec4899] text-xs font-bold uppercase tracking-widest mt-1">
                Shards Collected
              </span>
            </div>
            
            <div className="flex justify-between w-full mt-4 text-xs font-semibold tracking-wider text-white/60">
              <div className="flex flex-col items-start gap-0.5">
                <span className="uppercase text-white/40">Per Second</span>
                <span className="text-secondary text-sm font-bold">+{shardsPerSecond} /s</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="uppercase text-white/40">Active Booster</span>
                <span className="text-tertiary text-sm font-black bg-tertiary/10 px-2 py-0.5 rounded-full border border-tertiary/20">
                  {activeMultiplier}x
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="uppercase text-white/40">Power/Click</span>
                <span className="text-primary text-sm font-bold">+{shardsPerClick}</span>
              </div>
            </div>
          </div>

          {/* MAIN CORE VIEW (Elastic Center) */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative">
            
            {/* Pulsing Space Particles in background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-ping duration-1000" />
              <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-primary rounded-full animate-ping duration-1500" />
            </div>

            {/* Tap-able Celestial Orb */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={collectShards}
              className="orb-floating w-44 h-44 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#06b6d4] flex items-center justify-center cursor-pointer relative z-10 border border-white/20"
            >
              {/* Internal celestial core glow */}
              <div className="absolute inset-2 bg-gradient-to-bl from-white/30 to-black/40 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-white fill-current opacity-85 select-none pointer-events-none">
                  <path d="M12 2L2 22h20L12 2zm0 3.99L18.8 19H5.2L12 5.99z"/>
                </svg>
              </div>
            </motion.div>
            
            {/* Instructions */}
            <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-6 select-none animate-pulse">
              TAP ORB TO CONVERGE PARTICLES
            </span>
          </div>

          {/* UPGRADES PANEL (Bolted Bottom) */}
          <div className="flex-none flex flex-col gap-3 bg-surface-low border border-white/5 rounded-2xl p-3 shadow-2xl relative">
            <h2 className="text-[#06b6d4] font-headline text-sm tracking-wider uppercase">
              Celestial Upgrades
            </h2>
            
            {/* List of scrollable/tight upgrades */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {upgrades.map((upgrade) => {
                const canAfford = shards >= upgrade.cost;
                return (
                  <button
                    key={upgrade.id}
                    onClick={() => purchaseUpgrade(upgrade.id)}
                    disabled={!canAfford}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                      canAfford 
                        ? 'bg-[#101026] hover:bg-[#151532] border-white/10 cursor-pointer active:scale-98' 
                        : 'bg-[#0b0b14]/50 border-white/5 opacity-55'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 max-w-[70%]">
                      <span className="font-headline text-white text-sm">
                        {upgrade.name}
                      </span>
                      <span className="text-white/50 text-[10px] line-clamp-1 leading-normal">
                        {upgrade.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-1.5 py-0.5 rounded font-bold">
                        Owned: {upgrade.count}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-tertiary rounded-full text-[8px] text-black flex items-center justify-center font-black">
                          $
                        </span>
                        <span className={`text-xs font-bold ${canAfford ? 'text-tertiary' : 'text-white/40'}`}>
                          {upgrade.cost}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick reset */}
            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-white/30 border-t border-white/5 pt-2 mt-1">
              <span>TOTAL ORB CLICKS: {totalClicks}</span>
              <button 
                onClick={resetGame}
                className="hover:text-primary transition-colors cursor-pointer uppercase"
              >
                RESET SYSTEM
              </button>
            </div>
          </div>

        </div>
      </BoundingBox>
    </div>
  );
}

export default App;
