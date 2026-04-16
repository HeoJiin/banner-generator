import { BannerState, buildGradientCss } from '@/types/banner';

export function getBackground(state: BannerState, overrideColor?: string | null): string {
  if (overrideColor) return overrideColor;
  if (state.backgroundType === 'gradient') {
    return buildGradientCss(
      state.backgroundGradientFrom,
      state.backgroundGradientTo,
      state.backgroundGradientAngle
    );
  }
  return state.backgroundColor;
}
