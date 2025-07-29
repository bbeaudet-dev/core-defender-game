# Home Screen Integration Spec

## Project Overview

Integrate the reboot sequence with the home screen to create a seamless experience that eliminates background loading issues and provides a more dynamic game flow. This will replace the current separate reboot sequence with an integrated phase-based home screen system. Improve game flow and progression centered around home screen.

## Current State Analysis

### Existing State Management

- **InfectionContext**: Manages `infectionProgress` (0-100%) and `infectionStatus` (LOW, MILD, CRITICAL)
- **PuzzleContext**: Manages completed puzzles and module unlock logic
- **HomeScreen**: Has `unlockedModules` state and `isFinalBossDefeated` logic
- **FinalBossModule**: Phase-based progression system (intro, phase1-4, victory, defeat)

### Current Flow Issues

1. **Background Loading Bug**: Jarring transition when home screen loads after reboot sequence
2. **Separate Components**: Reboot sequence and home screen are disconnected
3. **No Seamless Integration**: Video → Reboot → Home creates visual gaps
4. **Video Timing Issues**: Video was getting cut off early and reboot sequence appearing too soon

### Recent Fixes Applied

- **Video Duration**: Fixed to use actual video duration (7.733 seconds) instead of hardcoded values
- **Alarm Sequence**: Reduced from 3 seconds to 2 seconds for snappier experience
- **Reboot Overlay Timing**: Reduced from 2 seconds to 1 second before video end
- **Video Playback**: Fixed video to play immediately while overlay fades in
- **Animation Continuity**: System compromised button now pulses continuously until component unmounts

## Proposed Solution

### New Home Screen Phase System

Add `homeScreenPhase` state to HomeScreen component with three phases:

#### Phase 1: `'reboot'`

- **Background**: Red frame with glowing border (already loaded from video sequence)
- **Content**:
  - Reboot messages (animated with blinking colon)
  - Infection progress bar
  - CORE module prominently displayed with "MANUAL RESTORATION" message
  - No other modules visible
- **Duration**: Until user interaction or timeout
- **Transition**: Fade out messages, fade in all modules

#### Phase 2: `'restoration'`

- **Background**: Red frame (current behavior)
- **Content**:
  - All unlocked modules visible
  - Infection progress bar
  - Normal home screen functionality
- **Duration**: Until final boss is defeated
- **Transition**: Background changes to green when `isFinalBossDefeated` is true

#### Phase 3: `'restored'`

- **Background**: Green background (current restored state)
- **Content**:
  - All modules unlocked and visible
  - No infection progress bar
  - Full restored functionality
- **Duration**: Permanent (game completed)

### Implementation Details

#### State Management

```typescript
// Add to HomeScreen component
const [homeScreenPhase, setHomeScreenPhase] = useState<
  "reboot" | "restoration" | "restored"
>("reboot");
```

#### Phase Logic

```typescript
// Phase determination logic
useEffect(() => {
  if (isFinalBossDefeated) {
    setHomeScreenPhase("restored");
  } else if (homeScreenPhase === "reboot") {
    // Stay in reboot phase until user interaction
    // Could add timeout or tap-to-continue
  } else {
    setHomeScreenPhase("restoration");
  }
}, [isFinalBossDefeated, homeScreenPhase]);
```

#### UI Components by Phase

- **Reboot Phase**:
  - Reboot messages (from RebootSequence component)
  - InfectionProgressBar
  - CORE module (prominently displayed)
  - Tap-to-continue indicator

- **Restoration Phase**:
  - All unlocked modules
  - InfectionProgressBar
  - Normal home screen layout

- **Restored Phase**:
  - All modules unlocked
  - No infection bar
  - Green background

### Integration Points

#### Video Flow Changes

- **Current**: Video → RebootSequence → HomeScreen
- **New**: Video → HomeScreen (in 'reboot' phase)

#### Component Integration

- **RebootSequence**: Extract reboot message logic into HomeScreen
- **InfectionProgressBar**: Already exists, use in reboot phase
- **CORE Module**: Display prominently during reboot phase

### Reboot Sequence Animation Details

The reboot sequence should display:

1. **First 3 lines** (200ms between each):
   - "REBOOTING IN EMERGENCY MODE..."
   - "INITIALIZING CORE SYSTEM..."
   - "ASSESSING SYSTEM HEALTH:"

2. **Blinking colon** (1.5 seconds):
   - The ":" after "ASSESSING SYSTEM HEALTH" blinks for 1.5 seconds
   - 500ms on, 500ms off cycle

3. **Final 3 lines** (with specific delays):
   - "INEFECTION DETECTED - SYSTEM CRITICAL" (immediately)
   - "MANUAL RESTORATION REQUIRED" (500ms later)
   - "GOOD LUCK SOLDIER" (1 second after restoration)

4. **Infection Progress Bar**: Appears when "INFECTION DETECTED" line shows

5. **CORE Module**: Appears with "MANUAL RESTORATION" message

## Benefits

1. **Eliminates Background Loading Bug**: Red background already loaded
2. **Seamless Experience**: No jarring transitions between components
3. **Better State Management**: Single source of truth for home screen phases
4. **Simplified Game Completion**: Clear progression through phases
5. **Enhanced UX**: CORE module prominently displayed during "restoration" phase
6. **Consistent Animation**: No stationary button moments during transitions

## Technical Considerations

- **Performance**: No additional background loading required
- **State Consistency**: Integrates with existing infection and puzzle contexts
- **Backward Compatibility**: Maintains all existing functionality
- **Animation**: Smooth transitions between phases
- **React State Updates**: Avoid render-phase state updates (use setTimeout with 0 delay)

## Implementation Priority

### Phase 1: Foundation (High Priority)

1. Add `homeScreenPhase` state to HomeScreen component
2. Extract reboot message logic from RebootSequence component
3. Implement basic phase-specific UI rendering
4. Update video flow to go directly to HomeScreen instead of RebootSequence

### Phase 2: Integration (Medium Priority)

1. Add infection progress bar to reboot phase
2. Implement CORE module display during reboot phase
3. Add phase transition animations
4. Implement user interaction to advance from reboot phase

### Phase 3: Polish (Low Priority)

1. Add tap-to-continue indicator
2. Fine-tune timing and animations
3. Add sound effects for phase transitions
4. Test edge cases and error handling

## Testing Checklist

- [ ] Video plays correctly and transitions to home screen
- [ ] Reboot phase displays correctly with all messages
- [ ] Infection progress bar appears at correct time
- [ ] CORE module displays prominently during reboot phase
- [ ] Phase transitions work smoothly
- [ ] All existing home screen functionality preserved
- [ ] Final boss defeat still triggers restored phase
- [ ] No background loading issues
- [ ] No stationary button moments

## Potential Challenges

1. **Component Complexity**: HomeScreen will become more complex with multiple phases
2. **State Management**: Need to ensure phase state doesn't conflict with existing states
3. **Animation Timing**: Coordinating multiple animations and transitions
4. **User Experience**: Ensuring the flow feels natural and intuitive

## Success Metrics

- [ ] No visible background loading transitions
- [ ] Smooth animation flow from video to home screen
- [ ] Clear progression through game phases
- [ ] Enhanced user engagement with CORE module prominence
- [ ] Maintained performance and functionality

## Next Steps

### Phase 1: Foundation (High Priority)

1. **Implement Phase 1 foundation** from spec above
2. **Refactor app visibility and unlock system** - improve how modules become visible and unlockable
3. **Fix infection bar functionality** - ensure it properly reflects puzzle completion progress

### Phase 2: Core Integration (Medium Priority)

1. **Implement CORE boss phases across the entire game** - not just within final boss module
2. **Remove unused/bad modules** - identify and remove 2 modules that aren't working well
3. **Redesign CORE app layout** - make CORE app icon take up the entire bottom row
4. **Move Wifi and Battery into System module** - integrate as solvable puzzles within System module

### Phase 3: Enhanced Gameplay (Medium Priority)

1. **Add puzzle count notifications** - show how many puzzles remain to be solved on each app
2. **Add more puzzles to existing modules** - expand puzzle content across modules
3. **Improve module unlock progression** - better pacing and discovery of new modules

### Phase 4: Polish and Optimization (Low Priority)

1. **Fine-tune animations and transitions**
2. **Add sound effects for new interactions**
3. **Optimize performance and loading times**
4. **Test edge cases and error handling**

## Detailed Feature Specifications

### CORE Boss Phases Across Game

- **Phase 1**: Early game - Limited module access, high infection
- **Phase 2**: Mid game - More modules unlock, infection decreases
- **Phase 3**: Late game - Most modules available, low infection
- **Phase 4**: Final boss - All modules unlocked, final confrontation
- **Phase 5**: Victory - System restored, green background

### Module Refactoring

- **Remove**: 2 modules that aren't working well (TBD based on user feedback)
- **Integrate**: Wifi and Battery puzzles into System module
- **Enhance**: CORE module with full bottom row layout
- **Improve**: Puzzle progression and unlock logic

### Puzzle System Enhancements

- **Notification Badges**: Show remaining puzzle count on app icons
- **Progressive Difficulty**: Puzzles get harder as game progresses
- **Cross-Module Puzzles**: Some puzzles require multiple modules
- **Achievement System**: Track puzzle completion milestones

### Infection Bar Fixes

- **Accurate Progress**: Ensure bar reflects actual puzzle completion
- **Visual Feedback**: Better indication of progress and status
- **Phase Integration**: Different bar behavior in different game phases

This approach leverages existing state management while creating a more cohesive and polished user experience that addresses all current issues and adds significant gameplay improvements.