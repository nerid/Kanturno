import React from 'react';
import { Hero } from '../components/Hero';
import { Intro } from '../components/Intro';
import { QueueGrid } from '../components/QueueGrid';
import { RequestFormCTA } from '../components/RequestFormCTA';

export const Landing = () => {
  return (
    <main className="w-full flex flex-col items-center">
      <Hero />
      <Intro />
      <QueueGrid />
      <RequestFormCTA />
    </main>
  );
};
