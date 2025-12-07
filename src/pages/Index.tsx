const Index = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-foreground opacity-0 animate-fade-in">
          Your Canvas Awaits
        </h1>
        
        <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed opacity-0 animate-fade-in animation-delay-200">
          A minimal foundation for your next project. Start building something beautiful.
        </p>
        
        <div className="pt-4 opacity-0 animate-fade-in animation-delay-400">
          <span className="inline-block w-12 h-px bg-accent" />
        </div>
      </div>
    </main>
  );
};

export default Index;
