import mongoose from 'mongoose';
import Challenge from '../model/Challenge.js';
import Workout from '../model/Workout.js';

const seedDatabase = async () => {
  try {
    const challengeCount = await Challenge.countDocuments();
    if (challengeCount === 0) {
      console.log('Seeding initial challenges into database...');
      await Challenge.create([
        {
          title: 'Titan Lung Circuit',
          description: '30 days of high-velocity metabolic conditioning designed to break plateaus.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxsFof8jiNDGHDTqcuXdd7Di4U5z5-9wIeQTIqSV-zHgOQbPQbBlNn-ybEG_GNnFRzVwPmJ4-qYyyfN_1mFQXOJrqS1TLeSbNXWiaBeT2MN2UUBYH5SBRswEyZ-3u7gmEY_rsy5Ws71AiHHnH_yozioYaVc5P7fh_pZH66oFY2hWHQowuud79jz3_7GsEqi5pJR16X5NnpWxoKiiwdDa1s6kCgnF69nL1jpZ3JLOWS1GRt2KyOj9kGcx7bBL8iCCixpkxylpAejIJq',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Primal Press Max',
          description: "Test your absolute overhead strength over 14 days. Exclusive 'Iron Pillar' avatar skin for all finishers.",
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWdfs2TLIj9IM6HNxDnlj91CJmstORfGDy0T44pJhW2HEXJSpR_4yKwyz88kDBGlKc8rGqdAs0bsMXmfMrYNlNIY1sVg8hDkGEqTlpAdV20GLr563FlyIvvv_-U8R-f0rR1jzEdgrQ12bOGigdDbeWltE0690bXyyZlUrFUYUfRewnuaQswn3hPCU4vSRk6QNLzzBUgdib0za08dG8OQmt9RM4uwah7FW8eXX6dVbVtznilj5WM134UZug00Srsatn3dtDP7_Bu7re',
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Global Step Surge',
          description: 'A global step challenge uniting athletes worldwide to reach 100 million total steps.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFJ7AqcklUaB7Ldsxq4mEyZd8qjqauu1qvR3phlj_4qp8C-MY76BPdm7PHbYw543qo0nNim_YoymjoPv696fK8X7_K5u8grL7EsPvDIARQWrNLullVx-lwOmGt9I8eUkBJzX1SgFfSq372VmTSZHqTnWGhho181tQgUx58OHFcqtAFog2emldzfmrvfeED_ENt--liTS6ZMEOTOGg2_SRQN_rH7Ai5YGpPxf8OcFK8wRtXXsBeFRaXrtTm0WDZVOIjsG-kuQpnIm3x',
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        }
      ]);
      console.log('Challenges seeded successfully!');
    }

    const workoutCount = await Workout.countDocuments();
    if (workoutCount === 0) {
      console.log('Seeding initial workouts into database...');
      await Workout.create([
        {
          name: 'EXPLOSIVE KINETICS: PHASE III',
          description: 'Action shot of explosive medicine ball slams and power output training.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-0zr73DAIZO_i825DqpQ0OCkbZTQSfSruBKmNQhTAyglBvIGDMw_DQ8fqB7yvdmSr9HtB5B_ixPFASWrXh2-paCUnuGiIoTx88yKHx_VI79N8fnTagdiUmVfaqainAYrnHPN2YYusMBAK41WDv2_NDovsLAxvv4yv3qQnuNHYrKpVUOOTkFn1bE5tJVxzTKiDwFD4cFoMrKeheffdQcyf-a4iSBCosQQcRvZtrOcG3VKdiwJWIhN5p5Y8soMkAt008wA0KMzYHgsC',
          totalKcal: 620,
          duration: 45,
          intensity: 'high',
        },
        {
          name: 'ANAEROBIC THRESHOLD: BURN',
          description: 'High velocity interval protocol focusing on metabolic conditioning.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFJ7AqcklUaB7Ldsxq4mEyZd8qjqauu1qvR3phlj_4qp8C-MY76BPdm7PHbYw543qo0nNim_YoymjoPv696fK8X7_K5u8grL7EsPvDIARQWrNLullVx-lwOmGt9I8eUkBJzX1SgFfSq372VmTSZHqTnWGhho181tQgUx58OHFcqtAFog2emldzfmrvfeED_ENt--liTS6ZMEOTOGg2_SRQN_rH7Ai5YGpPxf8OcFK8wRtXXsBeFRaXrtTm0WDZVOIjsG-kuQpnIm3x',
          totalKcal: 480,
          duration: 32,
          intensity: 'medium',
        },
        {
          name: 'POSTERIOR CHAIN: LOAD 101',
          description: 'Heavy barbell deadlifts and posterior chain strength loading.',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNui6ZW-LnaQH8EoJFOQ1k7JqpaVsGImsIPsID5RVWk6aeLGnc0IeXROqxOs7IALnp-czYH0eAsqQaoUFD9b1WIMMprI95LDKWjM2DnF196WUMBpgHTgdOzWfq506O71g4XpUPB43578RF2o0ETQ35DbAgvh7rxU5_zawBGRpFFZmA4mMNRPIerFIPsLcHfFENn1VdOzNELFugpqqlS7zamQ7W8VPQIMrBkostVq9d4aKheGQx0By_KaRV_dy2VrZqR_FNofnVYRKY',
          totalKcal: 710,
          duration: 50,
          intensity: 'high',
        }
      ]);
      console.log('Workouts seeded successfully!');
    }
  } catch (err) {
    console.error('Database seeding error:', err.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await seedDatabase();
    } else {
      console.log('MONGODB_URI not provided; running in in-memory / static mode');
    }
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
  }
};

export default connectDB;
