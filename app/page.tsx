import { ProfileAnalyzer } from '@/components/ProfileAnalyzer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-primary-accent/5 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-accent/3 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-container mx-auto">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-transparent">
              X Profile
            </span>{' '}
            <span className="text-primary-text">Research</span>
          </h1>
          <p className="text-body text-primary-text-secondary max-w-2xl mx-auto px-4 leading-relaxed">
            AI-powered insights and strategic analysis for X (Twitter) profiles
          </p>
        </div>

        <div className="animate-slide-up">
          <ProfileAnalyzer />
        </div>
      </div>
    </main>
  )
}

