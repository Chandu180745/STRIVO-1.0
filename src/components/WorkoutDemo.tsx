import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

interface WorkoutDemoProps {
  exerciseName: string;
  muscleGroup: string;
}

export const WorkoutDemo = ({ exerciseName, muscleGroup }: WorkoutDemoProps) => {
  const { gender } = useSettings();
  const [frame, setFrame] = useState(0);
  const isFemale = gender === 'female';

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 120);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  const t = frame / 120;
  const phase = Math.sin(t * Math.PI * 2);
  const phase2 = Math.cos(t * Math.PI * 2);
  const breathe = Math.sin(t * Math.PI * 4) * 0.5;

  const getAnimation = (): string => {
    const name = exerciseName.toLowerCase();
    // Chest
    if (name.includes('diamond push')) return 'diamond_pushup';
    if (name.includes('push-up') || name.includes('pushup') || name.includes('push up')) return 'pushup';
    if (name.includes('bench press') || name.includes('bench')) return 'bench_press';
    if (name.includes('incline press') || name.includes('incline')) return 'incline_press';
    if (name.includes('cable cross')) return 'cable_crossover';
    if (name.includes('fly') || name.includes('flye')) return 'dumbbell_fly';
    // Back
    if (name.includes('pull-up') || name.includes('pullup') || name.includes('chin')) return 'pullup';
    if (name.includes('lat pulldown') || name.includes('lat pull')) return 'lat_pulldown';
    if (name.includes('t-bar') || name.includes('tbar')) return 'tbar_row';
    if (name.includes('seated cable row') || name.includes('cable row')) return 'seated_row';
    if (name.includes('bent row') || name.includes('bent over')) return 'bent_row';
    if (name.includes('deadlift') && !name.includes('romanian')) return 'deadlift';
    if (name.includes('romanian') || name.includes('rdl')) return 'romanian_deadlift';
    // Shoulders
    if (name.includes('arnold')) return 'arnold_press';
    if (name.includes('upright row')) return 'upright_row';
    if (name.includes('reverse fly') || name.includes('reverse flye')) return 'reverse_fly';
    if (name.includes('lateral raise') || name.includes('lateral')) return 'lateral_raise';
    if (name.includes('face pull')) return 'face_pull';
    if (name.includes('overhead') || name.includes('military') || name.includes('shoulder press')) return 'overhead_press';
    // Arms
    if (name.includes('skull crush')) return 'skull_crusher';
    if (name.includes('preacher')) return 'preacher_curl';
    if (name.includes('concentration')) return 'concentration_curl';
    if (name.includes('cable pushdown') || name.includes('pushdown')) return 'cable_pushdown';
    if (name.includes('hammer')) return 'hammer_curl';
    if (name.includes('curl') || name.includes('bicep')) return 'bicep_curl';
    if (name.includes('tricep dip') || name.includes('dip')) return 'tricep_dip';
    if (name.includes('tricep') || name.includes('extension')) return 'tricep_extension';
    // Legs
    if (name.includes('bulgarian')) return 'bulgarian_split';
    if (name.includes('leg press')) return 'leg_press';
    if (name.includes('leg extension') || name.includes('leg ext')) return 'leg_extension';
    if (name.includes('leg curl')) return 'leg_curl';
    if (name.includes('squat')) return 'squat';
    if (name.includes('lunge')) return 'lunge';
    if (name.includes('calf')) return 'calf_raise';
    // Core
    if (name.includes('russian twist')) return 'russian_twist';
    if (name.includes('mountain climber')) return 'mountain_climber';
    if (name.includes('hanging leg') || name.includes('hanging')) return 'hanging_leg_raise';
    if (name.includes('ab wheel') || name.includes('rollout')) return 'ab_wheel';
    if (name.includes('plank')) return 'plank';
    if (name.includes('crunch')) return 'crunch';
    if (name.includes('leg raise')) return 'leg_raise';
    // Cardio
    if (name.includes('burpee')) return 'burpee';
    if (name.includes('jump rope') || name.includes('rope')) return 'jump_rope';
    if (name.includes('box jump')) return 'box_jump';
    if (name.includes('sprint')) return 'sprint';
    if (name.includes('battle rope')) return 'battle_ropes';
    // Flexibility
    if (name.includes('sun salutation') || name.includes('yoga')) return 'sun_salutation';
    if (name.includes('pigeon')) return 'pigeon_pose';
    if (name.includes('foam roll')) return 'foam_rolling';
    if (name.includes('dynamic stretch') || name.includes('stretch')) return 'dynamic_stretch';
    // Fallbacks
    if (name.includes('run') || name.includes('jog') || name.includes('cardio')) return 'sprint';
    if (name.includes('press')) return 'overhead_press';
    if (name.includes('row')) return 'bent_row';
    return 'generic';
  };

  const animType = getAnimation();

  const skinColor = isFemale ? '#FFCDB2' : '#E8C39E';
  const skinDark = isFemale ? '#E5A88A' : '#C9A072';
  const hairColor = isFemale ? '#5C3317' : '#2C1810';
  const shirtColor = isFemale ? 'hsl(330, 75%, 55%)' : 'hsl(210, 80%, 45%)';
  const shirtDark = isFemale ? 'hsl(330, 70%, 40%)' : 'hsl(210, 75%, 30%)';
  const pantsColor = isFemale ? 'hsl(280, 20%, 25%)' : 'hsl(220, 15%, 20%)';
  const shoeColor = isFemale ? 'hsl(330, 60%, 45%)' : 'hsl(0, 0%, 25%)';
  const equipColor = 'hsl(var(--foreground) / 0.7)';

  const cx = 75;
  const shoulderW = isFemale ? 10 : 13;
  const hipW = isFemale ? 8 : 7;
  const headR = isFemale ? 8 : 9;
  const torsoLen = isFemale ? 22 : 25;

  type Limb = { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number };
  type Pose = {
    headY: number; headX: number; hipY: number; torsoAngle: number;
    lArm: Limb; rArm: Limb; lLeg: Limb; rLeg: Limb;
    equip: JSX.Element | null; isPlank: boolean;
  };

  const standing = (headY: number): { hipY: number; lLeg: Limb; rLeg: Limb } => {
    const hipY = headY + torsoLen;
    return {
      hipY,
      lLeg: { x1: cx - hipW, y1: hipY, x2: cx - hipW - 3, y2: hipY + 16, x3: cx - hipW - 2, y3: hipY + 30 },
      rLeg: { x1: cx + hipW, y1: hipY, x2: cx + hipW + 3, y2: hipY + 16, x3: cx + hipW + 2, y3: hipY + 30 },
    };
  };

  const getBodyPose = (): Pose => {
    let headY = 28;
    let headX = cx;
    let hipY = headY + torsoLen;
    let torsoAngle = 0;
    let lArm: Limb = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
    let rArm: Limb = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
    let lLeg: Limb = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
    let rLeg: Limb = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
    let equip: JSX.Element | null = null;
    let isPlank = false;

    const s = standing(headY);

    switch (animType) {
      // ========== CHEST ==========
      case 'pushup': {
        const push = phase * 0.5 + 0.5;
        headY = 44 + (1 - push) * 10;
        hipY = headY + 4;
        headX = cx - 18;
        isPlank = true;
        lArm = { x1: cx - 14, y1: headY + 4, x2: cx - 18, y2: headY + 12 + (1 - push) * 4, x3: cx - 20, y3: 70 };
        rArm = { x1: cx + 2, y1: headY + 4, x2: cx - 2, y2: headY + 12 + (1 - push) * 4, x3: cx - 4, y3: 70 };
        lLeg = { x1: cx + 10, y1: hipY + 2, x2: cx + 22, y2: hipY + 6, x3: cx + 34, y3: 70 };
        rLeg = { x1: cx + 10, y1: hipY + 4, x2: cx + 24, y2: hipY + 8, x3: cx + 36, y3: 70 };
        break;
      }
      case 'diamond_pushup': {
        const push = phase * 0.5 + 0.5;
        headY = 44 + (1 - push) * 10;
        hipY = headY + 4;
        headX = cx - 18;
        isPlank = true;
        // Hands close together (diamond position)
        lArm = { x1: cx - 14, y1: headY + 4, x2: cx - 10, y2: headY + 12 + (1 - push) * 4, x3: cx - 8, y3: 70 };
        rArm = { x1: cx + 2, y1: headY + 4, x2: cx - 4, y2: headY + 12 + (1 - push) * 4, x3: cx - 6, y3: 70 };
        lLeg = { x1: cx + 10, y1: hipY + 2, x2: cx + 22, y2: hipY + 6, x3: cx + 34, y3: 70 };
        rLeg = { x1: cx + 10, y1: hipY + 4, x2: cx + 24, y2: hipY + 8, x3: cx + 36, y3: 70 };
        // Diamond hand indicator
        equip = <polygon points={`${cx - 7},69 ${cx - 5},67 ${cx - 7},65`} fill={equipColor} opacity={0.4} />;
        break;
      }
      case 'bench_press': {
        // Lying on bench, pressing barbell up
        headY = 55;
        hipY = 57;
        headX = cx - 20;
        isPlank = true;
        const press = phase * 0.5 + 0.5;
        const armExtend = press * 12;
        lArm = { x1: cx - 16, y1: 53, x2: cx - 18, y2: 48 - armExtend * 0.5, x3: cx - 20, y3: 42 - armExtend };
        rArm = { x1: cx - 4, y1: 53, x2: cx - 2, y2: 48 - armExtend * 0.5, x3: cx, y3: 42 - armExtend };
        lLeg = { x1: cx + 4, y1: 58, x2: cx + 12, y2: 64, x3: cx + 14, y3: 72 };
        rLeg = { x1: cx + 4, y1: 60, x2: cx + 14, y2: 66, x3: cx + 16, y3: 72 };
        // Bench
        equip = (
          <g>
            <rect x={cx - 24} y={60} width={32} height={4} rx={2} fill={equipColor} opacity={0.5} />
            <rect x={cx - 22} y={64} width={3} height={8} rx={1} fill={equipColor} opacity={0.4} />
            <rect x={cx + 4} y={64} width={3} height={8} rx={1} fill={equipColor} opacity={0.4} />
            {/* Barbell */}
            <line x1={lArm.x3 - 10} y1={lArm.y3} x2={rArm.x3 + 10} y2={rArm.y3} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={lArm.x3 - 10} cy={lArm.y3} r={3.5} fill={equipColor} />
            <circle cx={rArm.x3 + 10} cy={rArm.y3} r={3.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'incline_press': {
        // Seated at incline, pressing up
        headY = 30;
        hipY = headY + torsoLen;
        const press = phase * 0.5 + 0.5;
        const up = press * 14;
        torsoAngle = -20; // leaning back
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 3, y2: headY - 2 - up * 0.3, x3: cx - shoulderW - 1, y3: headY - 10 - up };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 3, y2: headY - 2 - up * 0.3, x3: cx + shoulderW + 1, y3: headY - 10 - up };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 6, y2: hipY + 12, x3: cx - hipW - 8, y3: hipY + 26 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 6, y2: hipY + 12, x3: cx + hipW + 8, y3: hipY + 26 };
        equip = (
          <g>
            {/* Incline bench */}
            <line x1={cx + 8} y1={hipY + 2} x2={cx - 4} y2={headY + 4} stroke={equipColor} strokeWidth={3} opacity={0.4} strokeLinecap="round" />
            {/* Barbell */}
            <line x1={lArm.x3 - 8} y1={lArm.y3} x2={rArm.x3 + 8} y2={rArm.y3} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={lArm.x3 - 8} cy={lArm.y3} r={3} fill={equipColor} />
            <circle cx={rArm.x3 + 8} cy={rArm.y3} r={3} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'cable_crossover': {
        // Standing, arms sweep in from wide to center
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const sweep = phase * 0.5 + 0.5;
        const armSpread = 20 - sweep * 16;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - armSpread * 0.6, y2: headY + 14, x3: cx - armSpread, y3: headY + 20 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + armSpread * 0.6, y2: headY + 14, x3: cx + armSpread, y3: headY + 20 };
        equip = (
          <g>
            {/* Cable lines */}
            <line x1={20} y1={10} x2={lArm.x3} y2={lArm.y3} stroke={equipColor} strokeWidth={1} opacity={0.5} strokeDasharray="2,2" />
            <line x1={130} y1={10} x2={rArm.x3} y2={rArm.y3} stroke={equipColor} strokeWidth={1} opacity={0.5} strokeDasharray="2,2" />
            {/* Pulleys */}
            <circle cx={20} cy={10} r={3} fill={equipColor} opacity={0.5} />
            <circle cx={130} cy={10} r={3} fill={equipColor} opacity={0.5} />
          </g>
        );
        break;
      }
      case 'dumbbell_fly': {
        // Standing dumbbell fly motion - arms sweep arc
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const fly = phase * 0.5 + 0.5;
        const spread = 18 - fly * 14;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - spread * 0.7, y2: headY + 12, x3: cx - shoulderW - spread, y3: headY + 16 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + spread * 0.7, y2: headY + 12, x3: cx + shoulderW + spread, y3: headY + 16 };
        equip = (
          <g>
            <rect x={lArm.x3 - 4} y={lArm.y3 - 1.5} width={8} height={3} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 4} y={rArm.y3 - 1.5} width={8} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }

      // ========== BACK ==========
      case 'pullup': {
        const pull = phase * 0.5 + 0.5;
        headY = 20 + (1 - pull) * 16;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 4, x2: cx - shoulderW - 6, y2: headY - 6, x3: cx - 14, y3: 10 };
        rArm = { x1: cx + shoulderW, y1: headY + 4, x2: cx + shoulderW + 6, y2: headY - 6, x3: cx + 14, y3: 10 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 1, y2: hipY + 14, x3: cx - hipW, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 1, y2: hipY + 14, x3: cx + hipW, y3: hipY + 28 };
        equip = <line x1={cx - 25} y1={8} x2={cx + 25} y2={8} stroke={equipColor} strokeWidth={3} strokeLinecap="round" />;
        break;
      }
      case 'lat_pulldown': {
        // Seated, pulling bar down to chest
        headY = 32;
        hipY = headY + torsoLen;
        const pull = phase * 0.5 + 0.5;
        const pullDist = pull * 16;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 6 + pull * 4, y2: headY - 4 + pullDist * 0.5, x3: cx - 16, y3: headY - 8 + pullDist };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 6 - pull * 4, y2: headY - 4 + pullDist * 0.5, x3: cx + 16, y3: headY - 8 + pullDist };
        // Seated legs
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 8, y2: hipY + 6, x3: cx - hipW - 12, y3: hipY + 18 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 8, y2: hipY + 6, x3: cx + hipW + 12, y3: hipY + 18 };
        equip = (
          <g>
            {/* Pulldown bar */}
            <line x1={lArm.x3} y1={lArm.y3} x2={rArm.x3} y2={rArm.y3} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            {/* Cable */}
            <line x1={cx} y1={8} x2={cx} y2={Math.min(lArm.y3, rArm.y3)} stroke={equipColor} strokeWidth={1} opacity={0.5} />
            {/* Machine top */}
            <line x1={cx - 20} y1={8} x2={cx + 20} y2={8} stroke={equipColor} strokeWidth={3} strokeLinecap="round" />
            {/* Seat */}
            <rect x={cx - 10} y={hipY + 2} width={20} height={3} rx={1.5} fill={equipColor} opacity={0.4} />
          </g>
        );
        break;
      }
      case 'tbar_row': {
        // Bent over T-bar row
        const lift = phase * 0.5 + 0.5;
        const bend = 20;
        headY = 36;
        hipY = headY + torsoLen * 0.8;
        torsoAngle = bend;
        const pullUp = lift * 10;
        lArm = { x1: cx - shoulderW + 4, y1: headY + 10, x2: cx - 6, y2: headY + 20 - pullUp * 0.3, x3: cx - 4, y3: headY + 26 - pullUp };
        rArm = { x1: cx + shoulderW - 4, y1: headY + 10, x2: cx + 6, y2: headY + 20 - pullUp * 0.3, x3: cx + 4, y3: headY + 26 - pullUp };
        lLeg = { x1: cx - hipW, y1: hipY + 2, x2: cx - hipW - 4, y2: hipY + 16, x3: cx - hipW - 3, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY + 2, x2: cx + hipW + 4, y2: hipY + 16, x3: cx + hipW + 3, y3: hipY + 28 };
        equip = (
          <g>
            {/* T-bar */}
            <line x1={cx} y1={lArm.y3} x2={cx - 30} y2={80} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={cx} cy={lArm.y3} r={4} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'seated_row': {
        // Seated cable row
        headY = 34;
        hipY = headY + torsoLen;
        const pull = phase * 0.5 + 0.5;
        const rowDist = pull * 12;
        lArm = { x1: cx - shoulderW, y1: headY + 8, x2: cx - shoulderW - 4 + rowDist * 0.5, y2: headY + 16, x3: cx - shoulderW + rowDist, y3: headY + 14 };
        rArm = { x1: cx + shoulderW, y1: headY + 8, x2: cx + shoulderW + 4 - rowDist * 0.5, y2: headY + 16, x3: cx + shoulderW - rowDist, y3: headY + 14 };
        // Legs extended forward (seated)
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 10, y2: hipY + 4, x3: cx - hipW - 18, y3: hipY + 6 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx - hipW - 8, y2: hipY + 6, x3: cx - hipW - 16, y3: hipY + 8 };
        equip = (
          <g>
            <line x1={cx - 30} y1={headY + 14} x2={lArm.x3} y2={lArm.y3} stroke={equipColor} strokeWidth={1} opacity={0.5} />
            <rect x={cx - hipW - 4} y={hipY + 1} width={22} height={3} rx={1.5} fill={equipColor} opacity={0.3} />
          </g>
        );
        break;
      }
      case 'bent_row': {
        const lift = phase * 0.5 + 0.5;
        const bend = 22;
        headY = 34;
        hipY = headY + torsoLen * 0.85;
        torsoAngle = bend;
        const pullUp = lift * 10;
        lArm = { x1: cx - shoulderW, y1: headY + 8, x2: cx - shoulderW, y2: headY + 20 - pullUp * 0.4, x3: cx - 6, y3: headY + 28 - pullUp };
        rArm = { x1: cx + shoulderW, y1: headY + 8, x2: cx + shoulderW, y2: headY + 20 - pullUp * 0.4, x3: cx + 6, y3: headY + 28 - pullUp };
        lLeg = s.lLeg;
        rLeg = s.rLeg;
        lLeg.y3 = hipY + 28;
        rLeg.y3 = hipY + 28;
        equip = (
          <g>
            <line x1={cx - 20} y1={lArm.y3 + 2} x2={cx + 20} y2={rArm.y3 + 2} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={cx - 20} cy={lArm.y3 + 2} r={3.5} fill={equipColor} />
            <circle cx={cx + 20} cy={rArm.y3 + 2} r={3.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'deadlift': {
        const lift = phase * 0.5 + 0.5;
        const bend = (1 - lift) * 25;
        headY = 28 + bend * 0.5;
        hipY = headY + torsoLen * Math.cos(bend * Math.PI / 180);
        lArm = { x1: cx - shoulderW, y1: headY + 8 + bend * 0.3, x2: cx - shoulderW, y2: headY + 20 + bend * 0.5, x3: cx - 6, y3: headY + 28 + bend * 0.3 };
        rArm = { x1: cx + shoulderW, y1: headY + 8 + bend * 0.3, x2: cx + shoulderW, y2: headY + 20 + bend * 0.5, x3: cx + 6, y3: headY + 28 + bend * 0.3 };
        lLeg = { x1: cx - hipW, y1: hipY + 4, x2: cx - hipW - 3, y2: hipY + 18, x3: cx - hipW - 2, y3: hipY + 30 };
        rLeg = { x1: cx + hipW, y1: hipY + 4, x2: cx + hipW + 3, y2: hipY + 18, x3: cx + hipW + 2, y3: hipY + 30 };
        equip = (
          <g>
            <line x1={cx - 20} y1={lArm.y3 + 2} x2={cx + 20} y2={rArm.y3 + 2} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={cx - 20} cy={lArm.y3 + 2} r={4} fill={equipColor} />
            <circle cx={cx + 20} cy={rArm.y3 + 2} r={4} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'romanian_deadlift': {
        // Straighter legs, more hip hinge
        const lift = phase * 0.5 + 0.5;
        const bend = (1 - lift) * 35;
        headY = 28 + bend * 0.7;
        hipY = headY + torsoLen * 0.85;
        lArm = { x1: cx - shoulderW, y1: headY + 8 + bend * 0.4, x2: cx - shoulderW + 2, y2: headY + 22 + bend * 0.5, x3: cx - 4, y3: headY + 30 + bend * 0.3 };
        rArm = { x1: cx + shoulderW, y1: headY + 8 + bend * 0.4, x2: cx + shoulderW - 2, y2: headY + 22 + bend * 0.5, x3: cx + 4, y3: headY + 30 + bend * 0.3 };
        // Nearly straight legs
        lLeg = { x1: cx - hipW, y1: hipY + 2, x2: cx - hipW - 2, y2: hipY + 16, x3: cx - hipW - 1, y3: hipY + 30 };
        rLeg = { x1: cx + hipW, y1: hipY + 2, x2: cx + hipW + 2, y2: hipY + 16, x3: cx + hipW + 1, y3: hipY + 30 };
        equip = (
          <g>
            <line x1={cx - 18} y1={lArm.y3} x2={cx + 18} y2={rArm.y3} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={cx - 18} cy={lArm.y3} r={3.5} fill={equipColor} />
            <circle cx={cx + 18} cy={rArm.y3} r={3.5} fill={equipColor} />
          </g>
        );
        break;
      }

      // ========== SHOULDERS ==========
      case 'overhead_press': {
        const press = phase * 0.5 + 0.5;
        const armUp = press * 18;
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4 + press * 2, y2: headY + 2 - armUp * 0.3, x3: cx - shoulderW - 2 + press * 4, y3: headY - 8 - armUp * 0.5 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4 - press * 2, y2: headY + 2 - armUp * 0.3, x3: cx + shoulderW + 2 - press * 4, y3: headY - 8 - armUp * 0.5 };
        equip = (
          <g>
            <line x1={lArm.x3} y1={lArm.y3} x2={rArm.x3} y2={rArm.y3} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={lArm.x3 - 3} cy={lArm.y3} r={3} fill={equipColor} />
            <circle cx={rArm.x3 + 3} cy={rArm.y3} r={3} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'lateral_raise': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const raise = phase * 0.5 + 0.5;
        const armOut = raise * 18;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - armOut * 0.6, y2: headY + 12 - armOut * 0.4, x3: cx - shoulderW - armOut, y3: headY + 10 - armOut * 0.5 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + armOut * 0.6, y2: headY + 12 - armOut * 0.4, x3: cx + shoulderW + armOut, y3: headY + 10 - armOut * 0.5 };
        equip = (
          <g>
            <rect x={lArm.x3 - 3} y={lArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 3} y={rArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'face_pull': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const pull = phase * 0.5 + 0.5;
        // Arms pull cable to face level, elbows high
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 8 + pull * 6, y2: headY + 2, x3: cx - shoulderW - 2 + pull * 8, y3: headY - 2 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 8 - pull * 6, y2: headY + 2, x3: cx + shoulderW + 2 - pull * 8, y3: headY - 2 };
        equip = (
          <g>
            <line x1={cx} y1={10} x2={(lArm.x3 + rArm.x3) / 2} y2={(lArm.y3 + rArm.y3) / 2} stroke={equipColor} strokeWidth={1} opacity={0.5} />
            <rect x={cx - 3} y={8} width={6} height={4} rx={2} fill={equipColor} opacity={0.5} />
          </g>
        );
        break;
      }
      case 'arnold_press': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const press = phase * 0.5 + 0.5;
        // Rotation + press: start at chest facing in, rotate to overhead
        const rot = press * 14;
        const rotX = press * 6;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 2 - rotX, y2: headY + 4 - rot * 0.5, x3: cx - shoulderW - 4 - rotX, y3: headY - 4 - rot };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 2 + rotX, y2: headY + 4 - rot * 0.5, x3: cx + shoulderW + 4 + rotX, y3: headY - 4 - rot };
        equip = (
          <g>
            <rect x={lArm.x3 - 3} y={lArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 3} y={rArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'upright_row': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const pull = phase * 0.5 + 0.5;
        const elbowUp = pull * 14;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4 - pull * 4, y2: headY + 8 - elbowUp, x3: cx - 4, y3: headY + 14 - elbowUp };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4 + pull * 4, y2: headY + 8 - elbowUp, x3: cx + 4, y3: headY + 14 - elbowUp };
        equip = (
          <g>
            <line x1={lArm.x3} y1={lArm.y3} x2={rArm.x3} y2={rArm.y3} stroke={equipColor} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
        break;
      }
      case 'reverse_fly': {
        headY = 34;
        hipY = headY + torsoLen * 0.85;
        torsoAngle = 25;
        const fly = phase * 0.5 + 0.5;
        const spread = fly * 18;
        lArm = { x1: cx - shoulderW, y1: headY + 8, x2: cx - shoulderW - spread * 0.6, y2: headY + 10 - spread * 0.2, x3: cx - shoulderW - spread, y3: headY + 8 };
        rArm = { x1: cx + shoulderW, y1: headY + 8, x2: cx + shoulderW + spread * 0.6, y2: headY + 10 - spread * 0.2, x3: cx + shoulderW + spread, y3: headY + 8 };
        lLeg = { x1: cx - hipW, y1: hipY + 2, x2: cx - hipW - 3, y2: hipY + 16, x3: cx - hipW - 2, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY + 2, x2: cx + hipW + 3, y2: hipY + 16, x3: cx + hipW + 2, y3: hipY + 28 };
        equip = (
          <g>
            <rect x={lArm.x3 - 3} y={lArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 3} y={rArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }

      // ========== ARMS ==========
      case 'bicep_curl': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const curl = phase * 0.5 + 0.5;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 2, y2: headY + 18, x3: cx - shoulderW - 4 + curl * 8, y3: headY + 10 + (1 - curl) * 16 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 2, y2: headY + 18, x3: cx + shoulderW + 4 - curl * 8, y3: headY + 10 + (1 - curl) * 16 };
        equip = (
          <g>
            <rect x={lArm.x3 - 4} y={lArm.y3 - 1.5} width={8} height={3} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 4} y={rArm.y3 - 1.5} width={8} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'hammer_curl': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const curl = phase * 0.5 + 0.5;
        // Alternating: left up when right down
        const lCurl = curl;
        const rCurl = 1 - curl;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 1, y2: headY + 18, x3: cx - shoulderW - 2 + lCurl * 6, y3: headY + 10 + (1 - lCurl) * 16 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 1, y2: headY + 18, x3: cx + shoulderW + 2 - rCurl * 6, y3: headY + 10 + (1 - rCurl) * 16 };
        equip = (
          <g>
            {/* Vertical dumbbells (hammer grip) */}
            <rect x={lArm.x3 - 1.5} y={lArm.y3 - 4} width={3} height={8} rx={1.5} fill={equipColor} />
            <rect x={rArm.x3 - 1.5} y={rArm.y3 - 4} width={3} height={8} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'preacher_curl': {
        // One arm on angled pad, curling
        headY = 32;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const curl = phase * 0.5 + 0.5;
        // Left arm rests on pad, right arm curls
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 6, y2: headY + 14, x3: cx - shoulderW - 4, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 2, y2: headY + 16, x3: cx + shoulderW + 6 - curl * 10, y3: headY + 8 + (1 - curl) * 18 };
        equip = (
          <g>
            {/* Preacher pad */}
            <line x1={cx + shoulderW - 2} y1={headY + 12} x2={cx + shoulderW + 8} y2={headY + 22} stroke={equipColor} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
            <rect x={rArm.x3 - 3} y={rArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'concentration_curl': {
        // Seated, one arm curling between legs
        headY = 34;
        hipY = headY + torsoLen;
        torsoAngle = 15;
        const curl = phase * 0.5 + 0.5;
        lArm = { x1: cx - shoulderW, y1: headY + 8, x2: cx - shoulderW - 4, y2: headY + 18, x3: cx - shoulderW - 2, y3: headY + 24 };
        // Right arm curling with elbow braced on inner thigh
        rArm = { x1: cx + shoulderW, y1: headY + 8, x2: cx + 2, y2: hipY + 4, x3: cx + 4 - curl * 6, y3: hipY - 4 + (1 - curl) * 18 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 10, y2: hipY + 8, x3: cx - hipW - 14, y3: hipY + 20 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 10, y2: hipY + 8, x3: cx + hipW + 14, y3: hipY + 20 };
        equip = <rect x={rArm.x3 - 3} y={rArm.y3 - 1.5} width={6} height={3} rx={1.5} fill={equipColor} />;
        break;
      }
      case 'tricep_dip': {
        // Between two supports, dipping down
        const dip = phase * 0.5 + 0.5;
        const dipDist = (1 - dip) * 12;
        headY = 24 + dipDist;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 4, x2: cx - shoulderW - 6, y2: headY + 2, x3: cx - 18, y3: headY - 4 };
        rArm = { x1: cx + shoulderW, y1: headY + 4, x2: cx + shoulderW + 6, y2: headY + 2, x3: cx + 18, y3: headY - 4 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 4, y2: hipY + 12, x3: cx - hipW - 6, y3: hipY + 24 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 4, y2: hipY + 12, x3: cx + hipW + 6, y3: hipY + 24 };
        equip = (
          <g>
            {/* Dip bars */}
            <line x1={cx - 18} y1={headY - 6} x2={cx - 18} y2={hipY + 28} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
            <line x1={cx + 18} y1={headY - 6} x2={cx + 18} y2={hipY + 28} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
          </g>
        );
        break;
      }
      case 'tricep_extension': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const ext = phase * 0.5 + 0.5;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW + 2, y2: headY - 2, x3: cx - shoulderW - 4 + ext * 6, y3: headY - 10 - ext * 5 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW - 2, y2: headY - 2, x3: cx + shoulderW + 4 - ext * 6, y3: headY - 10 - ext * 5 };
        equip = <rect x={(lArm.x3 + rArm.x3) / 2 - 5} y={Math.min(lArm.y3, rArm.y3) - 1.5} width={10} height={3} rx={1.5} fill={equipColor} />;
        break;
      }
      case 'skull_crusher': {
        // Lying on bench, lowering weight to forehead
        headY = 55;
        hipY = 57;
        headX = cx - 20;
        isPlank = true;
        const ext = phase * 0.5 + 0.5;
        // Upper arms vertical, forearms rotate
        lArm = { x1: cx - 14, y1: 53, x2: cx - 16, y2: 46, x3: cx - 20 + ext * 8, y3: 40 - ext * 6 };
        rArm = { x1: cx - 4, y1: 53, x2: cx - 2, y2: 46, x3: cx + 2 - ext * 8, y3: 40 - ext * 6 };
        lLeg = { x1: cx + 4, y1: 58, x2: cx + 12, y2: 64, x3: cx + 14, y3: 72 };
        rLeg = { x1: cx + 4, y1: 60, x2: cx + 14, y2: 66, x3: cx + 16, y3: 72 };
        equip = (
          <g>
            <rect x={cx - 24} y={60} width={32} height={4} rx={2} fill={equipColor} opacity={0.4} />
            <line x1={lArm.x3 - 6} y1={lArm.y3} x2={rArm.x3 + 6} y2={rArm.y3} stroke={equipColor} strokeWidth={2} strokeLinecap="round" />
            <circle cx={lArm.x3 - 6} cy={lArm.y3} r={2.5} fill={equipColor} />
            <circle cx={rArm.x3 + 6} cy={rArm.y3} r={2.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'cable_pushdown': {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const push = phase * 0.5 + 0.5;
        // Arms push cable down from chest to hips
        const armDown = push * 14;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - 4, y2: headY + 14 + armDown * 0.3, x3: cx - 3, y3: headY + 16 + armDown };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + 4, y2: headY + 14 + armDown * 0.3, x3: cx + 3, y3: headY + 16 + armDown };
        equip = (
          <g>
            <line x1={cx} y1={8} x2={cx} y2={(lArm.y3 + rArm.y3) / 2} stroke={equipColor} strokeWidth={1} opacity={0.5} />
            <line x1={cx - 8} y1={(lArm.y3 + rArm.y3) / 2} x2={cx + 8} y2={(lArm.y3 + rArm.y3) / 2} stroke={equipColor} strokeWidth={2} strokeLinecap="round" />
            <rect x={cx - 12} y={6} width={24} height={4} rx={2} fill={equipColor} opacity={0.4} />
          </g>
        );
        break;
      }

      // ========== LEGS ==========
      case 'squat': {
        const dip = Math.max(0, phase) * 14;
        headY = 28 + dip;
        hipY = headY + torsoLen - dip * 0.2;
        const kneeSpread = 8 + dip * 0.6;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 5, y2: headY + 18, x3: cx - shoulderW + 2, y3: headY + 14 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 5, y2: headY + 18, x3: cx + shoulderW - 2, y3: headY + 14 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - kneeSpread, y2: hipY + 14 + dip * 0.3, x3: cx - kneeSpread - 2, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + kneeSpread, y2: hipY + 14 + dip * 0.3, x3: cx + kneeSpread + 2, y3: hipY + 28 };
        equip = (
          <g>
            <line x1={cx - 22} y1={headY - 2} x2={cx + 22} y2={headY - 2} stroke={equipColor} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={cx - 22} cy={headY - 2} r={3.5} fill={equipColor} />
            <circle cx={cx + 22} cy={headY - 2} r={3.5} fill={equipColor} />
          </g>
        );
        break;
      }
      case 'lunge': {
        const step = phase * 0.5 + 0.5;
        const dip = step * 10;
        headY = 28 + dip * 0.5;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4, y2: headY + 16, x3: cx - shoulderW - 2, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 16, x3: cx + shoulderW + 2, y3: headY + 22 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 8 - step * 6, y2: hipY + 12 + dip, x3: cx - hipW - 10 - step * 4, y3: hipY + 26 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 4, y2: hipY + 16, x3: cx + hipW + 2, y3: hipY + 28 };
        break;
      }
      case 'bulgarian_split': {
        // Rear foot elevated split squat
        const dip = (phase * 0.5 + 0.5) * 12;
        headY = 28 + dip * 0.4;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4, y2: headY + 16, x3: cx - shoulderW - 2, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 16, x3: cx + shoulderW + 2, y3: headY + 22 };
        // Front leg bending
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 10, y2: hipY + 10 + dip, x3: cx - hipW - 12, y3: hipY + 26 };
        // Rear foot elevated on bench
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 10, y2: hipY + 8, x3: cx + hipW + 18, y3: hipY + 4 };
        equip = (
          <g>
            {/* Bench for rear foot */}
            <rect x={cx + hipW + 14} y={hipY + 2} width={14} height={4} rx={2} fill={equipColor} opacity={0.4} />
            <rect x={cx + hipW + 16} y={hipY + 6} width={3} height={6} rx={1} fill={equipColor} opacity={0.3} />
            <rect x={cx + hipW + 24} y={hipY + 6} width={3} height={6} rx={1} fill={equipColor} opacity={0.3} />
          </g>
        );
        break;
      }
      case 'leg_press': {
        // Seated at angle, pressing platform
        headY = 38;
        hipY = headY + torsoLen * 0.7;
        const press = phase * 0.5 + 0.5;
        const legExt = press * 14;
        lArm = { x1: cx - shoulderW + 4, y1: headY + 6, x2: cx - shoulderW, y2: headY + 14, x3: cx - shoulderW + 2, y3: headY + 20 };
        rArm = { x1: cx + shoulderW - 4, y1: headY + 6, x2: cx + shoulderW, y2: headY + 14, x3: cx + shoulderW - 2, y3: headY + 20 };
        // Legs pressing up/forward
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 8 - legExt * 0.3, y2: hipY - 6 - legExt * 0.5, x3: cx - hipW - 12 - legExt * 0.5, y3: hipY - 12 - legExt };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW - 6 - legExt * 0.3, y2: hipY - 6 - legExt * 0.5, x3: cx + hipW - 10 - legExt * 0.5, y3: hipY - 12 - legExt };
        equip = (
          <g>
            {/* Platform */}
            <line x1={lLeg.x3 - 4} y1={lLeg.y3 - 4} x2={rLeg.x3 + 4} y2={rLeg.y3 + 4} stroke={equipColor} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
            {/* Seat back */}
            <line x1={cx + shoulderW + 4} y1={headY} x2={cx + hipW + 6} y2={hipY + 4} stroke={equipColor} strokeWidth={3} opacity={0.3} strokeLinecap="round" />
          </g>
        );
        break;
      }
      case 'leg_extension': {
        // Seated, extending lower legs
        headY = 32;
        hipY = headY + torsoLen;
        const ext = phase * 0.5 + 0.5;
        const legUp = ext * 16;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4, y2: headY + 16, x3: cx - shoulderW - 2, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 16, x3: cx + shoulderW + 2, y3: headY + 22 };
        // Upper legs horizontal (seated), lower legs swing up
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 8, y2: hipY + 4, x3: cx - hipW - 12 - legUp * 0.2, y3: hipY + 2 - legUp * 0.5 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW - 6, y2: hipY + 4, x3: cx + hipW - 10 - legUp * 0.2, y3: hipY + 2 - legUp * 0.5 };
        equip = (
          <g>
            <rect x={cx - 12} y={hipY + 2} width={24} height={3} rx={1.5} fill={equipColor} opacity={0.4} />
            {/* Pad on shins */}
            <circle cx={(lLeg.x3 + rLeg.x3) / 2} cy={(lLeg.y3 + rLeg.y3) / 2 + 2} r={3} fill={equipColor} opacity={0.5} />
          </g>
        );
        break;
      }
      case 'leg_curl': {
        // Lying face down, curling heels to glutes
        headY = 56;
        hipY = 54;
        headX = cx - 22;
        isPlank = true;
        const curl = phase * 0.5 + 0.5;
        lArm = { x1: cx - 18, y1: 54, x2: cx - 22, y2: 58, x3: cx - 24, y3: 66 };
        rArm = { x1: cx - 8, y1: 54, x2: cx - 4, y2: 58, x3: cx - 2, y3: 66 };
        // Legs curling up
        const curlAngle = curl * 16;
        lLeg = { x1: cx + 8, y1: 53, x2: cx + 20, y2: 54, x3: cx + 24, y3: 48 - curlAngle };
        rLeg = { x1: cx + 8, y1: 55, x2: cx + 22, y2: 56, x3: cx + 26, y3: 50 - curlAngle };
        equip = (
          <g>
            <rect x={cx - 26} y={58} width={40} height={4} rx={2} fill={equipColor} opacity={0.3} />
            <circle cx={(lLeg.x3 + rLeg.x3) / 2} cy={(lLeg.y3 + rLeg.y3) / 2} r={3} fill={equipColor} opacity={0.5} />
          </g>
        );
        break;
      }
      case 'calf_raise': {
        const raise = Math.max(0, phase) * 6;
        headY = 28 - raise;
        ({ hipY, lLeg, rLeg } = standing(headY));
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 5, y2: headY + 16, x3: cx - shoulderW - 3, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 5, y2: headY + 16, x3: cx + shoulderW + 3, y3: headY + 22 };
        // Feet tiptoe
        equip = raise > 2 ? (
          <g>
            <line x1={cx - 12} y1={96} x2={cx + 12} y2={96} stroke={equipColor} strokeWidth={2} opacity={0.3} />
          </g>
        ) : null;
        break;
      }

      // ========== CORE ==========
      case 'plank': {
        headY = 50;
        hipY = 52;
        headX = cx - 22;
        isPlank = true;
        const wobble = breathe * 1.5;
        lArm = { x1: cx - 18, y1: 48, x2: cx - 22, y2: 55, x3: cx - 25, y3: 68 + wobble };
        rArm = { x1: cx + 4, y1: 48, x2: cx + 0, y2: 55, x3: cx - 3, y3: 68 + wobble };
        lLeg = { x1: cx + 14, y1: 52, x2: cx + 22, y2: 56, x3: cx + 32, y3: 68 + wobble };
        rLeg = { x1: cx + 14, y1: 54, x2: cx + 24, y2: 58, x3: cx + 34, y3: 68 + wobble };
        break;
      }
      case 'crunch': {
        // Lying on back, crunching up
        const crunch = phase * 0.5 + 0.5;
        headY = 52 - crunch * 12;
        hipY = 60;
        headX = cx - 14 - crunch * 6;
        isPlank = true;
        lArm = { x1: headX + 4, y1: headY + 2, x2: headX + 2, y2: headY - 4, x3: headX, y3: headY - 8 };
        rArm = { x1: headX + 8, y1: headY + 2, x2: headX + 10, y2: headY - 4, x3: headX + 12, y3: headY - 8 };
        lLeg = { x1: cx + 4, y1: 60, x2: cx + 2, y2: 52, x3: cx, y3: 66 };
        rLeg = { x1: cx + 6, y1: 60, x2: cx + 4, y2: 54, x3: cx + 2, y3: 66 };
        equip = <line x1={cx - 20} y1={62} x2={cx + 20} y2={62} stroke={equipColor} strokeWidth={1} opacity={0.2} />;
        break;
      }
      case 'leg_raise': {
        // Lying on back, raising straight legs
        headY = 56;
        hipY = 58;
        headX = cx - 24;
        isPlank = true;
        const raise = phase * 0.5 + 0.5;
        const legAngle = raise * 20;
        lArm = { x1: cx - 20, y1: 56, x2: cx - 26, y2: 58, x3: cx - 30, y3: 56 };
        rArm = { x1: cx - 16, y1: 56, x2: cx - 12, y2: 58, x3: cx - 8, y3: 56 };
        lLeg = { x1: cx + 2, y1: 58, x2: cx + 12, y2: 56 - legAngle * 0.4, x3: cx + 20, y3: 54 - legAngle };
        rLeg = { x1: cx + 2, y1: 60, x2: cx + 14, y2: 58 - legAngle * 0.4, x3: cx + 22, y3: 56 - legAngle };
        break;
      }
      case 'russian_twist': {
        // Seated, V-shape, rotating torso
        headY = 36;
        hipY = headY + torsoLen * 0.6;
        const twist = phase * 8;
        headX = cx + twist;
        lArm = { x1: cx - shoulderW + twist * 0.5, y1: headY + 8, x2: cx - 4 + twist, y2: headY + 14, x3: cx + twist * 1.5, y3: headY + 16 };
        rArm = { x1: cx + shoulderW + twist * 0.5, y1: headY + 8, x2: cx + 4 + twist, y2: headY + 14, x3: cx + twist * 1.5 + 4, y3: headY + 16 };
        // Legs up in V
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 8, y2: hipY - 6, x3: cx - hipW - 14, y3: hipY - 8 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW - 6, y2: hipY - 6, x3: cx + hipW - 12, y3: hipY - 8 };
        equip = <circle cx={cx + twist * 1.5 + 2} cy={headY + 16} r={3} fill={equipColor} opacity={0.5} />;
        break;
      }
      case 'mountain_climber': {
        // Plank position, driving knees alternately
        headY = 48;
        hipY = 50;
        headX = cx - 20;
        isPlank = true;
        const drive = phase * 12;
        lArm = { x1: cx - 16, y1: 48, x2: cx - 20, y2: 55, x3: cx - 22, y3: 68 };
        rArm = { x1: cx + 2, y1: 48, x2: cx - 2, y2: 55, x3: cx - 4, y3: 68 };
        // Alternating knee drives
        lLeg = { x1: cx + 10, y1: 50, x2: cx + 6 - drive * 0.3, y2: 52 - Math.max(0, drive) * 0.5, x3: cx + 30 - Math.max(0, drive) * 1.2, y3: 68 - Math.max(0, drive) * 0.8 };
        rLeg = { x1: cx + 10, y1: 52, x2: cx + 8 + drive * 0.3, y2: 54 + Math.max(0, -drive) * 0.5, x3: cx + 32 + Math.min(0, drive) * 1.2, y3: 68 + Math.min(0, drive) * 0.8 };
        break;
      }
      case 'hanging_leg_raise': {
        // Hanging from bar, raising legs
        const raise = phase * 0.5 + 0.5;
        headY = 18;
        hipY = headY + torsoLen;
        const legUp = raise * 18;
        lArm = { x1: cx - shoulderW, y1: headY + 4, x2: cx - shoulderW - 2, y2: headY - 4, x3: cx - 12, y3: 8 };
        rArm = { x1: cx + shoulderW, y1: headY + 4, x2: cx + shoulderW + 2, y2: headY - 4, x3: cx + 12, y3: 8 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 4, y2: hipY + 10 - legUp * 0.5, x3: cx - hipW - 8, y3: hipY + 20 - legUp };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 4, y2: hipY + 10 - legUp * 0.5, x3: cx + hipW + 8, y3: hipY + 20 - legUp };
        equip = <line x1={cx - 25} y1={6} x2={cx + 25} y2={6} stroke={equipColor} strokeWidth={3} strokeLinecap="round" />;
        break;
      }
      case 'ab_wheel': {
        // Kneeling, rolling wheel forward
        const roll = phase * 0.5 + 0.5;
        const extend = roll * 18;
        headY = 42 + extend * 0.4;
        hipY = 58;
        headX = cx - 10 - extend;
        isPlank = true;
        lArm = { x1: headX + 6, y1: headY + 4, x2: headX - 4 - extend * 0.3, y2: headY + 10, x3: headX - 10 - extend * 0.5, y3: 68 };
        rArm = { x1: headX + 10, y1: headY + 4, x2: headX + 2 - extend * 0.3, y2: headY + 10, x3: headX - 4 - extend * 0.5, y3: 68 };
        lLeg = { x1: cx + 10, y1: 58, x2: cx + 14, y2: 62, x3: cx + 14, y3: 68 };
        rLeg = { x1: cx + 12, y1: 58, x2: cx + 16, y2: 62, x3: cx + 16, y3: 68 };
        equip = <circle cx={(lArm.x3 + rArm.x3) / 2} cy={68} r={4} fill={equipColor} opacity={0.6} />;
        break;
      }

      // ========== CARDIO ==========
      case 'burpee': {
        // Multi-phase: squat → plank → jump
        const cyclePhase = t * 3 % 1;
        if (cyclePhase < 0.33) {
          // Squat down
          const sq = cyclePhase / 0.33;
          const dip = sq * 14;
          headY = 28 + dip;
          hipY = headY + torsoLen - dip * 0.2;
          lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 5, y2: headY + 18, x3: cx - shoulderW + 2, y3: headY + 14 };
          rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 5, y2: headY + 18, x3: cx + shoulderW - 2, y3: headY + 14 };
          lLeg = { x1: cx - hipW, y1: hipY, x2: cx - 12, y2: hipY + 12, x3: cx - 12, y3: hipY + 26 };
          rLeg = { x1: cx + hipW, y1: hipY, x2: cx + 12, y2: hipY + 12, x3: cx + 12, y3: hipY + 26 };
        } else if (cyclePhase < 0.66) {
          // Plank
          headY = 50;
          hipY = 52;
          headX = cx - 18;
          isPlank = true;
          lArm = { x1: cx - 14, y1: 48, x2: cx - 18, y2: 56, x3: cx - 20, y3: 68 };
          rArm = { x1: cx + 2, y1: 48, x2: cx - 2, y2: 56, x3: cx - 4, y3: 68 };
          lLeg = { x1: cx + 14, y1: 52, x2: cx + 22, y2: 56, x3: cx + 32, y3: 68 };
          rLeg = { x1: cx + 14, y1: 54, x2: cx + 24, y2: 58, x3: cx + 34, y3: 68 };
        } else {
          // Jump up
          const jmp = (cyclePhase - 0.66) / 0.34;
          const jumpH = Math.sin(jmp * Math.PI) * 14;
          headY = 28 - jumpH;
          hipY = headY + torsoLen;
          lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 6, y2: headY - 2, x3: cx - shoulderW - 4, y3: headY - 10 };
          rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 6, y2: headY - 2, x3: cx + shoulderW + 4, y3: headY - 10 };
          lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 3, y2: hipY + 16, x3: cx - hipW - 2, y3: hipY + 30 };
          rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 3, y2: hipY + 16, x3: cx + hipW + 2, y3: hipY + 30 };
        }
        break;
      }
      case 'jump_rope': {
        const jump = Math.abs(phase) * 6;
        const ropeAngle = t * Math.PI * 4;
        headY = 26 - jump;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 3, y2: headY + 16, x3: cx - shoulderW - 1, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 3, y2: headY + 16, x3: cx + shoulderW + 1, y3: headY + 22 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 2, y2: hipY + 14, x3: cx - hipW - 1, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 2, y2: hipY + 14, x3: cx + hipW + 1, y3: hipY + 28 };
        // Rope arc
        const ropeY = Math.sin(ropeAngle) * 20;
        equip = (
          <g>
            <path d={`M${lArm.x3} ${lArm.y3} Q${cx} ${hipY + 30 + ropeY * 0.5} ${rArm.x3} ${rArm.y3}`}
              stroke={equipColor} strokeWidth={1.5} fill="none" opacity={0.6} />
          </g>
        );
        break;
      }
      case 'box_jump': {
        const jumpPhase = t * 2 % 1;
        const inAir = jumpPhase < 0.5;
        const jp = inAir ? jumpPhase / 0.5 : (jumpPhase - 0.5) / 0.5;
        const jumpH = inAir ? Math.sin(jp * Math.PI) * 20 : 0;
        headY = inAir ? 28 - jumpH : 20;
        hipY = headY + torsoLen;
        // Arms swing up during jump
        const armSwing = inAir ? Math.sin(jp * Math.PI) * 12 : 0;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4, y2: headY + 4 - armSwing, x3: cx - shoulderW - 2, y3: headY - 2 - armSwing };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 4 - armSwing, x3: cx + shoulderW + 2, y3: headY - 2 - armSwing };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 4, y2: hipY + (inAir ? 10 : 14), x3: cx - hipW - 3, y3: hipY + (inAir ? 18 : 28) };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 4, y2: hipY + (inAir ? 10 : 14), x3: cx + hipW + 3, y3: hipY + (inAir ? 18 : 28) };
        // Box
        equip = <rect x={cx - 12} y={76} width={24} height={18} rx={2} fill={equipColor} opacity={0.3} />;
        break;
      }
      case 'sprint': {
        const stride = phase * 14;
        const bounce = Math.abs(phase) * 3;
        headY = 26 - bounce;
        hipY = headY + torsoLen;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW + stride * 0.4, y2: headY + 16, x3: cx - shoulderW + stride * 0.6, y3: headY + 12 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW - stride * 0.4, y2: headY + 16, x3: cx + shoulderW - stride * 0.6, y3: headY + 12 };
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW + stride * 0.5, y2: hipY + 14, x3: cx - hipW + stride * 0.7, y3: hipY + 28 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW - stride * 0.5, y2: hipY + 14, x3: cx + hipW - stride * 0.7, y3: hipY + 28 };
        // Speed lines
        equip = (
          <g>
            <motion.line x1={cx - 28} y1={headY + 10} x2={cx - 35} y2={headY + 10} stroke={equipColor} strokeWidth={1} opacity={0.3}
              animate={{ x1: [cx - 28, cx - 32], x2: [cx - 35, cx - 42] }} transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }} />
            <motion.line x1={cx - 26} y1={headY + 18} x2={cx - 32} y2={headY + 18} stroke={equipColor} strokeWidth={1} opacity={0.2}
              animate={{ x1: [cx - 26, cx - 30], x2: [cx - 32, cx - 38] }} transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }} />
          </g>
        );
        break;
      }
      case 'battle_ropes': {
        headY = 30;
        ({ hipY, lLeg, rLeg } = standing(headY));
        // Alternating wave arms
        const lWave = Math.sin(t * Math.PI * 6) * 6;
        const rWave = Math.sin(t * Math.PI * 6 + Math.PI) * 6;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 4, y2: headY + 16 + lWave, x3: cx - shoulderW - 2, y3: headY + 24 + lWave };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 16 + rWave, x3: cx + shoulderW + 2, y3: headY + 24 + rWave };
        // Rope waves
        equip = (
          <g>
            <path d={`M${lArm.x3} ${lArm.y3} Q${cx - 30} ${70 + lWave} ${20} ${90}`} stroke={equipColor} strokeWidth={2.5} fill="none" opacity={0.5} />
            <path d={`M${rArm.x3} ${rArm.y3} Q${cx + 30} ${70 + rWave} ${130} ${90}`} stroke={equipColor} strokeWidth={2.5} fill="none" opacity={0.5} />
          </g>
        );
        break;
      }

      // ========== FLEXIBILITY ==========
      case 'sun_salutation': {
        // Flow between standing and forward fold
        const flow = phase * 0.5 + 0.5;
        if (flow > 0.5) {
          // Standing with arms up
          const reach = (flow - 0.5) * 2;
          headY = 28;
          ({ hipY, lLeg, rLeg } = standing(headY));
          lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW + 2, y2: headY - 4, x3: cx - 6, y3: headY - 14 - reach * 4 };
          rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW - 2, y2: headY - 4, x3: cx + 6, y3: headY - 14 - reach * 4 };
        } else {
          // Forward fold
          const fold = (0.5 - flow) * 2;
          const bend = fold * 30;
          headY = 28 + bend;
          hipY = headY + torsoLen * 0.7;
          lArm = { x1: cx - shoulderW, y1: headY + 8, x2: cx - shoulderW + 2, y2: headY + 18, x3: cx - 6, y3: headY + 24 };
          rArm = { x1: cx + shoulderW, y1: headY + 8, x2: cx + shoulderW - 2, y2: headY + 18, x3: cx + 6, y3: headY + 24 };
          lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 2, y2: hipY + 14, x3: cx - hipW - 1, y3: hipY + 28 };
          rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 2, y2: hipY + 14, x3: cx + hipW + 1, y3: hipY + 28 };
        }
        break;
      }
      case 'pigeon_pose': {
        // Deep hip stretch on floor
        headY = 40;
        hipY = 56;
        headX = cx - 8;
        const breatheY = breathe * 2;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 6, y2: headY + 14, x3: cx - shoulderW - 10, y3: 68 + breatheY };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 4, y2: headY + 14, x3: cx + shoulderW + 8, y3: 68 + breatheY };
        // Front leg bent, rear leg extended
        lLeg = { x1: cx - hipW, y1: hipY, x2: cx - hipW - 10, y2: hipY + 2, x3: cx - hipW - 16, y3: hipY + 6 };
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + 14, y2: hipY + 2, x3: cx + hipW + 26, y3: hipY + 4 };
        break;
      }
      case 'foam_rolling': {
        // Seated on roller, rolling back and forth
        headY = 38;
        hipY = headY + torsoLen * 0.8;
        const roll = phase * 6;
        headX = cx + roll;
        lArm = { x1: cx - shoulderW + roll, y1: headY + 6, x2: cx - shoulderW - 4 + roll, y2: headY + 16, x3: cx - shoulderW - 8 + roll, y3: 68 };
        rArm = { x1: cx + shoulderW + roll, y1: headY + 6, x2: cx + shoulderW + 4 + roll, y2: headY + 16, x3: cx + shoulderW + 8 + roll, y3: 68 };
        lLeg = { x1: cx - hipW + roll, y1: hipY, x2: cx - hipW - 8 + roll, y2: hipY + 6, x3: cx - hipW - 12 + roll, y3: hipY + 18 };
        rLeg = { x1: cx + hipW + roll, y1: hipY, x2: cx + hipW + 8 + roll, y2: hipY + 6, x3: cx + hipW + 12 + roll, y3: hipY + 18 };
        // Foam roller
        equip = (
          <g>
            <ellipse cx={cx + roll} cy={hipY + 4} rx={8} ry={4} fill={equipColor} opacity={0.4} />
          </g>
        );
        break;
      }
      case 'dynamic_stretch': {
        // Leg swings
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const swing = phase * 16;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 5, y2: headY + 16, x3: cx - shoulderW - 3, y3: headY + 22 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 5, y2: headY + 16, x3: cx + shoulderW + 3, y3: headY + 22 };
        // Right leg swinging forward and back
        rLeg = { x1: cx + hipW, y1: hipY, x2: cx + hipW + swing * 0.5, y2: hipY + 14 - Math.abs(swing) * 0.3, x3: cx + hipW + swing, y3: hipY + 24 - Math.abs(swing) * 0.5 };
        break;
      }

      // ========== DEFAULT ==========
      default: {
        headY = 28;
        ({ hipY, lLeg, rLeg } = standing(headY));
        const sway = phase * 3;
        lArm = { x1: cx - shoulderW, y1: headY + 6, x2: cx - shoulderW - 6 + sway, y2: headY + 18, x3: cx - shoulderW - 4 + sway * 0.5, y3: headY + 26 };
        rArm = { x1: cx + shoulderW, y1: headY + 6, x2: cx + shoulderW + 6 - sway, y2: headY + 18, x3: cx + shoulderW + 4 - sway * 0.5, y3: headY + 26 };
        break;
      }
    }

    return { headY, headX, hipY, torsoAngle, lArm, rArm, lLeg, rLeg, equip, isPlank };
  };

  const pose = getBodyPose();
  const hx = pose.headX || cx;
  const isHorizontal = pose.isPlank;

  const getMuscleHighlight = () => {
    const mg = muscleGroup.toLowerCase();
    if (mg.includes('chest') || mg.includes('pec')) return 'chest';
    if (mg.includes('back') || mg.includes('lat')) return 'back';
    if (mg.includes('leg') || mg.includes('quad') || mg.includes('glute') || mg.includes('ham')) return 'legs';
    if (mg.includes('arm') || mg.includes('bicep') || mg.includes('tricep')) return 'arms';
    if (mg.includes('shoulder') || mg.includes('delt')) return 'shoulders';
    if (mg.includes('core') || mg.includes('ab')) return 'core';
    return 'full';
  };

  const highlight = getMuscleHighlight();
  const pulseOpacity = 0.15 + Math.abs(breathe) * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-44 bg-muted/10 border border-foreground/10 rounded-2xl overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
      <div className="absolute inset-0 opacity-5 pixel-grid" />

      <svg viewBox="0 0 150 110" className="w-full h-full" style={{ maxWidth: 280 }}>
        {/* Muscle group glow */}
        {!isHorizontal && highlight === 'chest' && (
          <ellipse cx={cx} cy={pose.headY + 12} rx={12} ry={8} fill="hsl(var(--accent))" opacity={pulseOpacity} />
        )}
        {!isHorizontal && highlight === 'legs' && (
          <>
            <ellipse cx={cx - 6} cy={pose.hipY + 12} rx={6} ry={14} fill="hsl(var(--accent))" opacity={pulseOpacity} />
            <ellipse cx={cx + 6} cy={pose.hipY + 12} rx={6} ry={14} fill="hsl(var(--accent))" opacity={pulseOpacity} />
          </>
        )}
        {!isHorizontal && highlight === 'arms' && (
          <>
            <ellipse cx={pose.lArm.x2} cy={pose.lArm.y2} rx={5} ry={8} fill="hsl(var(--accent))" opacity={pulseOpacity} />
            <ellipse cx={pose.rArm.x2} cy={pose.rArm.y2} rx={5} ry={8} fill="hsl(var(--accent))" opacity={pulseOpacity} />
          </>
        )}
        {!isHorizontal && highlight === 'shoulders' && (
          <>
            <circle cx={cx - shoulderW} cy={pose.headY + 6} r={6} fill="hsl(var(--accent))" opacity={pulseOpacity} />
            <circle cx={cx + shoulderW} cy={pose.headY + 6} r={6} fill="hsl(var(--accent))" opacity={pulseOpacity} />
          </>
        )}
        {!isHorizontal && highlight === 'core' && (
          <ellipse cx={cx} cy={pose.hipY - 4} rx={8} ry={10} fill="hsl(var(--accent))" opacity={pulseOpacity} />
        )}

        {/* Shadow */}
        <ellipse cx={cx} cy={96} rx={isHorizontal ? 28 : 16} ry={3} fill="hsl(var(--foreground) / 0.06)" />

        {/* Equipment behind */}
        {pose.equip}

        {/* Legs */}
        <line x1={pose.lLeg.x1} y1={pose.lLeg.y1} x2={pose.lLeg.x2} y2={pose.lLeg.y2} stroke={pantsColor} strokeWidth={isFemale ? 4.5 : 5} strokeLinecap="round" />
        <line x1={pose.lLeg.x2} y1={pose.lLeg.y2} x2={pose.lLeg.x3} y2={pose.lLeg.y3} stroke={pantsColor} strokeWidth={isFemale ? 4 : 4.5} strokeLinecap="round" />
        <ellipse cx={pose.lLeg.x3 + 2} cy={pose.lLeg.y3 + 1} rx={4} ry={2.5} fill={shoeColor} />
        <line x1={pose.rLeg.x1} y1={pose.rLeg.y1} x2={pose.rLeg.x2} y2={pose.rLeg.y2} stroke={pantsColor} strokeWidth={isFemale ? 4.5 : 5} strokeLinecap="round" />
        <line x1={pose.rLeg.x2} y1={pose.rLeg.y2} x2={pose.rLeg.x3} y2={pose.rLeg.y3} stroke={pantsColor} strokeWidth={isFemale ? 4 : 4.5} strokeLinecap="round" />
        <ellipse cx={pose.rLeg.x3 + 2} cy={pose.rLeg.y3 + 1} rx={4} ry={2.5} fill={shoeColor} />
        <circle cx={pose.lLeg.x2} cy={pose.lLeg.y2} r={2.2} fill={pantsColor} />
        <circle cx={pose.rLeg.x2} cy={pose.rLeg.y2} r={2.2} fill={pantsColor} />

        {/* Torso */}
        {isHorizontal ? (
          <line x1={hx + 4} y1={pose.headY + 2} x2={pose.lLeg.x1} y2={pose.hipY} stroke={shirtColor} strokeWidth={isFemale ? 9 : 11} strokeLinecap="round" />
        ) : (
          <>
            <path d={`M${cx - (isFemale ? 9 : 11)} ${pose.headY + 4} L${cx - (isFemale ? 7 : 8)} ${pose.hipY} L${cx + (isFemale ? 7 : 8)} ${pose.hipY} L${cx + (isFemale ? 9 : 11)} ${pose.headY + 4} Z`}
              fill={shirtColor} stroke={shirtDark} strokeWidth={0.5} />
            <line x1={cx - (isFemale ? 8 : 9)} y1={pose.hipY - 1} x2={cx + (isFemale ? 8 : 9)} y2={pose.hipY - 1} stroke={pantsColor} strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}

        {/* Arms */}
        <line x1={pose.lArm.x1} y1={pose.lArm.y1} x2={pose.lArm.x2} y2={pose.lArm.y2} stroke={skinColor} strokeWidth={isFemale ? 3.5 : 4} strokeLinecap="round" />
        <line x1={pose.lArm.x2} y1={pose.lArm.y2} x2={pose.lArm.x3} y2={pose.lArm.y3} stroke={skinColor} strokeWidth={isFemale ? 3 : 3.5} strokeLinecap="round" />
        <circle cx={pose.lArm.x2} cy={pose.lArm.y2} r={2} fill={skinDark} />
        <circle cx={pose.lArm.x3} cy={pose.lArm.y3} r={2.5} fill={skinColor} stroke={skinDark} strokeWidth={0.5} />
        <line x1={pose.rArm.x1} y1={pose.rArm.y1} x2={pose.rArm.x2} y2={pose.rArm.y2} stroke={skinColor} strokeWidth={isFemale ? 3.5 : 4} strokeLinecap="round" />
        <line x1={pose.rArm.x2} y1={pose.rArm.y2} x2={pose.rArm.x3} y2={pose.rArm.y3} stroke={skinColor} strokeWidth={isFemale ? 3 : 3.5} strokeLinecap="round" />
        <circle cx={pose.rArm.x2} cy={pose.rArm.y2} r={2} fill={skinDark} />
        <circle cx={pose.rArm.x3} cy={pose.rArm.y3} r={2.5} fill={skinColor} stroke={skinDark} strokeWidth={0.5} />

        {/* Head */}
        <circle cx={hx} cy={pose.headY - headR + 2} r={headR} fill={skinColor} stroke={skinDark} strokeWidth={0.8} />
        {/* Hair */}
        {isFemale ? (
          <>
            <path d={`M${hx - headR} ${pose.headY - headR - 2} Q${hx} ${pose.headY - headR * 2 - 4} ${hx + headR} ${pose.headY - headR - 2} L${hx + headR + 1} ${pose.headY - headR + 4} Q${hx} ${pose.headY - headR} ${hx - headR - 1} ${pose.headY - headR + 4} Z`} fill={hairColor} />
            <path d={`M${hx + headR - 2} ${pose.headY - headR - 1} Q${hx + headR + 8} ${pose.headY - headR + 2} ${hx + headR + 5} ${pose.headY + 2}`} stroke={hairColor} strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <path d={`M${hx - headR + 1} ${pose.headY - headR - 1} Q${hx} ${pose.headY - headR * 2 - 2} ${hx + headR - 1} ${pose.headY - headR - 1} L${hx + headR} ${pose.headY - headR + 3} Q${hx} ${pose.headY - headR + 1} ${hx - headR} ${pose.headY - headR + 3} Z`} fill={hairColor} />
        )}
        {/* Eyes */}
        <ellipse cx={hx - 3} cy={pose.headY - headR + 2} rx={1.2} ry={1.5} fill="#333" />
        <ellipse cx={hx + 3} cy={pose.headY - headR + 2} rx={1.2} ry={1.5} fill="#333" />
        <circle cx={hx - 2.5} cy={pose.headY - headR + 1.2} r={0.5} fill="white" />
        <circle cx={hx + 3.5} cy={pose.headY - headR + 1.2} r={0.5} fill="white" />
        {/* Mouth */}
        <path d={`M${hx - 2.5} ${pose.headY - headR + 5.5} Q${hx} ${pose.headY - headR + 7} ${hx + 2.5} ${pose.headY - headR + 5.5}`} stroke="#333" strokeWidth={0.7} fill="none" />
        {isFemale && (
          <>
            <circle cx={hx - 5} cy={pose.headY - headR + 4} r={2} fill="hsl(0, 70%, 80%)" opacity={0.4} />
            <circle cx={hx + 5} cy={pose.headY - headR + 4} r={2} fill="hsl(0, 70%, 80%)" opacity={0.4} />
          </>
        )}

        {/* Sweat on hard exercises */}
        {['squat', 'deadlift', 'pullup', 'burpee', 'sprint', 'battle_ropes', 'box_jump', 'hanging_leg_raise', 'ab_wheel'].includes(animType) && (
          <motion.g animate={{ opacity: [0, 1, 0], y: [0, 6] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <path d={`M${hx + headR + 3} ${pose.headY - headR} Q${hx + headR + 5} ${pose.headY - headR + 3} ${hx + headR + 3} ${pose.headY - headR + 5}`} fill="hsl(200, 80%, 65%)" />
          </motion.g>
        )}

        {/* Floor */}
        <line x1={15} y1={96} x2={135} y2={96} stroke="hsl(var(--foreground) / 0.08)" strokeWidth={1} />
      </svg>

      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-[8px] font-display tracking-widest text-muted-foreground bg-background/80 px-3 py-1 rounded-full border border-foreground/5">
          {isFemale ? '👩‍💪' : '💪'} {exerciseName.toUpperCase()}
        </span>
      </div>
      <div className="absolute top-2 right-2">
        <span className="text-[7px] font-display tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
          {muscleGroup.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};
