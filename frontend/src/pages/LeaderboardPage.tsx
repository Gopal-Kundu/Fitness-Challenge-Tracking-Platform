import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { leaderboardAPI } from '../services/api';

function LeaderboardPage() {
  const [standings, setStandings] = useState<any[]>([]);

  const defaultUsers = [
    {
      id: '1',
      rank: 1,
      name: 'Alex Thorne',
      email: 'alex@apex.com',
      role: 'member',
      avatar: 'https://shorturl.at/FmV3K',
      points: 14200,
      completedCalories: 4160,
      completedWorkoutsCount: 14,
      completedChallengesCount: 5,
      membership: 'Elite',
    },
    {
      id: '2',
      rank: 2,
      name: 'Sarah Connor',
      email: 'sarah@apex.com',
      role: 'member',
      avatar: 'https://shorturl.at/FmV3K',
      points: 12800,
      completedCalories: 3800,
      completedWorkoutsCount: 12,
      completedChallengesCount: 4,
      membership: 'Premium',
    },
    {
      id: '3',
      rank: 3,
      name: 'Mike Vance',
      email: 'mike@apex.com',
      role: 'member',
      avatar: 'https://shorturl.at/FmV3K',
      points: 11500,
      completedCalories: 3500,
      completedWorkoutsCount: 10,
      completedChallengesCount: 3,
      membership: 'Elite',
    },
    {
      id: '4',
      rank: 4,
      name: 'Elena Rostova',
      email: 'elena@apex.com',
      role: 'member',
      avatar: 'https://shorturl.at/FmV3K',
      points: 9800,
      completedCalories: 2800,
      completedWorkoutsCount: 8,
      completedChallengesCount: 2,
      membership: 'Basic',
    },
  ];

  useEffect(() => {
    leaderboardAPI
      .getLeaderboard()
      .then((data: any) => {
        const fetched = data?.leaderboard || data;
        const rawList = Array.isArray(fetched) && fetched.length > 0 ? fetched : defaultUsers;
        const filtered = rawList
          .filter((u: any) => u.role !== 'admin')
          .map((u: any, idx: number) => ({ ...u, rank: idx + 1 }));
        setStandings(filtered);
      })
      .catch(() => {
        const filtered = defaultUsers
          .filter((u: any) => u.role !== 'admin')
          .map((u: any, idx: number) => ({ ...u, rank: idx + 1 }));
        setStandings(filtered);
      });
  }, []);

  const topThree = standings.slice(0, 3);
  const remainingStandings = standings.length > 3 ? standings.slice(3) : standings;

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Header placeholder="Search athletes..." />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto space-y-8">
        <section className="rounded-3xl border border-outline-variant bg-surface-container p-6 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-container font-label-caps">
                Live Performance Ecosystem
              </p>
              <h1 className="mt-2 text-3xl font-semibold uppercase tracking-tight text-white sm:text-4xl font-display-lg">
                Global Leaderboard
              </h1>
              <p className="mt-2 text-on-surface-variant font-body-lg">
                Track top performing athletes dynamically updated from total calories burned, workouts completed, and fitness challenges.
              </p>
            </div>

          </div>
        </section>



        {/* Podium Top 3 */}
        {topThree.length > 0 && (
          <section className="grid gap-6 lg:grid-cols-3">
            {topThree.map((athlete, idx) => {
              const borderAccent =
                idx === 0
                  ? 'border-primary-container bg-surface-container-high'
                  : idx === 1
                  ? 'border-secondary-container bg-surface-container-low'
                  : 'border-tertiary-fixed bg-surface-container-low';

              return (
                <div
                  key={athlete.id || athlete.name}
                  className={`rounded-3xl border p-6 ${borderAccent} inner-rim transition-transform hover:scale-[1.02] duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant font-label-caps">
                      Rank #0{athlete.rank || idx + 1}
                    </span>
                    <span className="rounded-full bg-primary-container/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-container font-label-caps">
                      {athlete.membership || 'Elite'}
                    </span>
                  </div>
                  <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface overflow-hidden">
                    <img className="w-full h-full object-cover" src={athlete.avatar || 'https://shorturl.at/FmV3K'} alt={athlete.name} />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white font-headline-md">{athlete.name}</h2>
                  <p className="mt-1 text-xs text-on-surface-variant">{athlete.email || athlete.role}</p>
                  <div className="mt-5 border-t border-outline-variant pt-4 flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black text-primary-container font-metric-xl">
                        {(athlete.points || 0).toLocaleString()}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label-caps">
                        Total Points
                      </p>
                    </div>
                    <div className="text-right text-xs font-bold text-on-surface-variant">
                      <p>{athlete.completedWorkoutsCount || 0} Workouts</p>
                      <p>{(athlete.completedCalories || 0).toLocaleString()} KCAL</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Full Standings Table */}
        <section className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-6 py-4">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white font-headline-md">
              Full Standings ({standings.length} Athletes)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-surface-container-low text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label-caps border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Athlete / Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Total Points</th>
                  <th className="px-6 py-4">Workouts</th>
                  <th className="px-6 py-4">Calories Burned</th>
                  <th className="px-6 py-4 text-right">Challenges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {remainingStandings.map((entry: any) => (
                  <tr key={entry.id || entry.name} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-5 text-lg font-semibold text-primary-container font-label-caps">
                      #{entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar || 'https://shorturl.at/FmV3K'}
                          alt={entry.name}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                        />
                        <div>
                          <p className="font-bold text-white">{entry.name}</p>
                          <p className="text-xs text-on-surface-variant">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        entry.role === 'trainer' ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-container-highest text-primary'
                      }`}>
                        {entry.role || 'member'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-lg font-bold text-white font-label-caps">
                      {(entry.points || 0).toLocaleString()} PTS
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant font-bold">
                      {entry.completedWorkoutsCount || 0} Sessions
                    </td>
                    <td className="px-6 py-5 text-emerald-400 font-bold">
                      {(entry.completedCalories || 0).toLocaleString()} KCAL
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-secondary-container">
                      {entry.completedChallengesCount || 0} Joined
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LeaderboardPage;
