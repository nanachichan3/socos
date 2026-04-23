/**
 * Scenario archetypes for the AI Dungeon Master.
 * These are the pre-built scenarios users can choose from.
 */

export interface SceneConfig {
  description: string;
  setting: string;
  expectedBeats: string[];
}

export interface DMScenario {
  id: string;
  name: string;
  archetype: 'mystery' | 'adventure' | 'intimate';
  description: string;
  openingText: string;
  scenes: SceneConfig[];
  xpReward: number;
  totalScenes: number;
}

export const SCENARIOS: DMScenario[] = [
  {
    id: 'mystery-at-the-gala',
    name: 'Mystery at the Gala',
    archetype: 'mystery',
    description:
      'A black-tie charity event turns intriguing when a priceless artifact goes missing. Work together to solve the mystery while navigating the complex social dynamics of high society.',
    openingText: `You arrive at the Grand Harmony Charity Gala, an evening of elegance and intrigue at the city's most prestigious hotel. Crystal chandeliers cast golden light across the crowd of well-dressed guests. The air hums with whispered conversations and the soft clink of champagne glasses.

As you step onto the marble foyer, you notice each other across the room — two strangers drawn together by fate, though neither knows it yet. A hush falls over the crowd as the host announces that the prized Celestial Diamond, on loan from the national museum, has vanished from its display case.

You are both persons of interest. The mystery begins now.`,
    scenes: [
      {
        description: 'The Disappearance',
        setting: 'The grand ballroom, moments after the theft is announced',
        expectedBeats: ['Observe surroundings', 'Notice something unusual', 'First interaction between participants'],
      },
      {
        description: 'Gathering Clues',
        setting: 'The exhibit hall, now cordoned off by hotel security',
        expectedBeats: ['Examine the empty display case', 'Notice a suspicious guest', 'Share observations with each other'],
      },
      {
        description: 'The Suspect Pool',
        setting: 'The hotel lounge, where guests are being questioned',
        expectedBeats: ['Compare notes on suspicious behavior', 'Discover a shared connection to the suspect', 'Decide on a plan of action'],
      },
      {
        description: 'The Confrontation',
        setting: 'The rooftop garden, under a canopy of string lights',
        expectedBeats: ['Corner the culprit', 'Work together to recover the diamond', 'A moment of connection amid the chaos'],
      },
      {
        description: 'Resolution & Reflection',
        setting: 'Back at the ballroom, the night winding down',
        expectedBeats: ['Reflect on the evenings events', 'Acknowledge the teamwork', 'Discover what drew you to each other'],
      },
    ],
    xpReward: 150,
    totalScenes: 5,
  },
  {
    id: 'road-trip',
    name: 'Road Trip',
    archetype: 'adventure',
    description:
      'A cross-country drive with forced proximity. You find yourselves sharing a rental car on a journey that takes unexpected turns — rest stop conversations, wrong turns, and moments that matter.',
    openingText: `The rental car hums along the open highway as the city skyline shrinks in the rearview mirror. You barely know each other — perhaps friends of friends, or colleagues who have never quite found the time to talk. But fate, it seems, has other plans.

Your mutual friend had a family emergency and couldn't make the drive to the wedding across the country. You both volunteered to drive their car instead. "You two will get along great," they said. "You'll have plenty of time to talk."

That was three hours ago. The radio plays something neither of you can quite agree on. The snacks are running low. And somewhere between the gas station coffee and the endless fields, the conversation shifts...

This road trip is about to get interesting.`,
    scenes: [
      {
        description: 'First Rest Stop',
        setting: 'A quirky roadside diner off Route 66',
        expectedBeats: ['Break the ice', 'Discover shared interests', 'Learn something unexpected about each other'],
      },
      {
        description: 'The Wrong Turn',
        setting: 'A scenic back road that definitely is not on the GPS',
        expectedBeats: ['Navigate the unexpected together', 'Share stories from the detour', 'Find beauty in going off course'],
      },
      {
        description: 'Late Night Confessions',
        setting: 'The car, 2 AM, parked at a rest stop overlooking a moonlit valley',
        expectedBeats: ['Lowering defenses in the quiet hours', 'Sharing fears and dreams', 'A shift in how you see each other'],
      },
      {
        description: 'Arrival',
        setting: 'The destination town, golden hour light spilling over the horizon',
        expectedBeats: ['Arrive transformed', 'Acknowledge what happened on the journey', 'Decide what comes next'],
      },
    ],
    xpReward: 120,
    totalScenes: 4,
  },
  {
    id: 'first-date-simulator',
    name: 'First Date Simulator',
    archetype: 'intimate',
    description:
      'A sophisticated restaurant sets the stage for the timeless dance of first-date conversation. Navigate topics, make choices, and see where the evening takes you — no script, just authentic connection.',
    openingText: `Le Petit Jardin is everything you hoped it would be — intimate lighting, the murmur of French jazz, and a corner table with a view of the city below. The reservation was hard-won, and now here you both are.

You studied the menu online before coming, but somehow, sitting here across from each other, none of that preparation seems to matter. There's just you, them, and the question hanging in the air: What do we talk about now?

The waiter approaches with a smile. The evening is yours to shape.

This is your first date. There's no going back.`,
    scenes: [
      {
        description: 'The Approach',
        setting: 'The restaurant entrance, meeting for the first time',
        expectedBeats: ['The nervous introduction', 'Find a conversational rhythm', 'Break the ice with humor or sincerity'],
      },
      {
        description: 'Appetizers & Connection',
        setting: 'Your corner table, wine glasses raised',
        expectedBeats: ['Share stories from your lives', 'Discover alignment or intriguing differences', 'A genuine moment of connection'],
      },
      {
        description: 'The Turn',
        setting: 'Dessert arrives, the evening deepening',
        expectedBeats: ['Navigate a more vulnerable topic', 'Make a choice that reveals who you are', 'Find out if this connection has legs'],
      },
    ],
    xpReward: 100,
    totalScenes: 3,
  },
];

/**
 * Seed the database with scenarios if they don't exist.
 * Called on module init.
 */
export function getDefaultScenarios(): DMScenario[] {
  return SCENARIOS;
}
