
export default function DocsPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-16">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="font-heading text-4xl font-bold mb-8">Documentation</h1>
        <p className="text-foreground/70 mb-12">
          Welcome to the SARA OS documentation. Here you will find comprehensive guides and API references for building, training, and deploying models on the platform.
        </p>

        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <p className="text-foreground/70 mb-4">Get up and running with the SARA SDK in under 5 minutes.</p>
            <pre className="bg-black/50 p-4 rounded-md font-mono text-sm text-primary">
              <code>pip install sara-os</code>
            </pre>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Core Concepts</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li>Feature Store Architecture</li>
              <li>Experiment Tracking & MLflow Integration</li>
              <li>Model Registry Lifecycle</li>
              <li>Kubernetes Native Deployments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
