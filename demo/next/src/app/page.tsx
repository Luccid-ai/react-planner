'use client'

import dynamic from 'next/dynamic';

// Dynamically import ReactPlanner, which will be loaded only on the client-side.
const DynamicReactPlanner = dynamic(() => import('./react-planner-wrapper'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      <DynamicReactPlanner />
    </main>
  )
}
