import { FONTS } from '../../data/fonts';
import GlitchText from './GlitchText';

const colorMap: Record<string, string> = {
  green: '#10B981',
  red: '#EF4444',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  gray: '#9CA3AF',
  cyan: '#06B6D4',
  orange: '#F97316',
};

// Glitch color combinations for different effects
const glitchColors = {
  green: { primary: '#10B981', secondary: '#EF4444', base: '#10B981' },
  red: { primary: '#EF4444', secondary: '#3B82F6', base: '#EF4444' },
  blue: { primary: '#3B82F6', secondary: '#F59E0B', base: '#3B82F6' },
  yellow: { primary: '#F59E0B', secondary: '#8B5CF6', base: '#F59E0B' },
  purple: { primary: '#8B5CF6', secondary: '#EF4444', base: '#8B5CF6' },
  gray: { primary: '#9CA3AF', secondary: '#10B981', base: '#9CA3AF' },
  cyan: { primary: '#06B6D4', secondary: '#F97316', base: '#06B6D4' },
  orange: { primary: '#F97316', secondary: '#3B82F6', base: '#F97316' },
};

export default function ModuleHeader({ name, color }: { name: string, color: string }) {
  const colors = glitchColors[color as keyof typeof glitchColors] || glitchColors.blue;
  
  return (
    <GlitchText 
      text={name}
      fontSize={24}
      width={300}
      height={40}
      animationSpeed={200}
      animationInterval={3000}
      primaryColor={colors.primary}
      secondaryColor={colors.secondary}
      baseColor={colors.base}
      opacity={1}
      textAlign="left"
      fontFamily={FONTS.PRIMARY}
    />
  );
} 