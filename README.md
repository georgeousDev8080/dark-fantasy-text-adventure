# The Monastery of the Eternal Vigil

> A bite-sized dark fantasy text adventure inspired by Stories Untold

An experimental text adventure that blends traditional parser-based gameplay with evolving mechanics—ritual phrases, cipher puzzles, and symbolic patterns—all presented within a beautifully crafted grimoire interface.

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/b4ac573d-87a9-45cb-b11f-3cbda50a7d6e" />

## 🎮 About

**The Monastery of the Eternal Vigil** places you in a cursed monastery where typing becomes ritual, decoding becomes discovery, and choices echo through three distinct endings. Drawing inspiration from Stories Untold's innovative approach to text adventures, this game transforms the interface itself into part of the narrative puzzle.

**Playtime:** 10-15 minutes | **Replayability:** 3 unique endings

## ✨ Features

- **🔄 Evolving Mechanics** - Progress from traditional text commands to experimental inputs (ritual phrases, cipher decoding, pattern recognition)
- **📖 Grimoire Interface** - Play within a beautifully rendered ancient tome with 3D CSS effects and aged parchment aesthetics
- **🧠 Sophisticated Parser** - Natural language processing with synonym support, context-awareness, and verb-noun extraction
- **💾 Save System** - Full save/load functionality using localStorage
- **⌨️ Typewriter Effects** - Atmospheric text reveals with skip functionality
- **📱 Fully Responsive** - Seamless experience on desktop and mobile devices
- **🎭 Multiple Endings** - Three distinct conclusions based on your choices and discoveries
- **🔍 Rich Exploration** - Hidden secrets, easter eggs, and atmospheric storytelling

## 🎯 The Five Scenes

### 1. The Scriptorium
Traditional text adventure mechanics introduce the basics. Explore an abandoned desk, discover mysterious artifacts, and unlock the path forward.

**Core Mechanic:** Standard commands (LOOK, EXAMINE, TAKE, USE)

### 2. The Library
The first shift—ritual phrases demand exact inputs. Scattered manuscripts provide Latin incantations needed to access forbidden knowledge.

**Core Mechanic:** Exact phrase matching (`APERI PORTAS`, `REVELA SECRETUM`, `LUMEN TENEBRIS`)

### 3. The Forbidden Archives
Cipher challenge presents encoded texts. Use the provided substitution key to decode messages revealing the monastery's dark history.

**Core Mechanic:** Caesar cipher decoding (A↔Z substitution)

### 4. The Ritual Chamber
Pattern recognition test requires observing and inputting mystical rune sequences discovered throughout your journey.

**Core Mechanic:** Symbol sequence input

### 5. The Revelation
Your choices converge into one of three endings:
- **Embrace the Darkness** - Become guardian of forbidden knowledge
- **Resist and Escape** - Seal the grimoire and flee
- **Transcend the Curse** - Discover hidden truth and break the cycle

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/georgeousDev/monastery-eternal-vigil.git

# Navigate to directory
cd monastery-eternal-vigil

# Open in browser
open index.html
```

Or simply download and double-click `index.html` - no build process required!

### Playing Online

**[▶️ Play Now]([https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/74ed0fd8ebd3ecf3c65ac43afe56bd3f/8e4aa0f1-15b7-4389-a6fb-f74fb022b9a0/index.html](https://georgeousdev8080.github.io/dark-fantasy-text-adventure/))**

## 🎲 How to Play

### Basic Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `LOOK` | `L` | Examine current location |
| `EXAMINE [item]` | `X [item]` | Detailed item description |
| `TAKE [item]` | `GET [item]` | Add to inventory |
| `USE [item]` | - | Activate/use an item |
| `GO [direction]` | `N`, `S`, `E`, `W` | Navigate spaces |
| `INVENTORY` | `I` | View carried items |
| `HELP` | - | Show available commands |
| `HINT` | - | Contextual guidance |

### Advanced Commands

- `SAVE` / `LOAD` - Manage game progress
- `SEARCH` - Look for hidden items
- `READ [item]` - Read documents and manuscripts
- `WAIT` - Pass time, trigger events
- `RESTART` - Begin anew

### Pro Tips

- 🔍 Examine everything multiple times for deeper lore
- 📝 Pay attention to manuscript fragments—they contain puzzle solutions
- 💡 Use `HINT` if stuck after several attempts
- ⬆️ Arrow keys cycle through command history
- 🎯 Different choices lead to different endings—save often!

## 🛠️ Technical Details

### Architecture

```
├── index.html          # Single-page application structure
├── style.css           # Grimoire UI, animations, responsive design
└── game.js             # Core game logic
    ├── Game State Manager
    ├── Text Parser Module
    ├── UI Renderer
    ├── Command Handlers
    └── Story Data Structure
```

### Key Systems

**Text Parser**
- Regex-based verb-noun extraction
- Synonym matching and normalization
- Context-sensitive command validation
- Special mechanic detection (rituals, ciphers, patterns)

**State Management**
```javascript
gameState = {
  currentScene: number,
  currentLocation: string,
  inventory: Item[],
  flags: { [key: string]: boolean },
  visitedLocations: string[],
  turnCount: number,
  choices: string[]
}
```

**Visual Framework**
- CSS Grid/Flexbox for grimoire layout
- Custom CSS animations (page curls, typewriter effects)
- Responsive breakpoints for mobile optimization
- localStorage persistence for save states

### Color Palette

| Element | Hex | Usage |
|---------|-----|-------|
| Background | `#1a1410` | Monastery darkness |
| Tome Leather | `#3d2817` | Grimoire binding |
| Parchment | `#f4e4c1` | Page surface |
| Text | `#2a1810` | Primary copy |
| Accent Gold | `#8b7355` | Interactive elements |

### Typography

- **Body Text:** EB Garamond, Crimson Text (serif)
- **Headers:** Celtic/Gothic display fonts
- **Monospace:** Courier New (cipher mechanics)

## 🎨 Design Philosophy

This project demonstrates how **interface can be narrative**. Inspired by Stories Untold's meta-textual approach, typing itself becomes significant:

- Ritual phrases must be **exact** - precision matters
- Ciphers demand **attention** - observation rewards
- Patterns require **memory** - exploration pays off

The result is an experience where mechanics and story intertwine, creating meaning through interaction rather than exposition.

## 🐛 Known Issues

- None currently! Please report any bugs via Issues.

## 🚧 Future Enhancements

- [ ] Additional endings and branching paths
- [ ] Sound effects and ambient audio
- [ ] Achievement system
- [ ] Extended lore documents
- [ ] Accessibility improvements (screen reader support)

## 🤝 Contributing

This is a personal portfolio project, but suggestions and bug reports are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎭 Easter Eggs

Can you find them all?

- `EXAMINE AUTHOR` - Developer credits
- `XYZZY` - Classic adventure game reference
- Hidden passages require specific command combinations
- Multiple item examinations reveal deeper lore

## 📝 Credits

**Created by georgeousDev** - A spare-time passion project

**Inspired by:**
- Stories Untold (No Code Studios)
- Classic text adventures (Zork, Colossal Cave Adventure)
- Gothic horror literature

**Technologies:**
- Pure vanilla JavaScript (ES6+)
- CSS3 (Grid, Flexbox, Animations)
- HTML5 localStorage API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo:** [Play Now]([https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/74ed0fd8ebd3ecf3c65ac43afe56bd3f/8e4aa0f1-15b7-4389-a6fb-f74fb022b9a0/index.html](https://georgeousdev8080.github.io/dark-fantasy-text-adventure/))
- **LinkedIn:** [georgeousDev](https://www.linkedin.com/in/george-gararizos-0392b52aa/)
- **Report Issues:** [GitHub Issues](#)

***

**⭐ If you enjoyed this experience, please consider starring the repository!**

*"The monastery awaits. Will you embrace the darkness, resist its call, or transcend the curse entirely?"*
