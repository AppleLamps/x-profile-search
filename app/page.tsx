import { ProfileAnalyzer } from '@/components/ProfileAnalyzer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-brand-start/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-container mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-heading-xl sm:text-6xl md:text-7xl mb-6 font-extrabold tracking-tight">
            <span className="text-gradient">X Profile</span> Research
          </h1>
          <p className="text-body text-primary-text-secondary max-w-2xl mx-auto px-4 text-lg sm:text-xl leading-relaxed">
            Enter an X (Twitter) username to receive a comprehensive, AI-generated research report analyzing profile metrics, content strategy, and audience engagement.
          </p>
        </div>

        <div className="animate-slide-up">
          <ProfileAnalyzer />
        </div>
      </div>
    </main>
  )
}

