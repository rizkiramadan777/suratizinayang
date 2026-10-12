import React from 'react';
import {
  Activity,
  Coffee,
  Gamepad2,
  Bike,
  Users,
  Sparkles,
  Trophy,
  Compass,
  Film,
  Music,
  ShoppingBag,
  Utensils,
  Dumbbell,
  Heart,
  Calendar,
  FileQuestion,
} from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export default function CategoryIcon({ name = 'activity', className = 'w-4 h-4' }: CategoryIconProps) {
  const iconProps = { className };

  switch (name.toLowerCase()) {
    case 'futsal':
    case 'activity':
    case 'olahraga':
      return <Activity {...iconProps} />;
    case 'coffee':
    case 'nongkrong':
    case 'ngopi':
      return <Coffee {...iconProps} />;
    case 'gamepad-2':
    case 'mabar':
    case 'game':
      return <Gamepad2 {...iconProps} />;
    case 'bike':
    case 'touring':
    case 'riding':
      return <Bike {...iconProps} />;
    case 'users':
    case 'reuni':
    case 'teman':
      return <Users {...iconProps} />;
    case 'trophy':
    case 'turnamen':
      return <Trophy {...iconProps} />;
    case 'compass':
    case 'jalan-jalan':
      return <Compass {...iconProps} />;
    case 'film':
    case 'bioskop':
      return <Film {...iconProps} />;
    case 'music':
    case 'konser':
      return <Music {...iconProps} />;
    case 'shopping':
    case 'shoppingbag':
      return <ShoppingBag {...iconProps} />;
    case 'utensils':
    case 'makan':
      return <Utensils {...iconProps} />;
    case 'dumbbell':
    case 'gym':
      return <Dumbbell {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
}
