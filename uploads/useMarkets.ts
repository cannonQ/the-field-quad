import { useState } from 'react';

export interface MarketOption {
  name: string;
  amount: number;
  percent: number;
}

export interface Market {
  id: string;
  description: string;
  category: string;
  poolTotal: number;
  endsIn: string;
  options: MarketOption[];
  ableToPledge: boolean;
  isPast: boolean;
  winner?: string;
}

export function useMarkets() {
  // DUMMY DATA - will be replaced with Redux selector
  const markets: Market[] = [
    {
      id: '1',
      description: 'NCAA March Madness (Final Four)',
      category: 'NBA',
      poolTotal: 142500,
      endsIn: '4h 20m',
      options: [
        { name: 'UCONN', amount: 64125, percent: 45 },
        { name: 'PURDUE', amount: 49875, percent: 35 },
        { name: 'HOUSTON', amount: 17100, percent: 12 },
        { name: 'THE FIELD', amount: 11400, percent: 8 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '2',
      description: 'F 1: Monaco GP',
      category: 'Other',
      poolTotal: 50000,
      endsIn: '2d 5h',
      options: [
        { name: 'Verstappen', amount: 20000, percent: 40 },
        { name: 'Hamilton', amount: 15000, percent: 30 },
        { name: 'Norris', amount: 10000, percent: 20 },
        { name: 'THE FIELD', amount: 5000, percent: 10 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '3',
      description: 'US Pres. Election',
      category: 'Politics',
      poolTotal: 500000,
      endsIn: '120d',
      options: [
        { name: 'Republican', amount: 250000, percent: 50 },
        { name: 'Democrat', amount: 225000, percent: 45 },
        { name: 'Independent', amount: 15000, percent: 3 },
        { name: 'THE FIELD', amount: 10000, percent: 2 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '4',
      description: 'Oscars: Best Pic',
      category: 'Gaming',
      poolTotal: 75000,
      endsIn: '5d 2h',
      options: [
        { name: 'Oppenheimer', amount: 45000, percent: 60 },
        { name: 'Barbie', amount: 15000, percent: 20 },
        { name: 'Poor Things', amount: 7500, percent: 10 },
        { name: 'THE FIELD', amount: 7500, percent: 10 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '5',
      description: 'Bitcoin Price > $100k',
      category: 'Crypto',
      poolTotal: 250000,
      endsIn: '30d',
      options: [
        { name: 'Yes', amount: 150000, percent: 60 },
        { name: 'No', amount: 100000, percent: 40 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '6',
      description: 'Ethereum Merge Date',
      category: 'Crypto',
      poolTotal: 180000,
      endsIn: '15d',
      options: [
        { name: 'Q1 2024', amount: 90000, percent: 50 },
        { name: 'Q2 2024', amount: 60000, percent: 33 },
        { name: 'Later', amount: 30000, percent: 17 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '7',
      description: 'Premier League: Man City Win',
      category: 'Soccer/Football',
      poolTotal: 320000,
      endsIn: '45d',
      options: [
        { name: 'Man City', amount: 192000, percent: 60 },
        { name: 'Liverpool', amount: 96000, percent: 30 },
        { name: 'Arsenal', amount: 32000, percent: 10 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '8',
      description: 'World Cup 2026 Winner',
      category: 'World Cup',
      poolTotal: 450000,
      endsIn: '500d',
      options: [
        { name: 'France', amount: 135000, percent: 30 },
        { name: 'Argentina', amount: 135000, percent: 30 },
        { name: 'Brazil', amount: 90000, percent: 20 },
        { name: 'THE FIELD', amount: 90000, percent: 20 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '9',
      description: 'NFL: Chiefs Super Bowl',
      category: 'NFL',
      poolTotal: 220000,
      endsIn: '60d',
      options: [
        { name: 'Chiefs', amount: 110000, percent: 50 },
        { name: '49ers', amount: 66000, percent: 30 },
        { name: 'Bills', amount: 33000, percent: 15 },
        { name: 'THE FIELD', amount: 11000, percent: 5 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '10',
      description: 'Solana TVL Growth',
      category: 'Ergo Ecosystem',
      poolTotal: 95000,
      endsIn: '7d',
      options: [
        { name: '+50%', amount: 57000, percent: 60 },
        { name: 'Less', amount: 38000, percent: 40 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
        { name: 'THE FIELD', amount: 0, percent: 0 },
      ],
      ableToPledge: true,
      isPast: false,
    },
  ];

  const loading = false;
  const featuredMarket = markets[0];
  
  // Group by category
  const categories = ['Ergo Ecosystem', 'Crypto', 'NBA', 'Soccer/Football', 'World Cup', 'NFL', 'Politics', 'Gaming', 'Other'];
  const marketsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = markets.filter(m => m.category === cat);
    return acc;
  }, {} as Record<string, Market[]>);

  const otherMarkets = markets.slice(1);

  return { markets, loading, featuredMarket, otherMarkets, categories, marketsByCategory };
}
