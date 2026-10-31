import LandingExperience from "@/components/LandingExperience";

export default function Home() {
  return (
    // The text placeholder has no essential assets to wait for yet.
    <LandingExperience ready>
      <main className="flex min-h-svh items-center justify-center bg-white px-6 py-12 text-slate-900 sm:px-10 lg:px-16">
        <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Fruity Juicy
        </h1>
      </main>
    </LandingExperience>
  );
}
