import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

const generateMockData = () => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  return days.map((day, i) => ({
    day,
    weight: 72 + Math.random() * 2 - 1,
    calories: 1800 + Math.floor(Math.random() * 600),
    workout: Math.floor(Math.random() * 90) + 30,
  }));
};

export const ProgressChart = () => {
  const data = useMemo(() => generateMockData(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h3 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-strivo-red rounded-full" />
        WEEKLY PROGRESS
      </h3>

      <div className="space-y-6">
        {/* Weight Chart */}
        <div>
          <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">
            WEIGHT (KG)
          </p>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--strivo-red))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--strivo-red))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fontFamily: 'DotGothic16' }}
                  axisLine={false}
                  tickLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 10, fontFamily: 'DotGothic16' }}
                  axisLine={false}
                  tickLine={false}
                  stroke="currentColor"
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    fontFamily: 'DotGothic16',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Weight']}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--strivo-red))"
                  strokeWidth={2}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Minutes Chart */}
        <div>
          <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">
            WORKOUT (MIN)
          </p>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fontFamily: 'DotGothic16' }}
                  axisLine={false}
                  tickLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  tick={{ fontSize: 10, fontFamily: 'DotGothic16' }}
                  axisLine={false}
                  tickLine={false}
                  stroke="currentColor"
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    fontFamily: 'DotGothic16',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value} min`, 'Workout']}
                />
                <Line
                  type="monotone"
                  dataKey="workout"
                  stroke="currentColor"
                  strokeWidth={2}
                  dot={{ fill: 'currentColor', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
