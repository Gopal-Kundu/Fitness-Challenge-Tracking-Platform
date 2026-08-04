import { useState, useEffect } from 'react';
import Header from '../components/Header';
import WorkoutModal from '../components/WorkoutModal';
import { workoutAPI } from '../services/api';

function WorkoutsPage() {
  const [intensity, setIntensity] = useState('Mid');
  const [duration, setDuration] = useState('Any Duration');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkout, setActiveWorkout] = useState<any>(null);

  const [workouts, setWorkouts] = useState<any[]>([
    {
      id: '1',
      title: 'EXPLOSIVE KINETICS: PHASE III',
      level: 'ADVANCED',
      category: 'POWER',
      intensity: 'High',
      duration: '45 MIN',
      durationRange: '30-60 Min',
      calories: '620 KCAL',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0zr73DAIZO_i825DqpQ0OCkbZTQSfSruBKmNQhTAyglBvIGDMw_DQ8fqB7yvdmSr9HtB5B_ixPFASWrXh2-paCUnuGiIoTx88yKHx_VI79N8fnTagdiUmVfaqainAYrnHPN2YYusMBAK41WDv2_NDovsLAxvv4yv3qQnuNHYrKpVUOOTkFn1bE5tJVxzTKiDwFD4cFoMrKeheffdQcyf-a4iSBCosQQcRvZtrOcG3VKdiwJWIhN5p5Y8soMkAt008wA0KMzYHgsC',
      imageAlt: 'Action shot of a male athlete performing an explosive medicine ball slam'
    },
    {
      id: '2',
      title: 'ANAEROBIC THRESHOLD: BURN',
      level: 'INTERMEDIATE',
      category: 'CONDITIONING',
      intensity: 'Mid',
      duration: '32 MIN',
      durationRange: '30-60 Min',
      calories: '480 KCAL',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFJ7AqcklUaB7Ldsxq4mEyZd8qjqauu1qvR3phlj_4qp8C-MY76BPdm7PHbYw543qo0nNim_YoymjoPv696fK8X7_K5u8grL7EsPvDIARQWrNLullVx-lwOmGt9I8eUkBJzX1SgFfSq372VmTSZHqTnWGhho181tQgUx58OHFcqtAFog2emldzfmrvfeED_ENt--liTS6ZMEOTOGg2_SRQN_rH7Ai5YGpPxf8OcFK8wRtXXsBeFRaXrtTm0WDZVOIjsG-kuQpnIm3x',
      imageAlt: 'A female athlete in mid-stride during a sprint on a dark synthetic track'
    },
    {
      id: '3',
      title: 'POSTERIOR CHAIN: LOAD 101',
      level: 'EXPERT',
      category: 'STRENGTH',
      intensity: 'High',
      duration: '50 MIN',
      durationRange: '30-60 Min',
      calories: '710 KCAL',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNui6ZW-LnaQH8EoJFOQ1k7JqpaVsGImsIPsID5RVWk6aeLGnc0IeXROqxOs7IALnp-czYH0eAsqQaoUFD9b1WIMMprI95LDKWjM2DnF196WUMBpgHTgdOzWfq506O71g4XpUPB43578RF2o0ETQ35DbAgvh7rxU5_zawBGRpFFZmA4mMNRPIerFIPsLcHfFENn1VdOzNELFugpqqlS7zamQ7W8VPQIMrBkostVq9d4aKheGQx0By_KaRV_dy2VrZqR_FNofnVYRKY',
      imageAlt: 'Professional athlete performing heavy barbell deadlifts'
    }
  ]);

  useEffect(() => {
    workoutAPI.getAllWorkouts()
      .then((data: any) => {
        const fetched = data?.workouts || data;
        if (Array.isArray(fetched) && fetched.length > 0) {
          setWorkouts(fetched.map((w: any) => ({
            id: w._id || w.id,
            title: w.name || w.title,
            level: 'ADVANCED',
            category: 'WORKOUT',
            duration: `${w.duration || 45} MIN`,
            calories: `${w.totalKcal || 600} KCAL`,
            intensity: w.intensity === 'high' ? 'High' : w.intensity === 'low' ? 'Low' : 'Mid',
            image: w.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0zr73DAIZO_i825DqpQ0OCkbZTQSfSruBKmNQhTAyglBvIGDMw_DQ8fqB7yvdmSr9HtB5B_ixPFASWrXh2-paCUnuGiIoTx88yKHx_VI79N8fnTagdiUmVfaqainAYrnHPN2YYusMBAK41WDv2_NDovsLAxvv4yv3qQnuNHYrKpVUOOTkFn1bE5tJVxzTKiDwFD4cFoMrKeheffdQcyf-a4iSBCosQQcRvZtrOcG3VKdiwJWIhN5p5Y8soMkAt008wA0KMzYHgsC'
          })));
        }
      })
      .catch(() => {
        // Fallback initialized above
      });
  }, []);

  const handleResetFilters = () => {
    setIntensity('Mid');
    setDuration('Any Duration');
    setSearchQuery('');
  };

  const filteredWorkouts = workouts.filter((w) => {
    if (intensity && w.intensity !== intensity) return false;
    if (duration !== 'Any Duration' && w.durationRange !== duration) return false;
    if (searchQuery && !w.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Header
        placeholder="Search workouts..."
      />

      <main className="p-6 md:p-12 max-w-[1440px] mx-auto">
        <section className="py-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">WORKOUTS</h2>
              <p className="font-body-lg text-on-surface-variant max-w-xl">Optimize your output with precision-engineered training modules designed for maximum metabolic demand.</p>
            </div>

          </div>

          {/* Filter Bar */}
          <div className="glass-panel p-4 mb-10 flex flex-wrap items-center gap-4 inner-glow rounded-xl">
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-[10px] text-on-surface-variant ml-1">INTENSITY</label>
              <div className="flex gap-2">
                {['Low', 'Mid', 'High'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setIntensity(item)}
                    className={`px-4 py-2 rounded-lg font-label-caps transition-all cursor-pointer ${
                      intensity === item
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container-highest border border-outline-variant text-on-surface hover:border-primary-container'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-[10px] text-on-surface-variant ml-1">DURATION</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-background border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-caps focus:border-primary-container transition-colors outline-none cursor-pointer"
              >
                <option>Any Duration</option>
                <option>15-30 Min</option>
                <option>30-60 Min</option>
                <option>60+ Min</option>
              </select>
            </div>


          </div>

          {/* Workouts Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="group relative bg-surface-container border border-outline-variant rounded-xl overflow-hidden kinetic-glow transition-all duration-300 flex flex-col"
                  >
                    <div className="h-64 relative overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${workout.image}')` }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-primary-container text-on-primary-container font-label-caps px-3 py-1 text-[10px] font-bold">
                          {workout.level}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-white font-label-caps px-3 py-1 text-[10px]">
                          {workout.category || 'WORKOUT'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-headline-md text-headline-md text-primary leading-tight">
                            {workout.title}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-container text-sm">schedule</span>
                            <span className="font-label-caps text-on-surface-variant">{workout.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-container text-sm">local_fire_department</span>
                            <span className="font-label-caps text-on-surface-variant">{workout.calories}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveWorkout(workout)}
                        className="w-full py-4 bg-primary-container text-on-primary-container font-bold font-headline-md rounded hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        START WORKOUT
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-12 text-center bg-surface-container rounded-2xl border border-outline-variant">
                  <p className="text-on-surface-variant font-body-lg">No workouts match your selected filters.</p>
                  <button onClick={handleResetFilters} className="mt-4 px-6 py-2 bg-primary-container text-on-primary font-bold rounded">Reset Filters</button>
                </div>
              )}
            </div>
        </section>
      </main>

      {activeWorkout && (
        <WorkoutModal workout={activeWorkout} onClose={() => setActiveWorkout(null)} />
      )}
    </div>
  );
}

export default WorkoutsPage;
