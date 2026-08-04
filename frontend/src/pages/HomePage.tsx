function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">
        Welcome to the Fitness Challenge Platform
      </h1>
      <p className="text-slate-600">
        Track progress, join challenges, and stay motivated with your community.
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-medium text-slate-800">What you can do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
          <li>Sign in to your account</li>
          <li>Create a new profile</li>
          <li>View live leaderboard rankings</li>
          <li>Monitor your personal dashboard</li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
