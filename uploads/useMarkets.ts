'use client';

import { useState } from 'react';

export interface MarketOption {
  name: string;
  amount: number;
  percent: number;
}

export interface Market {
  id: string;
  description: string;
  poolTotal: number;
  endsIn: string;
  options: MarketOption[];
  ableToPledge: boolean;
  isPast: boolean;
  winner?: string;
}

export function useMarkets() {
  const markets: Market[] = [
    {
      id: '1',
      description: 'NCAA March Madness (Final Four)',
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
      description: 'F1: Monaco GP',
      poolTotal: 50000,
      endsIn: '2d 5h',
      options: [
        { name: 'Verstappen', amount: 25000, percent: 50 },
        { name: 'Hamilton', amount: 15000, percent: 30 },
        { name: 'THE FIELD', amount: 10000, percent: 20 },
      ],
      ableToPledge: true,
      isPast: false,
    },
    {
      id: '3',
      description: 'US Pres. Election',
      poolTotal: 500000,
      endsIn: '120d',
      options: [
        { name: 'Republican', amount: 250000, percent: 50 },
        { name: 'Democrat', amount: 225000, percent: 45 },
        { name: 'THE FIELD', amount: 25000, percent: 5 },
      ],
      ableToPledge: true,
      isPast: false,
    },
  ];

  const loading = false;
  const featuredMarket = markets[0];
  const otherMarkets = markets.slice(1);

  return { markets, loading, featuredMarket, otherMarkets };
}
