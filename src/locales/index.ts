import type { LangCode, Locale } from '../types';
import de from './de.json';
import en from './en.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';
export const LOCALES: Record<LangCode, Locale> = { en, de, nl, it, fr };