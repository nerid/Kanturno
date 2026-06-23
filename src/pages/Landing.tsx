import React from 'react';
import { Hero } from '../components/Hero';
import { Intro } from '../components/Intro';
import { QueueGrid } from '../components/QueueGrid';
import { RequestFormCTA } from '../components/RequestFormCTA';

export const Landing = () => {
  return (
    <main className="w-full flex flex-col items-center overflow-x-hidden min-h-screen">
      <div id="inicio" className="w-full min-h-screen relative"><Hero /></div>
      <div id="intro" className="w-full py-24 relative"><Intro /></div>
      <div id="cola" className="w-full py-24 relative"><QueueGrid /></div>
      <div id="pedir" className="w-full min-h-screen relative"><RequestFormCTA /></div>
    </main>
  );
};
