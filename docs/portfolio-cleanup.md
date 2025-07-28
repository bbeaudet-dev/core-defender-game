# Portfolio Cleanup Specification

## Overview

This document outlines the comprehensive cleanup and improvements needed to make Core Defender portfolio-ready. The goal is to polish the user experience, fix bugs, improve code structure, and enhance the overall game mechanics.

## 1. Guest Access Flow Fix

### Issue

- Guest access has a delay between screens before reaching the CORE DEFENDER Download page
- Should transition directly to download page

### Tasks

- [ ] Investigate the guest access flow in `app/components/login/`
- [ ] Identify the delay source (likely in `LoginScreen.tsx` or `WelcomeGameScreen.tsx`)
- [ ] Remove unnecessary intermediate screens or delays
- [ ] Test guest flow for smooth transition

### Files to Review

- `app/components/login/LoginScreen.tsx`
- `app/components/login/WelcomeGameScreen.tsx`
- `app/contexts/AuthContext.tsx`

## 2. Tutorial to About Rename

### Issue

- Tutorial module should be renamed to "About" for better clarity

### Tasks

- [ ] Rename `app/components/Modules/tutorial/` folder to `about/`
- [ ] Update `TutorialModule.tsx` to `AboutModule.tsx`
- [ ] Update all imports and references
- [ ] Update module registration in unlock system
- [ ] Update navigation and routing

### Files to Modify

- `app/components/Modules/tutorial/TutorialModule.tsx` → `about/AboutModule.tsx`
- `app/utils/unlockSystem.ts`
- Any navigation references

## 3. Sound Effects Cleanup

### Issue

- Bugged sound effects need removal
- Sound system needs optimization

### Tasks

- [ ] Audit all sound files in `assets/sounds/`
- [ ] Remove corrupted or non-functioning sound files
- [ ] Test all sound effects in game
- [ ] Update sound manager to handle missing files gracefully
- [ ] Optimize sound loading and caching

### Files to Review

- `app/utils/soundManager.ts`
- `app/utils/soundEffects/`
- `assets/sounds/`

## 4. Header and Layout Improvements

### Issue

- Inconsistent headers across modules
- General layout needs standardization

### Tasks

- [ ] Create standardized header component
- [ ] Update all module headers to use consistent styling
- [ ] Improve overall layout consistency
- [ ] Add proper spacing and alignment standards

### Files to Modify

- `app/components/ui/ModuleHeader.tsx`
- All module components

## 5. Font Standardization

### Issue

- Camera module uses 7 different fonts
- Inconsistent font usage across modules

### Tasks

- [ ] Audit font usage across all modules
- [ ] Create font hierarchy system
- [ ] Standardize font usage (primary, secondary, accent fonts)
- [ ] Update camera module to use consistent fonts
- [ ] Document font standards

### Files to Review

- `app/components/Modules/camera/`
- All module components
- `tailwind.config.js` for font configuration

## 6. Calculator Improvements

### Issue

- Calculator formatting needs improvement
- Puzzle logic needs enhancement

### Tasks

- [ ] Improve calculator UI layout
- [ ] Enhance puzzle difficulty and logic
- [ ] Add better visual feedback
- [ ] Standardize with other modules

### Files to Modify

- `app/components/Modules/calculator/CalculatorModule.tsx`

## 7. System App Restructure

### Issue

- System app is difficult to navigate
- Contains unnecessary components

### Tasks

- [ ] Simplify navigation structure
- [ ] Remove unnecessary sections
- [ ] Keep only essential system information
- [ ] Improve user flow

### Files to Modify

- `app/components/Modules/about/System/`
- `app/components/Modules/about/SystemModule.tsx`

## 8. Music Module Enhancement

### Issue

- Need 1-2 new songs
- Current music selection limited

### Tasks

- [ ] Add 1-2 new music tracks
- [ ] Update music tracks list
- [ ] Ensure proper licensing for new tracks
- [ ] Test music playback

### Files to Modify

- `app/components/Modules/music/MusicTracks.tsx`
- `assets/sounds/` (add new music files)

## 9. Codebase Structure Improvements

### Issue

- Layout of apps cannot be easily changed
- Code structure needs more flexibility

### Tasks

- [ ] Refactor module layout system
- [ ] Create flexible grid/layout system
- [ ] Improve component reusability
- [ ] Standardize module structure
- [ ] Create better abstraction layers

### Files to Review

- All module components
- `app/components/ui/ScreenTemplate.tsx`
- Module registration system

## 10. Terminal Module Cleanup

### Issue

- Terminal needs rework or cleanup
- Puzzle answer not obvious enough

### Tasks

- [ ] Simplify terminal interface
- [ ] Make puzzle answer more discoverable
- [ ] Improve user guidance
- [ ] Clean up terminal logic

### Files to Modify

- `app/components/Modules/terminal/TerminalModule.tsx`

## 11. Bugged Effects Enhancement

### Issue

- Need more "bugged" effects to enhance game atmosphere
- Current effects may be insufficient

### Tasks

- [ ] Add glitch effects to modules
- [ ] Implement visual corruption effects
- [ ] Add audio glitches
- [ ] Create progressive corruption system

### Files to Modify

- `app/components/ui/GlitchText.tsx`
- Add new glitch effect components
- Update sound effects

## 12. Error Message Fixes

### Issue

- Compass shows "cannot update a module" error
- Accelerometer has error messages
- Other modules may have similar issues

### Tasks

- [ ] Fix compass error handling
- [ ] Fix accelerometer error messages
- [ ] Audit all modules for error handling
- [ ] Implement proper error states

### Files to Modify

- `app/components/Modules/compass/CompassModule.tsx`
- `app/components/Modules/accelerometer/AccelerometerModule.tsx`
- Error handling in all modules

## 13. Microphone Layout Improvements

### Issue

- Microphone module needs better formatting and layout

### Tasks

- [ ] Improve microphone UI layout
- [ ] Better visual feedback for audio levels
- [ ] Standardize with other modules
- [ ] Enhance user experience

### Files to Modify

- `app/components/Modules/microphone/MicrophoneModule.tsx`
- `app/components/Modules/microphone/AudioLevelIndicator.tsx`
- `app/components/Modules/microphone/AudioWaveform.tsx`

## 14. End Game Logic Fix

### Issue

- End of game triggers before boss is defeated
- Reaction test completes game but doesn't complete games module
- Number guess game gives "final boss defeated" notification incorrectly

### Tasks

- [ ] Fix end game trigger logic
- [ ] Ensure proper module completion tracking
- [ ] Fix reaction test module completion
- [ ] Fix number guess game completion logic
- [ ] Review all game completion conditions

### Files to Modify

- `app/contexts/ModuleUnlockContext.tsx`
- `app/components/Modules/games/`
- `app/components/Modules/finalboss/FinalBossModule.tsx`

## 15. Infection Progress Bar Fix

### Issue

- Infection progress bar always shows critical
- Progress tracking not working

### Tasks

- [ ] Fix infection progress calculation
- [ ] Implement proper progress tracking
- [ ] Update progress bar display logic
- [ ] Test progress bar functionality

### Files to Modify

- `app/components/infection/InfectionProgressBar.tsx`
- `app/contexts/InfectionContext.tsx`
- `app/utils/infectionSequence.ts`

## 16. Boss Battle Rework

### Issue

- Boss battle is boring and doesn't work
- Doesn't progress to next phase
- Needs complete rework

### Tasks

- [ ] Redesign boss battle mechanics
- [ ] Implement proper phase progression
- [ ] Add engaging gameplay elements
- [ ] Create multiple boss phases
- [ ] Add boss health/status system

### Files to Modify

- `app/components/Modules/finalboss/FinalBossModule.tsx`
- Boss battle logic and state management

## 17. Victory Animation

### Issue

- No victory animation when game is completed
- Anti-climactic ending

### Tasks

- [ ] Design victory animation sequence
- [ ] Implement victory screen
- [ ] Add celebration effects
- [ ] Create satisfying completion experience

### Files to Create/Modify

- New victory animation component
- Update game completion flow

## 18. Component Cleanup and Renaming

### Issue

- BugIcons and BugAnimation components are not being used
- BugAnimation contains system compromise animation, should be renamed
- LoginScreen and WelcomeGameScreen are redundant
- infectionSequence utility appears to be obsolete

### Tasks

- [x] Delete unused BugIcons component
- [x] Rename BugAnimation to SystemCompromisedAnimation
- [x] Remove bug-related content from SystemCompromisedAnimation
- [x] Fix guest access delay by removing redundant delay in LoginScreen
- [x] Remove obsolete infectionSequence utility
- [x] Update all imports and references

### Files to Delete/Modify

- Delete: `app/components/infection/BugIcons.tsx`
- Rename: `app/components/infection/BugAnimation.tsx` → `app/components/infection/SystemCompromisedAnimation.tsx`
- Delete: `app/components/login/WelcomeGameScreen.tsx`
- Delete: `app/utils/infectionSequence.ts`
- Update: `app/components/ui/AppIconWithHalo.tsx` (remove BugIcon import)
- Update: All references to deleted/renamed components

## 19. Data Centralization and Standardization

### Issue

- Module data is scattered across components
- Layout configurations are hardcoded
- No centralized data management system

### Tasks

- [ ] Create centralized data structure in `app/data/`
- [ ] Standardize module configurations
- [ ] Create layout configuration system
- [ ] Move hardcoded data to centralized files
- [ ] Implement data-driven module system

### Files to Create/Modify

- Create: `app/data/modules.ts` (module configurations)
- Create: `app/data/layouts.ts` (layout configurations)
- Create: `app/data/constants.ts` (app constants)
- Create: `app/data/types.ts` (shared types)
- Update: All module components to use centralized data

## Implementation Priority

### High Priority (Critical Bugs)

1. Guest access flow fix
2. End game logic fix
3. Infection progress bar fix
4. Error message fixes
5. Component cleanup and renaming

### Medium Priority (User Experience)

6. Font standardization
7. Header and layout improvements
8. Calculator improvements
9. Microphone layout
10. System app restructure
11. Data centralization and standardization

### Low Priority (Polish)

12. Tutorial to About rename
13. Sound effects cleanup
14. Music module enhancement
15. Terminal cleanup
16. Bugged effects enhancement
17. Boss battle rework
18. Victory animation
19. Codebase structure improvements

## Testing Checklist

- [ ] Test guest access flow
- [ ] Test all module functionality
- [ ] Test sound effects
- [ ] Test game completion logic
- [ ] Test infection progress
- [ ] Test boss battle
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Test performance

## Notes

- All changes should maintain the cyberpunk/glitch aesthetic
- Ensure backward compatibility where possible
- Document any breaking changes
- Test thoroughly before deployment
- Consider user feedback for priority adjustments


## More to add

- Fix live data plots
- 