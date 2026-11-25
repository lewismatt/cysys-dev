# Theme study: Terminal vs. Quiet

Two directions for the cysys.dev landing page and the kit's default tokens. Same content, same logo idea (an open "C" around a red dot), different register. Open the `.html` files in a browser to see them live; the PNGs are 1280px desktop and 390px mobile renders.

Whichever is chosen becomes the kit's default mode; the other mode (light for Terminal, dark for Quiet) is derived from the same tokens in P2.

## Terminal

Dark, industrial, "systems contractor" HUD. The reference is in the open: status bar, unit designations, a targeting reticle, a classified slot.

| | |
| --- | --- |
| Background / text | `#0a0a0b` with a 48px grid / `#e8e6e3` |
| Accent | signal red `#e3342f`; status green and amber for unit state |
| Type | IBM Plex Sans Condensed (uppercase headings), IBM Plex Sans (body), IBM Plex Mono (labels) |
| Shapes | square corners, 1px rules, red corner brackets on cards |
| Files | [terminal.html](terminal.html), [desktop](terminal-desktop.png), [mobile](terminal-mobile.png) |

Strong identity, fun to extend (status and unit metadata map naturally to components). Risks: dense uppercase mono reads as costume if overused; red-on-black needs care for contrast in small text; it suits tools less well than a landing page.

## Quiet

Light, editorial, warm paper. The reference lives only in copy and details: the red dot in the mark, "Nothing self-aware", the footer line.

| | |
| --- | --- |
| Background / text | `#f5f3ee` / `#1b1a18` |
| Accent | deep red `#b3261e`, used only on the mark's dot and link arrows |
| Type | Newsreader (serif headings), Geist (body), Geist Mono (labels, addresses) |
| Shapes | no cards; ruled list rows, generous whitespace |
| Files | [quiet.html](quiet.html), [desktop](quiet-desktop.png), [mobile](quiet-mobile.png) |

Ages well, reads as a serious studio, and makes a neutral base for product tools. Risks: less memorable; the homage is easy to miss.

## Middle paths

Elements can move between the two: e.g. Quiet's layout and type in a dark palette with Terminal's status dots and unit numbers, or Terminal for the landing page only with Quiet as the kit's default for tools.
