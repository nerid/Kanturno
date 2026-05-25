import React from 'react';
import { Hero } from '../components/Hero';
import { Intro } from '../components/Intro';
import { QueueGrid } from '../components/QueueGrid';
import { RequestFormCTA } from '../components/RequestFormCTA';

export const Landing = () => {
  return (
    <main className="w-full flex flex-col items-center overflow-x-hidden">
      <div id="inicio" className="w-full"><Hero /></div>
      <div id="intro" className="w-full"><Intro /></div>
      <div id="cola" className="w-full"><QueueGrid /></div>
      <div id="pedir" className="w-full"><RequestFormCTA /></div>
    </main>
  );
};
