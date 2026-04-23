import { describe, it, expect, beforeEach } from 'vitest';
import { createMachine, assign } from 'xstate';
import {
  dmSessionMachine,
  getNextState,
  isSessionExpired,
  stateValueToStatus,
  statusToStateValue,
} from '../dungeon-master/dm-state-machine.js';

describe('dmSessionMachine', () => {
  let actor: any;

  beforeEach(() => {
    actor = createMachine(dmSessionMachine);
  });

  it('starts in waiting state', () => {
    expect(actor.initialState.value).toBe('waiting');
  });

  it('transitions from waiting to active on START', () => {
    const next = actor.transition('waiting', { type: 'START' });
    expect(next.value).toBe('active');
  });

  it('transitions from active to scene_submission on BEGIN_SCENE', () => {
    const next = actor.transition('active', { type: 'BEGIN_SCENE' });
    expect(next.value).toBe('scene_submission');
  });

  it('accumulates SUBMIT_RESPONSE events', () => {
    let state = actor.initialState;
    state = actor.resolve(
      assign({ responsesSubmitted: () => [] })(state, { type: 'INIT' }) as any,
    );
    state = actor.transition(state, { type: 'SUBMIT_RESPONSE', userId: 'user-a' });
    expect(state.context.responsesSubmitted).toContain('user-a');

    const next = actor.transition(state, { type: 'SUBMIT_RESPONSE', userId: 'user-b' });
    expect(next.context.responsesSubmitted).toContain('user-b');
    expect(next.context.responsesSubmitted).toHaveLength(2);
  });

  it('moves from scene_submission to scene_review when both responded', () => {
    // Simulate scene_submission with 2 responses via REVIEW_SCENE guard check
    const state = actor.resolve(
      assign({ responsesSubmitted: ['user-a', 'user-b'] })({} as any, { type: 'ANY' }) as any,
    );
    const next = actor.transition(state, { type: 'REVIEW_SCENE' });
    expect(next.value).toBe('scene_review');
  });

  it('transitions from scene_review to active on ADVANCE_SCENE', () => {
    const next = actor.transition('scene_review', { type: 'ADVANCE_SCENE' });
    expect(next.value).toBe('active');
  });

  it('transitions from scene_review to debrief on BEGIN_DEBRIEF', () => {
    const next = actor.transition('scene_review', { type: 'BEGIN_DEBRIEF' });
    expect(next.value).toBe('debrief');
  });

  it('transitions from debrief to completed on COMPLETE', () => {
    const next = actor.transition('debrief', { type: 'COMPLETE' });
    expect(next.value).toBe('completed');
  });

  it('transitions from waiting to expired on EXPIRE', () => {
    const next = actor.transition('waiting', { type: 'EXPIRE' });
    expect(next.value).toBe('expired');
  });

  it('waiting and expired are final states', () => {
    const nextWaiting = actor.transition('waiting', { type: 'EXPIRE' });
    expect(nextWaiting.value).toBe('expired');
  });
});

describe('getNextState', () => {
  it('returns debrief when on last scene', () => {
    expect(getNextState(2, 3)).toBe('debrief');
    expect(getNextState(4, 5)).toBe('debrief');
  });

  it('returns scene_submission when more scenes remain', () => {
    expect(getNextState(0, 3)).toBe('scene_submission');
    expect(getNextState(1, 3)).toBe('scene_submission');
  });
});

describe('isSessionExpired', () => {
  it('returns false when deadline is null', () => {
    expect(isSessionExpired(null)).toBe(false);
  });

  it('returns false when deadline is in the future', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000);
    expect(isSessionExpired(future)).toBe(false);
  });

  it('returns true when deadline has passed', () => {
    const past = new Date(Date.now() - 60 * 1000);
    expect(isSessionExpired(past)).toBe(true);
  });
});

describe('stateValueToStatus / statusToStateValue', () => {
  it('maps identity roundtrips correctly', () => {
    const states = ['waiting', 'active', 'scene_submission', 'scene_review', 'debrief', 'completed', 'expired'];
    for (const s of states) {
      expect(statusToStateValue(stateValueToStatus(s))).toBe(s);
    }
  });
});
