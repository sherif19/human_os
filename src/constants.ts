import { 
  Zap, 
  Star, 
  Heart, 
  Target, 
  Shield, 
  ArrowUpRight, 
  Activity, 
  Search, 
  ShieldAlert, 
  Brain, 
  Lock, 
  Terminal, 
  Trophy, 
  MessageSquareMore, 
  TrendingUp, 
  Dna,
  UserCheck,
  Calendar,
  CloudLightning,
  Map,
  Eye,
  Ghost
} from 'lucide-react';
import { TranslationKey } from './lib/translations';

export interface Tool {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  icon: any;
  category: string;
}

export const coreTools: Tool[] = [
  { id: 'assistant', nameKey: 'personal_assistant', descKey: 'assistant_desc', icon: UserCheck, category: 'Guide' },
  { id: 'daily-ritual', nameKey: 'daily_ritual', descKey: 'ritual_desc', icon: Calendar, category: 'Habits' },
  { id: 'neural-flow', nameKey: 'neural_flow', descKey: 'flow_desc', icon: CloudLightning, category: 'Efficiency' },
  { id: 'planner', nameKey: 'strategic_planner', descKey: 'planner_desc', icon: Map, category: 'Strategy' },
  { id: 'empathy', nameKey: 'empathy_logic', descKey: 'empathy_desc', icon: Eye, category: 'Social IQ' },
  { id: 'shadow', nameKey: 'shadow_work', descKey: 'shadow_desc', icon: Ghost, category: 'Psychology' },
  { id: 'confidence', nameKey: 'confidence_audit', descKey: 'confidence_desc', icon: Zap, category: 'Personality' },
  { id: 'charisma', nameKey: 'charisma_mapping', descKey: 'charisma_desc', icon: Star, category: 'Social' },
  { id: 'eq', nameKey: 'eq_assessment', descKey: 'eq_desc', icon: Heart, category: 'Emotional' },
  { id: 'discipline', nameKey: 'discipline_index', descKey: 'discipline_desc', icon: Target, category: 'Performance' },
  { id: 'conflict', nameKey: 'conflict_resolution', descKey: 'conflict_desc', icon: Shield, category: 'Social' },
  { id: 'self-worth', nameKey: 'self_worth_pulse', descKey: 'self_worth_desc', icon: ArrowUpRight, category: 'Identity' },
  { id: 'social-energy', nameKey: 'social_energy_tracker', descKey: 'social_energy_desc', icon: Activity, category: 'Social' },
  { id: 'focus', nameKey: 'focus_mastery', descKey: 'focus_desc', icon: Search, category: 'Performance' },
  { id: 'burnout', nameKey: 'burnout_resistance', descKey: 'burnout_desc', icon: ShieldAlert, category: 'Emotional' },
  { id: 'archetype', nameKey: 'archetype_detection', descKey: 'archetype_desc', icon: Brain, category: 'DNA' },
  { id: 'habit', nameKey: 'habit_forge', descKey: 'habit_desc', icon: Zap, category: 'Growth' },
  { id: 'silence', nameKey: 'strategic_silence', descKey: 'silence_desc', icon: Lock, category: 'Social' },
  { id: 'mission', nameKey: 'micro_mission_lab', descKey: 'mission_desc', icon: Target, category: 'Action' },
  { id: 'journal', nameKey: 'neural_journaling', descKey: 'journal_desc', icon: Terminal, category: 'AI' },
  { id: 'toxicity', nameKey: 'toxicity_shield', descKey: 'shield_desc', icon: Shield, category: 'Relationships' },
  { id: 'leadership', nameKey: 'leadership_iq', descKey: 'leadership_desc', icon: Trophy, category: 'Career' },
  { id: 'trauma', nameKey: 'trauma_audit', descKey: 'trauma_desc', icon: Activity, category: 'Emotional' },
  { id: 'communication', nameKey: 'communication_bio', descKey: 'comm_desc', icon: MessageSquareMore, category: 'Social' },
  { id: 'growth-velocity', nameKey: 'growth_velocity_tool', descKey: 'growth_desc', icon: TrendingUp, category: 'Dashboard' },
  { id: 'dna-sync', nameKey: 'dna_synchronization', descKey: 'dna_sync_desc', icon: Dna, category: 'Core' }
];
