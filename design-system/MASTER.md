# Master Design System - Uzbek Logo Quiz (Cyber-Neo Brutalism)

This design system establishes a high-energy, tactile **Vibrant & Block-based** (Neo-Brutalist) aesthetic optimized for a mobile Telegram Mini App. It uses bold outlines, solid offset shadows, and high contrast saturated colors on a dark obsidian background to create a premium, interactive gaming feel.

## 1. Visual Style: Cyber-Neo Brutalism
*   **Outlines**: 3px solid `#060913` (black-blue) on primary components, cards, and buttons. 2px solid on smaller elements.
*   **Shadows (Offset)**: Solid 0-blur offset shadows instead of soft blurs.
    *   Large Cards / Modals: `6px 6px 0px #060913`
    *   Standard Buttons / Inputs: `4px 4px 0px #060913`
    *   Keyboard Keys: `3px 3px 0px #060913`
*   **Corner Radii**:
    *   Cards / Modals: `16px`
    *   Buttons / Keys: `10px`
    *   Input Slots: `10px`

## 2. Color Palette (Dark Theme Base)
*   **Background (Canvas)**: `#0B0F19` (Obsidian Blue) to `#121826` gradient.
*   **Cards (Surface)**: `#182032` (Deep Navy Slate).
*   **Primary Accent (Purple)**: `#8B5CF6` (Vibrant Amethyst)
    *   Press State: shifts down, offset shadow reduces.
*   **Secondary Accent (Blue)**: `#2563EB` (Electric Blue)
*   **Success Accent (Green)**: `#10B981` (Emerald Neo Green)
*   **Danger/Error Accent (Red)**: `#EF4444` (Vivid Crimson)
*   **Reward Accent (Gold)**: `#F59E0B` (Amber Gold)
*   **Outline/Borders**: `#060913`

## 3. Typography (Bold & Clean)
*   **Primary Font**: `'Outfit', sans-serif` (Google Fonts).
*   **Weight Scale**:
    *   Title/Numbers: `800` (Extra Bold) or `900` (Black)
    *   Buttons/Labels: `700` (Bold)
    *   Body/Helper text: `500` (Medium)

## 4. Interactive States & Micro-Animations
*   **Key Tap Physics**:
    *   Normal: `transform: translate(0, 0); box-shadow: 3px 3px 0px #060913;`
    *   Active/Pressed: `transform: translate(3px, 3px); box-shadow: 0px 0px 0px #060913;`
*   **Input Slots**:
    *   Incorrect state triggers a horizontal shake animation (`shake` keyframes).
    *   Correct state triggers a slight scale bounce and a glowing pulse.
*   **Coin Reward**:
    *   Golden coin badge animates with a persistent gentle vertical float.
    *   Awarded coins pop up with a scale-up bounce.

## 5. Accessibility (WCAG 2.1)
*   Text contrast ratios are maintained at `> 4.5:1` against their colored background cards (e.g. white text on purple/blue, black text on gold/green).
*   No information is conveyed by color alone — visual iconography (check icon for solved, lock icon for locked, chevron for next) and text instructions ("Bu qanday logotip?", "Topildi") are always present.
