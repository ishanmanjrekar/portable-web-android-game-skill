import { create } from 'zustand';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: number;
  count: number;
  description: string;
}

interface GameState {
  shards: number;
  shardsPerClick: number;
  shardsPerSecond: number;
  totalClicks: number;
  activeMultiplier: number;
  upgrades: Upgrade[];
  
  // Game Actions
  collectShards: () => void;
  purchaseUpgrade: (id: string) => void;
  resetGame: () => void;
  tick: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  shards: 0,
  shardsPerClick: 1,
  shardsPerSecond: 0,
  totalClicks: 0,
  activeMultiplier: 1,
  
  upgrades: [
    {
      id: 'gravity_well',
      name: 'Gravity Well',
      cost: 15,
      effect: 0.2,
      count: 0,
      description: 'Gently pulls stray dust. Generates 0.2 shards/sec.'
    },
    {
      id: 'star_synthesizer',
      name: 'Stardust Synthesizer',
      cost: 100,
      effect: 1.5,
      count: 0,
      description: 'Fuses elements into stardust. Generates 1.5 shards/sec.'
    },
    {
      id: 'nebula_harness',
      name: 'Nebula Harness',
      cost: 500,
      effect: 8,
      count: 0,
      description: 'Harnesses raw nebula power. Generates 8.0 shards/sec.'
    },
    {
      id: 'supernova_core',
      name: 'Supernova Core',
      cost: 3000,
      effect: 50,
      count: 0,
      description: 'Generates intense cosmic energy. Generates 50.0 shards/sec.'
    }
  ],

  collectShards: () => set((state) => {
    const gain = state.shardsPerClick * state.activeMultiplier;
    const newTotalClicks = state.totalClicks + 1;
    
    // Increment active multiplier briefly every 10 clicks, etc.
    let newMultiplier = state.activeMultiplier;
    if (newTotalClicks % 25 === 0) {
      newMultiplier = Math.min(state.activeMultiplier + 1, 5); // Max 5x
    }

    return {
      shards: Number((state.shards + gain).toFixed(1)),
      totalClicks: newTotalClicks,
      activeMultiplier: newMultiplier
    };
  }),

  purchaseUpgrade: (id: string) => set((state) => {
    const upgradeIndex = state.upgrades.findIndex((u) => u.id === id);
    if (upgradeIndex === -1) return {};

    const upgrade = state.upgrades[upgradeIndex];
    if (state.shards < upgrade.cost) return {}; // Not enough shards

    // Deduct cost and increment count
    const updatedUpgrades = [...state.upgrades];
    const newCount = upgrade.count + 1;
    
    // Scale upgrade cost exponentially
    const newCost = Math.round(upgrade.cost * 1.15);
    
    updatedUpgrades[upgradeIndex] = {
      ...upgrade,
      count: newCount,
      cost: newCost
    };

    // Recalculate stats
    const totalSps = Number(
      updatedUpgrades.reduce((sum, u) => sum + u.effect * u.count, 0).toFixed(1)
    );
    
    // Every upgrade increases click power slightly
    const totalClickPower = 1 + Math.floor(
      updatedUpgrades.reduce((sum, u) => sum + u.count * 0.1, 0)
    );

    return {
      shards: Number((state.shards - upgrade.cost).toFixed(1)),
      upgrades: updatedUpgrades,
      shardsPerSecond: totalSps,
      shardsPerClick: totalClickPower
    };
  }),

  resetGame: () => set({
    shards: 0,
    shardsPerClick: 1,
    shardsPerSecond: 0,
    totalClicks: 0,
    activeMultiplier: 1,
    upgrades: [
      {
        id: 'gravity_well',
        name: 'Gravity Well',
        cost: 15,
        effect: 0.2,
        count: 0,
        description: 'Gently pulls stray dust. Generates 0.2 shards/sec.'
      },
      {
        id: 'star_synthesizer',
        name: 'Stardust Synthesizer',
        cost: 100,
        effect: 1.5,
        count: 0,
        description: 'Fuses elements into stardust. Generates 1.5 shards/sec.'
      },
      {
        id: 'nebula_harness',
        name: 'Nebula Harness',
        cost: 500,
        effect: 8,
        count: 0,
        description: 'Harnesses raw nebula power. Generates 8.0 shards/sec.'
      },
      {
        id: 'supernova_core',
        name: 'Supernova Core',
        cost: 3000,
        effect: 50,
        count: 0,
        description: 'Generates intense cosmic energy. Generates 50.0 shards/sec.'
      }
    ]
  }),

  tick: () => set((state) => {
    if (state.shardsPerSecond === 0) return {};
    
    // Slow down multiplier decay on ticks
    let newMultiplier = state.activeMultiplier;
    if (Math.random() < 0.15 && state.activeMultiplier > 1) {
      newMultiplier = Number((state.activeMultiplier - 0.5).toFixed(1));
    }

    return {
      shards: Number((state.shards + state.shardsPerSecond / 10).toFixed(1)),
      activeMultiplier: Math.max(newMultiplier, 1)
    };
  })
}));
