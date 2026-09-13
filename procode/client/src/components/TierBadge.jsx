import React from 'react';
import { Award, Shield, Zap, Flame, Crown } from 'lucide-react';

export const TIERS = {
  Bronze: {
    name: 'Bronze',
    min: 0,
    max: 79,
    color: 'text-amber-600 border-amber-600/40 bg-amber-950/20',
    glow: 'from-amber-600/20 to-transparent',
    icon: Shield
  },
  Silver: {
    name: 'Silver',
    min: 80,
    max: 299,
    color: 'text-slate-300 border-slate-400/40 bg-slate-800/40',
    glow: 'from-slate-400/20 to-transparent',
    icon: Shield
  },
  Gold: {
    name: 'Gold',
    min: 300,
    max: 699,
    color: 'text-amber-400 border-amber-400/50 bg-amber-950/30',
    glow: 'from-amber-400/20 to-transparent',
    icon: Award
  },
  Platinum: {
    name: 'Platinum',
    min: 700,
    max: 1499,
    color: 'text-cyan-400 border-cyan-400/50 bg-cyan-950/30',
    glow: 'from-cyan-400/20 to-transparent',
    icon: Zap
  },
  Diamond: {
    name: 'Diamond',
    min: 1500,
    max: 2999,
    color: 'text-blue-400 border-blue-400/50 bg-blue-950/30',
    glow: 'from-blue-400/20 to-transparent',
    icon: Flame
  },
  Conqueror: {
    name: 'Conqueror',
    min: 3000,
    max: Infinity,
    color: 'text-rose-400 border-rose-400/60 bg-rose-950/40',
    glow: 'from-rose-500/30 to-transparent',
    icon: Crown
  }
};

export default function TierBadge({ tier = 'Bronze', size = 'sm', showIcon = true }) {
  const config = TIERS[tier] || TIERS.Bronze;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
    lg: 'text-base px-4 py-2 gap-2.5 font-semibold'
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm uppercase tracking-wider font-mono font-semibold ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{config.name}</span>
    </span>
  );
}
