import React from 'react';
import { Zap, Bot, BadgeCheck , Percent, Users, Map, Coins, Share2, Network } from 'lucide-react';

const WaitlistPerks = () => {
  const perks = [
    {
      icon: <Zap className="w-6 h-6 text-[#C084FC]" />,
      title: "Guaranteed Access",
      description: "Be the first to enter Hyperkit Studio before public launch via our limited beta waves.",
      gradient: "from-[#0E0E11] via-transparent to-purple-900/60",
      iconBg: "bg-purple-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Bot className="w-6 h-6 text-[#60A5FA]" />,
      title: "Priority AI Access",
      description: "Get priority access to new autonomous AI agents, templates, and multi-chain features.",
      gradient: "from-[#0E0E11] via-transparent to-blue-900/60",
      iconBg: "bg-blue-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <BadgeCheck  className="w-6 h-6 text-[#FBBF24]" />,
      title: "Founding Status",
      description: 'Exclusive "Founding Builder" profile badge in-app and a special role in our Discord.',
      gradient: "from-[#0E0E11] via-transparent to-amber-900/60",
      iconBg: "bg-amber-900/50 shadow-lg shadow-amber-900/30",
      border: "border-gray-800/70"
    },
    {
      icon: <Percent className="w-6 h-6 text-[#34D399]" />,
      title: "Exclusive Discounts",
      description: "Waitlist-only discounts or extended free trial with extra usage credits for the first months.",
      gradient: "from-[#0E0E11] via-transparent to-emerald-900/60",
      iconBg: "bg-emerald-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Users className="w-6 h-6 text-[#FB7185]" />,
      title: "Private Sessions",
      description: "Invitation to private office hours, workshops, and behind-the-scenes dev updates.",
      gradient: "from-[#0E0E11] via-transparent to-rose-900/60",
      iconBg: "bg-rose-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Map className="w-6 h-6 text-[#22D3EE]" />,
      title: "Shape the Roadmap",
      description: "Direct line to the core team via priority feedback calls and surveys to shape the product.",
      gradient: "from-[#0E0E11] via-transparent to-cyan-900/60",
      iconBg: "bg-cyan-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Coins className="w-6 h-6 text-[#FACC15]" />,
      title: "On-Chain Rewards",
      description: "Eligibility for future NFTs or loyalty points recognizing you as an early adopter.",
      gradient: "from-[#0E0E11] via-transparent to-yellow-900/60",
      iconBg: "bg-yellow-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Share2 className="w-6 h-6 text-[#F472B6]" />,
      title: "Referral Perks",
      description: "Move up the queue and unlock higher-tier rewards by inviting other builders.",
      gradient: "from-[#0E0E11] via-transparent to-fuchsia-900/60",
      iconBg: "bg-fuchsia-900/50",
      border: "border-gray-800/70"
    },
    {
      icon: <Network className="w-6 h-6 text-[#818CF8]" />,
      title: "Integrations",
      description: "First to deploy on Hyperion, Mantle, Base, and Avalanche using our advanced testnet tools.",
      gradient: "from-[#0E0E11] via-transparent to-indigo-900/60",
      iconBg: "bg-indigo-900/50",
      border: "border-gray-800/70"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Waitlist <span className="text-purple-500">Perks</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg px-4">
            Unlock exclusive benefits designed for early adopters and power users.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {perks.map((perk, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border ${perk.border} bg-gradient-to-b ${perk.gradient} p-5 sm:p-6 backdrop-blur-sm transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`${perk.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                {perk.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                {perk.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitlistPerks;