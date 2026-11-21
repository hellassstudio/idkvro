import { useState } from 'react';
import { DisciplineId } from './data/brandData';
import { ScrollBrandStage } from './components/ScrollBrandStage';
import { DisciplineModal } from './components/DisciplineModal';

export default function App() {
  const [activeDiscipline, setActiveDiscipline] =
    useState<DisciplineId | null>(null);

  return (
    <main className="min-h-screen w-full bg-white text-[#161618]">
      <ScrollBrandStage onSelectDiscipline={setActiveDiscipline} />
      <DisciplineModal
        activeId={activeDiscipline}
        onClose={() => setActiveDiscipline(null)}
        onSelect={(id) => setActiveDiscipline(id)}
      />
    </main>
  );
}
