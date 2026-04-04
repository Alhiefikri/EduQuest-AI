# ISSUE 19: UI/UX Enhancements & Generation Bug Fixes

## Problem Statement

To further improve the user experience (UX) and fix a critical workflow bug during question editing, we need to introduce several layout improvements and resolve a numbering state issue on the frontend. 

Currently:
1. **Sidebar Navigation**: The sidebar is fixed. Users need the ability to expand and collapse the sidebar to maximize their workspace area.
2. **Question Ordering**: There is no intuitive way to reorder the generated questions. Users need a drag-and-drop mechanism to swap or move question numbers easily.
3. **Regeneration Bug**: When a user regenerates a specific single question (e.g., question number 3), the new generated question incorrectly resets its number to "1", disrupting the numbering sequence.

## Objectives / Technical Requirements

### 1. Collapsible Sidebar (Frontend)
- Modify the existing App Shell or Sidebar component (`frontend/src/components/Sidebar.tsx` or similar).
- Implement a toggle button (Chevron/Hamburger) to shrink the sidebar into an icon-only mode and expand it back to full width.
- Ensure smooth CSS transitions and maintain Shadcn UI design guidelines.

### 2. Drag-and-Drop Question Ordering (Frontend)
- Integrate a reliable drag-and-drop capability (e.g., `@hello-pangea/dnd` or `dnd-kit`) on the `EditSoal.tsx` page.
- Allow users to click and drag a question card/item to reorder it within the list.
- After a drag action completes, update the state specifically to sequentially re-number the `nomor` property of all questions in the new array.
- Ensure the updated array reflects correctly in the UI.

### 3. Fix Question Numbering Bug on Regeneration (Frontend)
- **Root Cause**: The API response from the single-regeneration endpoint likely does not map the old `nomor` to the new generated item, or the frontend state updater replaces the object without preserving the original index.
- **Fix in `EditSoal.tsx`**: When the `regenerateSingleSoal` mutation succeeds, ensure the returned question object inherits the exact `nomor` of the question it is replacing.
- For example: If replacing `soal[2]` (which represents number 3), the injected response must explicitly have `.nomor = 3` before triggering `setSoalData`.

## Acceptance Criteria
- [ ] Users can toggle the sidebar width (expand/collapse) using a dedicated UI button.
- [ ] Users can drag questions up and down; the visual order and numbering sequence (1, 2, 3...) remain logically intact after the drop.
- [ ] Regenerating a single question strictly preserves its position and number (regenerating #3 keeps it as #3).

## Recommended Approach for Junior Agent
- **Framework**: Use React states locally. For Drag-and-Drop, `dnd-kit` is highly recommended for modern React applications. 
- **Refactoring**: Ensure changes in the sidebar do not break responsive mobile views. 
- **Bug Fix**: Pay close attention to the `.map()` function used inside the `onSuccess` callback of the `regenerateSingleMutation` inside `EditSoal.tsx`.
