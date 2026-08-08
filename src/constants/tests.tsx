import { coreTools } from '../constants';
import { TEST_QUESTIONS } from './questions';

export interface PersonalityTest {
  id: string;
  name: string;
  nameKey: string;
  descKey: string;
  icon: any;
  questions: number;
  description: string;
  category: string;
}

export const PERSONALITY_TESTS: PersonalityTest[] = coreTools.map(tool => ({
  id: tool.id,
  name: tool.nameKey, // We can translate this using t(test.nameKey)
  nameKey: tool.nameKey,
  descKey: tool.descKey,
  icon: tool.icon,
  questions: TEST_QUESTIONS[tool.id]?.length || 5,
  description: tool.descKey,
  category: tool.category
}));
