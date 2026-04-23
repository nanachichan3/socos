import { createMachine, assign } from 'xstate';

/**
 * DM Session state machine
 *
 * States:
 *   waiting      → Session created, waiting for second participant to join
 *   active       → Both participants confirmed, AI narrates opening
 *   scene_submission → Users submitting responses for current scene
 *   scene_review  → Both responses received, AI synthesizing next scene
 *   debrief      → All scenes complete, AI generating debrief
 *   completed    → Session fully done
 *   expired      → Deadline passed without enough responses
 */
export const dmSessionMachine = createMachine({
  id: 'dmSession',
  initial: 'waiting',
  context: {
    sessionId: '',
    currentScene: 0,
    totalScenes: 3,
    deadline: null as Date | null,
    responsesSubmitted: [] as string[], // user IDs who have responded
    startedAt: null as Date | null,
    expired: false,
  },
  states: {
    waiting: {
      on: {
        START: {
          target: 'active',
          actions: assign({
            startedAt: () => new Date(),
            currentScene: () => 0,
          }),
        },
        EXPIRE: { target: 'expired' },
      },
    },
    active: {
      on: {
        BEGIN_SCENE: 'scene_submission',
      },
    },
    scene_submission: {
      on: {
        SUBMIT_RESPONSE: {
          actions: assign({
            responsesSubmitted: ({ context, event }) => {
              const evt = event as any;
              if (!context.responsesSubmitted.includes(evt.userId)) {
                return [...context.responsesSubmitted, evt.userId];
              }
              return context.responsesSubmitted;
            },
          }),
        },
        // When both users respond, move to scene_review
        REVIEW_SCENE: [
          {
            target: 'scene_review',
            guard: ({ context }) => context.responsesSubmitted.length >= 2,
          },
        ],
        // If only one responds and deadline passes
        EXPIRE_DEADLINE: { target: 'expired' },
      },
    },
    scene_review: {
      on: {
        ADVANCE_SCENE: {
          target: 'active',
          actions: assign({
            currentScene: ({ context }) => context.currentScene + 1,
            responsesSubmitted: () => [],
          }),
        },
        // If all scenes done
        BEGIN_DEBRIEF: { target: 'debrief' },
      },
    },
    debrief: {
      on: {
        COMPLETE: 'completed',
      },
    },
    completed: {
      type: 'final',
    },
    expired: {
      type: 'final',
    },
  },
});

// State type helpers
export type DMState = typeof dmSessionMachine;
export type DMStateValue = 'waiting' | 'active' | 'scene_submission' | 'scene_review' | 'debrief' | 'completed' | 'expired';

// Map XState state value to DB status string
export function stateValueToStatus(value: DMStateValue): string {
  return value;
}

// Map DB status string to XState state value
export function statusToStateValue(status: string): DMStateValue {
  return status as DMStateValue;
}

// Get the next state value based on current scene + total scenes
export function getNextState(currentScene: number, totalScenes: number): 'debrief' | 'scene_submission' {
  return currentScene >= totalScenes - 1 ? 'debrief' : 'scene_submission';
}

// Calculate if a session has expired based on deadline
export function isSessionExpired(deadline: Date | null): boolean {
  if (!deadline) return false;
  return new Date() > deadline;
}
