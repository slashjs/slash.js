import { Colors } from '../constan';

export function resolveColor(color: string|number): number {
  if (typeof color === 'string') {
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
    if (color === 'DEFAULT') return Colors.DEFAULT;
    color = Colors[color as keyof typeof Colors];
  }
  if (color < 0 || color > 0xffffff) throw new Error('Invalid color range');
  else if (Number.isNaN(color)) throw new Error('Color can not be parsed');
  return color;
}