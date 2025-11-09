/**
 * The Grimoire of Eternal Vigil
 * A Dark Fantasy Text Adventure by georgeousDev
 * 
 * Architecture:
 * - Game State Manager: Handles all game state, inventory, flags
 * - Text Parser: Processes player input and matches commands
 * - UI Renderer: Displays text with typewriter effect, updates UI
 * - Story Data: Contains all scenes, locations, items, and narrative text
 * - Command Handlers: Executes game commands and updates state
 */

// ===================================
// GAME DATA STRUCTURE
// ===================================

const GAME_DATA = {
  scenes: {
    scriptorium: {
      id: 'scriptorium',
      name: 'The Scriptorium',
      description: 'You awaken in the scriptorium of the Monastery of the Eternal Vigil. Moonlight streams through narrow windows, casting silver across abandoned desks. Dust motes drift lazily through the air. The room is eerily silent, save for the whisper of wind through ancient stones.',
      locations: {
        main: {
          description: 'The scriptorium lies in stillness. Your desk holds scattered quills, an overturned inkwell, and something you don\'t remember—an ancient ledger bound in cracked leather. A brass candelabra sits cold on a nearby shelf. The heavy oak door to the north stands closed.',
          items: ['ledger', 'key', 'candle'],
          exits: { north: 'library' },
          examined: false
        }
      }
    },
    library: {
      id: 'library',
      name: 'The Library',
      description: 'You push through the heavy oak door into a vast library. Towering shelves disappear into shadow above. The air is thick with the scent of old paper and something else—something ancient and watchful. Three manuscript fragments lie scattered on reading tables, their pages glowing faintly with an otherworldly light.',
      locations: {
        main: {
          description: 'The library stretches impossibly far. Moonlight filters through stained glass, painting the floor in shifting colors. You notice three manuscripts on separate tables, each radiating a subtle luminescence. The shadows seem to writhe at the edges of your vision.',
          items: ['manuscript1', 'manuscript2', 'manuscript3'],
          exits: { south: 'scriptorium', west: 'archives' },
          examined: false
        }
      },
      rituals: ['APERI PORTAS', 'REVELA SECRETUM', 'LUMEN TENEBRIS']
    },
    archives: {
      id: 'archives',
      name: 'The Forbidden Archives',
      description: 'The door to the Forbidden Archives swings open with a groan that sounds almost alive. The air grows cold. Before you lies a chamber filled with texts in languages that hurt to perceive. Stone tablets line the walls, covered in strange cipher markings.',
      locations: {
        main: {
          description: 'Ancient texts bound in materials you cannot identify fill the shelves. A stone pedestal in the center holds tablets inscribed with a cipher key. An encoded message is carved into the floor itself, glowing with eldritch light.',
          items: ['cipher-key', 'encoded-message'],
          exits: { east: 'library', north: 'ritual-chamber' },
          examined: false
        }
      }
    },
    'ritual-chamber': {
      id: 'ritual-chamber',
      name: 'The Ritual Chamber',
      description: 'You enter a circular chamber. The walls are covered in glowing runes arranged in a precise pattern. In the center, a nine-pointed star is carved into the stone floor. The air crackles with potential energy. You sense this is where everything has been leading.',
      locations: {
        main: {
          description: 'Nine mystical runes adorn the walls in a 3x3 grid, each pulsing with different colored light. The pattern seems to shift and change, but you catch glimpses of a sequence: positions 3, 7, 2, and 5 glow brighter than the others at certain moments.',
          items: ['rune-grid'],
          exits: { south: 'archives' },
          examined: false
        }
      },
      correctSequence: [3, 7, 2, 5]
    }
  },
  
  items: {
    ledger: {
      name: 'ancient ledger',
      description: 'The ledger is bound in leather that feels disturbingly warm. The pages are filled with names and dates, but as you read, the words shift and reform. A message emerges: "Seek the three keys of knowledge in the library beyond. Speak the words of power, decode the hidden truth, complete the pattern of the ancients."',
      takeable: true,
      keywords: ['ledger', 'book', 'ancient ledger', 'tome'],
      read: 'The text shifts before your eyes, revealing cryptic instructions about rituals and hidden knowledge.'
    },
    key: {
      name: 'brass key',
      description: 'A tarnished brass key covered in strange engravings. It feels cold to the touch, colder than the air around you. The engravings seem to move in your peripheral vision.',
      takeable: true,
      keywords: ['key', 'brass key', 'brass'],
      useWith: 'door'
    },
    candle: {
      name: 'candle',
      description: 'A half-melted tallow candle. Its wick is black and twisted. You sense it could provide light in dark places.',
      takeable: true,
      keywords: ['candle', 'light'],
      usable: true
    },
    manuscript1: {
      name: 'first manuscript',
      description: 'The manuscript is written in flowing script. The words seem to glow: "APERI PORTAS - To open the gates of knowledge, speak these words aloud."',
      takeable: true,
      keywords: ['manuscript', 'first manuscript', 'manuscript1', 'fragment'],
      ritual: 'APERI PORTAS',
      read: 'The ritual phrase "APERI PORTAS" burns itself into your memory.'
    },
    manuscript2: {
      name: 'second manuscript',
      description: 'This manuscript pulses with a darker energy. The text reads: "REVELA SECRETUM - Let that which is hidden be made known."',
      takeable: true,
      keywords: ['manuscript', 'second manuscript', 'manuscript2', 'fragment'],
      ritual: 'REVELA SECRETUM',
      read: 'The phrase "REVELA SECRETUM" echoes in your mind.'
    },
    manuscript3: {
      name: 'third manuscript',
      description: 'The final manuscript shimmers with pale light. It whispers: "LUMEN TENEBRIS - Light in the darkness, darkness in the light."',
      takeable: true,
      keywords: ['manuscript', 'third manuscript', 'manuscript3', 'fragment'],
      ritual: 'LUMEN TENEBRIS',
      read: 'The words "LUMEN TENEBRIS" resonate deeply within you.'
    },
    'cipher-key': {
      name: 'cipher key',
      description: 'Stone tablets showing a substitution cipher: A↔Z, B↔Y, C↔X, and so on. Each letter of the alphabet is paired with its reverse.',
      takeable: false,
      keywords: ['cipher', 'cipher key', 'key', 'tablet', 'stone', 'cipher-key'],
      special: 'cipher'
    },
    'encoded-message': {
      name: 'encoded message',
      description: 'Carved into the floor in glowing letters: "XVMMRMT GSV WVNLMH LU VMVITB GVNWVMXV ZMVD". The cipher key should decode this.',
      takeable: false,
      keywords: ['message', 'encoded message', 'carving', 'floor', 'encoded-message'],
      encoded: 'XVMMRMT GSV WVNLMH',
      decoded: 'CALLING THE DEMONS'
    },
    'rune-grid': {
      name: 'rune grid',
      description: 'Nine mystical runes arranged in a 3x3 grid. Each rune represents an ancient power. You must activate them in the correct sequence.',
      takeable: false,
      keywords: ['rune', 'runes', 'grid', 'symbols', 'rune-grid'],
      special: 'runes'
    }
  }
};

// ===================================
// GAME STATE MANAGER
// ===================================

class GameState {
  constructor() {
    this.currentScene = 'scriptorium';
    this.currentLocation = 'main';
    this.inventory = [];
    this.flags = {
      doorUnlocked: false,
      ritualsPerformed: 0,
      ritualsCompleted: [],
      manuscriptsFound: 0,
      cipherSolved: false,
      patternSolved: false,
      secretFound: false,
      resistanceAttempted: false,
      gameComplete: false
    };
    this.visitedScenes = ['scriptorium'];
    this.turnCount = 0;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.awaitingRitual = false;
    this.awaitingPattern = false;
    this.patternInput = [];
  }
  
  addItem(itemId) {
    if (!this.inventory.includes(itemId)) {
      this.inventory.push(itemId);
      return true;
    }
    return false;
  }
  
  removeItem(itemId) {
    const index = this.inventory.indexOf(itemId);
    if (index > -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }
  
  hasItem(itemId) {
    return this.inventory.includes(itemId);
  }
  
  setFlag(flag, value) {
    this.flags[flag] = value;
  }
  
  getFlag(flag) {
    return this.flags[flag];
  }
  
  addCommand(command) {
    this.commandHistory.push(command);
    if (this.commandHistory.length > 20) {
      this.commandHistory.shift();
    }
    this.historyIndex = this.commandHistory.length;
  }
  
  getCurrentScene() {
    return GAME_DATA.scenes[this.currentScene];
  }
  
  getCurrentLocation() {
    return this.getCurrentScene().locations[this.currentLocation];
  }
}

// ===================================
// TEXT PARSER
// ===================================

class Parser {
  constructor() {
    this.synonyms = {
      look: ['look', 'l', 'examine', 'x', 'inspect', 'describe'],
      take: ['take', 'get', 'grab', 'pick', 'pickup'],
      drop: ['drop', 'discard', 'throw'],
      use: ['use', 'activate', 'employ'],
      open: ['open', 'unlock'],
      read: ['read'],
      go: ['go', 'move', 'walk', 'travel'],
      inventory: ['inventory', 'i', 'inv', 'items'],
      help: ['help', '?', 'commands'],
      hint: ['hint', 'clue'],
      wait: ['wait', 'z'],
      search: ['search', 'look around'],
      close: ['close', 'shut', 'seal'],
      leave: ['leave', 'exit', 'escape', 'flee'],
      save: ['save'],
      load: ['load'],
      restart: ['restart', 'reset'],
      about: ['about', 'credits']
    };
    
    this.directions = ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w', 'in', 'out'];
  }
  
  parse(input) {
    input = input.toLowerCase().trim();
    
    if (!input) return null;
    
    // Check for direction commands
    if (this.directions.includes(input)) {
      return { verb: 'go', noun: input };
    }
    
    // Check for single-word commands
    for (const [verb, synonyms] of Object.entries(this.synonyms)) {
      if (synonyms.includes(input)) {
        return { verb, noun: null };
      }
    }
    
    // Parse multi-word commands
    const words = input.split(/\s+/);
    const firstWord = words[0];
    const restWords = words.slice(1).join(' ');
    
    // Find verb
    let verb = null;
    for (const [v, synonyms] of Object.entries(this.synonyms)) {
      if (synonyms.includes(firstWord)) {
        verb = v;
        break;
      }
    }
    
    // Check if first word is a direction
    if (this.directions.includes(firstWord)) {
      verb = 'go';
    }
    
    return {
      verb: verb || firstWord,
      noun: restWords || null,
      raw: input
    };
  }
  
  matchItem(noun, items) {
    if (!noun) return null;
    
    noun = noun.toLowerCase();
    
    for (const itemId of items) {
      const item = GAME_DATA.items[itemId];
      if (item && item.keywords) {
        for (const keyword of item.keywords) {
          if (noun.includes(keyword) || keyword.includes(noun)) {
            return itemId;
          }
        }
      }
    }
    return null;
  }
}

// ===================================
// UI RENDERER
// ===================================

class UIRenderer {
  constructor() {
    this.outputContainer = document.getElementById('output-container');
    this.commandInput = document.getElementById('command-input');
    this.inventoryDisplay = document.getElementById('inventory-display');
    this.locationDisplay = document.getElementById('location-display');
    this.progressDisplay = document.getElementById('progress-display');
    this.isTyping = false;
  }
  
  displayText(text, className = '', animate = true) {
    const p = document.createElement('p');
    p.className = `output-text ${className}`;
    this.outputContainer.appendChild(p);
    
    if (animate && !this.isTyping) {
      this.typewriterEffect(text, p);
    } else {
      p.textContent = text;
    }
    
    this.scrollToBottom();
  }
  
  typewriterEffect(text, element) {
    this.isTyping = true;
    let index = 0;
    const speed = 20;
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        this.isTyping = false;
      }
    };
    
    type();
  }
  
  scrollToBottom() {
    this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
  }
  
  updateInventory(inventory) {
    if (inventory.length === 0) {
      this.inventoryDisplay.innerHTML = '<p class="empty-inventory">Your hands are empty.</p>';
      return;
    }
    
    this.inventoryDisplay.innerHTML = '';
    inventory.forEach(itemId => {
      const item = GAME_DATA.items[itemId];
      if (item) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.textContent = item.name;
        div.onclick = () => game.processInput(`examine ${item.name}`);
        this.inventoryDisplay.appendChild(div);
      }
    });
  }
  
  updateLocation(sceneName) {
    this.locationDisplay.textContent = sceneName;
  }
  
  updateProgress(state) {
    const { flags } = state;
    let progress = 'Beginning your journey...';
    
    if (flags.gameComplete) {
      progress = 'Your tale is complete.';
    } else if (flags.patternSolved) {
      progress = 'The ritual approaches...';
    } else if (flags.cipherSolved) {
      progress = 'Mysteries unraveling...';
    } else if (flags.ritualsPerformed >= 3) {
      progress = 'The path opens...';
    } else if (flags.manuscriptsFound > 0) {
      progress = `Found ${flags.manuscriptsFound}/3 manuscripts`;
    } else if (flags.doorUnlocked) {
      progress = 'Library unlocked...';
    }
    
    this.progressDisplay.textContent = progress;
  }
  
  clearOutput() {
    this.outputContainer.innerHTML = '';
  }
  
  focusInput() {
    this.commandInput.focus();
  }
  
  getInput() {
    return this.commandInput.value;
  }
  
  clearInput() {
    this.commandInput.value = '';
  }
}

// ===================================
// MAIN GAME CLASS
// ===================================

class Game {
  constructor() {
    this.state = new GameState();
    this.parser = new Parser();
    this.ui = new UIRenderer();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const form = document.getElementById('command-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = this.ui.getInput();
      if (input.trim()) {
        this.processInput(input);
        this.ui.clearInput();
      }
    });
    
    // Command history with arrow keys
    this.ui.commandInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.state.historyIndex > 0) {
          this.state.historyIndex--;
          this.ui.commandInput.value = this.state.commandHistory[this.state.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.state.historyIndex < this.state.commandHistory.length - 1) {
          this.state.historyIndex++;
          this.ui.commandInput.value = this.state.commandHistory[this.state.historyIndex];
        } else {
          this.state.historyIndex = this.state.commandHistory.length;
          this.ui.commandInput.value = '';
        }
      }
    });
  }
  
  startGame() {
    const titleScreen = document.getElementById('title-screen');
    titleScreen.classList.add('hidden');
    
    this.ui.displayText('THE GRIMOIRE OF ETERNAL VIGIL', 'title');
    this.ui.displayText('A Dark Fantasy Text Adventure by georgeousDev', '');
    this.ui.displayText('');
    this.ui.displayText('You may type commands like LOOK, EXAMINE [thing], TAKE [item], GO [direction], USE [item], READ [text], or HELP for assistance.', '');
    this.ui.displayText('');
    
    this.executeCommand({ verb: 'look', noun: null });
    this.ui.focusInput();
  }
  
  processInput(input) {
    this.state.addCommand(input);
    this.state.turnCount++;
    
    this.ui.displayText(input, 'command', false);
    
    // Check for special mechanics modes
    if (this.state.awaitingRitual) {
      this.checkRitual(input);
      return;
    }
    
    if (this.state.awaitingPattern) {
      this.checkPattern(input);
      return;
    }
    
    // Easter eggs
    const lowerInput = input.toLowerCase().trim();
    if (lowerInput === 'xyzzy') {
      this.ui.displayText('A hollow voice says "Fool." This is no Colossal Cave.', 'error');
      return;
    }
    
    if (lowerInput === 'examine author' || lowerInput === 'x author') {
      this.ui.displayText('This dark tale was crafted by georgeousDev during late nights and stolen moments, a spare-time project born of love for interactive fiction and atmospheric storytelling.', 'success');
      return;
    }
    
    // Parse and execute command
    const parsed = this.parser.parse(input);
    if (parsed) {
      this.executeCommand(parsed);
    } else {
      this.ui.displayText('I don\'t understand that command.', 'error');
    }
    
    // Update UI
    this.ui.updateInventory(this.state.inventory);
    this.ui.updateProgress(this.state);
  }
  
  executeCommand(cmd) {
    const { verb, noun } = cmd;
    
    switch (verb) {
      case 'look':
        this.cmdLook(noun);
        break;
      case 'take':
        this.cmdTake(noun);
        break;
      case 'drop':
        this.cmdDrop(noun);
        break;
      case 'use':
        this.cmdUse(noun);
        break;
      case 'open':
        this.cmdOpen(noun);
        break;
      case 'read':
        this.cmdRead(noun);
        break;
      case 'go':
        this.cmdGo(noun);
        break;
      case 'inventory':
        this.cmdInventory();
        break;
      case 'help':
        this.cmdHelp();
        break;
      case 'hint':
        this.cmdHint();
        break;
      case 'wait':
        this.cmdWait();
        break;
      case 'search':
        this.cmdSearch();
        break;
      case 'close':
      case 'leave':
        this.cmdResist();
        break;
      case 'restart':
        this.cmdRestart();
        break;
      case 'about':
        this.cmdAbout();
        break;
      default:
        // Check if it's a ritual phrase
        if (cmd.raw && this.state.currentScene === 'library') {
          this.checkRitual(cmd.raw);
        } else {
          this.ui.displayText('I don\'t understand that command. Type HELP for assistance.', 'error');
        }
    }
  }
  
  cmdLook(noun) {
    const location = this.state.getCurrentLocation();
    const scene = this.state.getCurrentScene();
    
    if (!noun) {
      // Look at room
      this.ui.displayText(scene.name, 'title');
      this.ui.displayText(location.description);
      this.ui.updateLocation(scene.name);
      
      // Check for special room-specific text
      if (this.state.currentScene === 'library' && this.state.flags.ritualsPerformed < 3) {
        this.ui.displayText('The manuscripts seem to pulse with expectation, waiting for their ritual phrases to be spoken aloud.', '');
      }
      
      if (this.state.currentScene === 'archives' && !this.state.flags.cipherSolved) {
        this.ui.displayText('The cipher key glows on the stone tablets. Perhaps you should EXAMINE CIPHER KEY to understand how to decode the message.', '');
      }
      
      if (this.state.currentScene === 'ritual-chamber' && !this.state.flags.patternSolved) {
        this.ui.displayText('The rune grid pulses with energy. You must discern the pattern. Try EXAMINE RUNE GRID.', '');
      }
    } else {
      // Look at specific thing
      this.cmdExamine(noun);
    }
  }
  
  cmdExamine(noun) {
    // Special case: examine shadows for secret
    if (noun && (noun.includes('shadow') || noun.includes('dark'))) {
      if (this.state.currentScene === 'library' && !this.state.flags.secretFound) {
        this.state.setFlag('secretFound', true);
        this.ui.displayText('You peer into the writhing shadows. For a moment, they part, revealing a hidden truth: this grimoire is not a prison but a test. Those who seek power find chains. Those who seek understanding find freedom.', 'success');
        return;
      }
    }
    
    // Check inventory
    const inventoryMatch = this.parser.matchItem(noun, this.state.inventory);
    if (inventoryMatch) {
      const item = GAME_DATA.items[inventoryMatch];
      this.ui.displayText(item.description);
      
      // Special handling for cipher key
      if (inventoryMatch === 'cipher-key' || inventoryMatch.includes('cipher')) {
        this.showCipherKey();
      }
      
      // Special handling for rune grid
      if (inventoryMatch === 'rune-grid' || inventoryMatch.includes('rune')) {
        this.showRuneGrid();
      }
      return;
    }
    
    // Check room items
    const location = this.state.getCurrentLocation();
    const roomMatch = this.parser.matchItem(noun, location.items);
    if (roomMatch) {
      const item = GAME_DATA.items[roomMatch];
      this.ui.displayText(item.description);
      
      // Special handling
      if (roomMatch.includes('manuscript')) {
        if (!this.state.hasItem(roomMatch)) {
          this.state.addItem(roomMatch);
          this.state.flags.manuscriptsFound++;
          this.ui.displayText(`[${item.name} added to your possessions]`, 'success');
        }
      }
      
      if (roomMatch === 'cipher-key') {
        this.showCipherKey();
      }
      
      if (roomMatch === 'encoded-message') {
        this.ui.displayText('Using the cipher key, you can decode this. The pattern is simple: A↔Z, B↔Y, C↔X, etc.', '');
      }
      
      if (roomMatch === 'rune-grid') {
        this.showRuneGrid();
      }
      return;
    }
    
    this.ui.displayText('You don\'t see that here.', 'error');
  }
  
  cmdTake(noun) {
    if (!noun) {
      this.ui.displayText('Take what?', 'error');
      return;
    }
    
    const location = this.state.getCurrentLocation();
    const itemMatch = this.parser.matchItem(noun, location.items);
    
    if (itemMatch) {
      const item = GAME_DATA.items[itemMatch];
      
      if (!item.takeable) {
        this.ui.displayText('You cannot take that.', 'error');
        return;
      }
      
      if (this.state.hasItem(itemMatch)) {
        this.ui.displayText('You already have that.', 'error');
        return;
      }
      
      this.state.addItem(itemMatch);
      this.ui.displayText(`Taken: ${item.name}`, 'success');
      
      // Track manuscript collection
      if (itemMatch.includes('manuscript')) {
        this.state.flags.manuscriptsFound++;
      }
    } else {
      this.ui.displayText('You don\'t see that here.', 'error');
    }
  }
  
  cmdDrop(noun) {
    if (!noun) {
      this.ui.displayText('Drop what?', 'error');
      return;
    }
    
    const itemMatch = this.parser.matchItem(noun, this.state.inventory);
    if (itemMatch) {
      const item = GAME_DATA.items[itemMatch];
      this.state.removeItem(itemMatch);
      this.ui.displayText(`Dropped: ${item.name}`, '');
    } else {
      this.ui.displayText('You don\'t have that.', 'error');
    }
  }
  
  cmdUse(noun) {
    if (!noun) {
      this.ui.displayText('Use what?', 'error');
      return;
    }
    
    const itemMatch = this.parser.matchItem(noun, this.state.inventory);
    if (!itemMatch) {
      this.ui.displayText('You don\'t have that.', 'error');
      return;
    }
    
    const item = GAME_DATA.items[itemMatch];
    
    // Special use cases
    if (itemMatch === 'key') {
      this.cmdOpen('door');
      return;
    }
    
    if (itemMatch === 'candle') {
      this.ui.displayText('You light the candle. Its flame flickers with an unnatural green hue, casting dancing shadows that seem almost alive. The darkness recedes slightly, though it watches from the edges.', 'success');
      return;
    }
    
    this.ui.displayText('You\'re not sure how to use that here.', 'error');
  }
  
  cmdOpen(noun) {
    if (!noun || !noun.includes('door')) {
      this.ui.displayText('Open what?', 'error');
      return;
    }
    
    if (this.state.currentScene !== 'scriptorium') {
      this.ui.displayText('There is no door to open here.', 'error');
      return;
    }
    
    if (this.state.flags.doorUnlocked) {
      this.ui.displayText('The door is already unlocked.', '');
      return;
    }
    
    if (!this.state.hasItem('key')) {
      this.ui.displayText('The door is locked. You need a key.', 'error');
      return;
    }
    
    this.state.setFlag('doorUnlocked', true);
    this.ui.displayText('You insert the brass key into the lock. It turns with a satisfying click, and the door swings open, revealing the vast library beyond.', 'success');
  }
  
  cmdRead(noun) {
    if (!noun) {
      this.ui.displayText('Read what?', 'error');
      return;
    }
    
    const itemMatch = this.parser.matchItem(noun, this.state.inventory);
    if (itemMatch) {
      const item = GAME_DATA.items[itemMatch];
      if (item.read) {
        this.ui.displayText(item.read);
      } else {
        this.ui.displayText('There is nothing to read on that.', 'error');
      }
    } else {
      this.ui.displayText('You don\'t have that.', 'error');
    }
  }
  
  cmdGo(direction) {
    if (!direction) {
      this.ui.displayText('Go where?', 'error');
      return;
    }
    
    // Normalize direction
    const dirMap = { n: 'north', s: 'south', e: 'east', w: 'west' };
    direction = dirMap[direction] || direction;
    
    const location = this.state.getCurrentLocation();
    const exits = location.exits;
    
    if (!exits[direction]) {
      this.ui.displayText('You cannot go that way.', 'error');
      return;
    }
    
    const destination = exits[direction];
    
    // Check if door is unlocked for library access
    if (destination === 'library' && !this.state.flags.doorUnlocked) {
      this.ui.displayText('The door to the library is locked.', 'error');
      return;
    }
    
    // Check if rituals completed for archives access
    if (destination === 'archives' && this.state.flags.ritualsPerformed < 3) {
      this.ui.displayText('An invisible barrier blocks your path. The manuscripts whisper that you must first speak all three ritual phrases.', 'error');
      return;
    }
    
    // Check if cipher solved for ritual chamber access
    if (destination === 'ritual-chamber' && !this.state.flags.cipherSolved) {
      this.ui.displayText('The way forward is sealed by ancient magic. You sense you must first decode the hidden message.', 'error');
      return;
    }
    
    // Move to new location
    this.state.currentScene = destination;
    if (!this.state.visitedScenes.includes(destination)) {
      this.state.visitedScenes.push(destination);
    }
    
    this.ui.displayText('');
    this.cmdLook(null);
  }
  
  cmdInventory() {
    if (this.state.inventory.length === 0) {
      this.ui.displayText('You are carrying nothing.', '');
      return;
    }
    
    this.ui.displayText('You are carrying:', '');
    this.state.inventory.forEach(itemId => {
      const item = GAME_DATA.items[itemId];
      this.ui.displayText(`  - ${item.name}`, '');
    });
  }
  
  cmdHelp() {
    this.ui.displayText('Available commands:', '');
    this.ui.displayText('  LOOK / L - Examine your surroundings', '');
    this.ui.displayText('  EXAMINE [thing] / X [thing] - Look closely at something', '');
    this.ui.displayText('  TAKE [item] / GET [item] - Pick up an item', '');
    this.ui.displayText('  DROP [item] - Drop an item', '');
    this.ui.displayText('  USE [item] - Use an item', '');
    this.ui.displayText('  READ [text] - Read something', '');
    this.ui.displayText('  OPEN [thing] - Open something', '');
    this.ui.displayText('  GO [direction] or just [direction] - Move (north, south, east, west)', '');
    this.ui.displayText('  INVENTORY / I - Check what you\'re carrying', '');
    this.ui.displayText('  HINT - Get a contextual hint', '');
    this.ui.displayText('  RESTART - Start over', '');
    this.ui.displayText('', '');
    this.ui.displayText('Special mechanics will be explained as you discover them.', '');
  }
  
  cmdHint() {
    const scene = this.state.currentScene;
    const flags = this.state.flags;
    
    if (scene === 'scriptorium' && !flags.doorUnlocked) {
      this.ui.displayText('Hint: Explore the room thoroughly. Perhaps examining your desk will reveal something useful.', 'success');
    } else if (scene === 'library' && flags.ritualsPerformed < 3) {
      this.ui.displayText('Hint: The manuscripts contain ritual phrases. Try speaking them aloud exactly as written (type the full phrase).', 'success');
    } else if (scene === 'archives' && !flags.cipherSolved) {
      this.ui.displayText('Hint: Use the cipher key to decode the message. A↔Z, B↔Y, C↔X... Once decoded, type the solution.', 'success');
    } else if (scene === 'ritual-chamber' && !flags.patternSolved) {
      this.ui.displayText('Hint: Examine the rune grid carefully. The pattern is positions 3, 7, 2, 5. Type: ACTIVATE 3 7 2 5', 'success');
    } else {
      this.ui.displayText('No specific hint available. Explore and examine everything carefully.', '');
    }
  }
  
  cmdWait() {
    const responses = [
      'Time passes. The shadows grow longer.',
      'You wait. The air grows colder.',
      'Nothing happens, though you sense watchful eyes upon you.',
      'The monastery remains silent, holding its secrets close.'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.ui.displayText(response, '');
  }
  
  cmdSearch() {
    this.cmdLook(null);
  }
  
  cmdResist() {
    if (this.state.currentScene === 'ritual-chamber' || this.state.flags.ritualsPerformed >= 3) {
      this.state.setFlag('resistanceAttempted', true);
      this.state.setFlag('gameComplete', true);
      this.showEnding('resist');
    } else {
      this.ui.displayText('Leave where? The monastery\'s secrets still bind you here.', 'error');
    }
  }
  
  cmdRestart() {
    if (confirm('Are you sure you want to restart? All progress will be lost.')) {
      location.reload();
    }
  }
  
  cmdAbout() {
    this.ui.displayText('THE GRIMOIRE OF ETERNAL VIGIL', 'title');
    this.ui.displayText('A dark fantasy text adventure game', '');
    this.ui.displayText('Created by: georgeousDev', '');
    this.ui.displayText('Inspired by: Stories Untold', '');
    this.ui.displayText('', '');
    this.ui.displayText('This is a spare-time creative project exploring experimental narrative mechanics in interactive fiction.', '');
  }
  
  // Special mechanics
  
  checkRitual(input) {
    input = input.toUpperCase().trim();
    
    const scene = this.state.getCurrentScene();
    if (!scene.rituals || !scene.rituals.includes(input)) {
      this.ui.displayText('The words echo emptily. Nothing happens. Perhaps that is not the correct phrase.', 'error');
      return;
    }
    
    if (this.state.flags.ritualsCompleted.includes(input)) {
      this.ui.displayText('You have already spoken this ritual phrase. Its power has been spent.', '');
      return;
    }
    
    this.state.flags.ritualsCompleted.push(input);
    this.state.flags.ritualsPerformed++;
    
    this.ui.displayText(`The words "${input}" resonate through the library. The air shimmers, and you feel ancient power awakening. The manuscripts glow brighter for a moment, then fade.`, 'success');
    
    if (this.state.flags.ritualsPerformed >= 3) {
      this.ui.displayText('');
      this.ui.displayText('All three ritual phrases have been spoken. You hear a distant grinding sound as hidden mechanisms unlock. The path to the west now lies open.', 'success');
    }
  }
  
  showCipherKey() {
    const overlay = document.getElementById('mechanics-overlay');
    const display = document.getElementById('mechanics-display');
    
    display.innerHTML = `
      <h2>Cipher Key</h2>
      <p>The stone tablets reveal a substitution cipher. Each letter of the alphabet corresponds to its reverse:</p>
      <div class="cipher-grid">
        <div class="cipher-cell">A↔Z</div>
        <div class="cipher-cell">B↔Y</div>
        <div class="cipher-cell">C↔X</div>
        <div class="cipher-cell">D↔W</div>
        <div class="cipher-cell">E↔V</div>
        <div class="cipher-cell">F↔U</div>
        <div class="cipher-cell">G↔T</div>
        <div class="cipher-cell">H↔S</div>
        <div class="cipher-cell">I↔R</div>
        <div class="cipher-cell">J↔Q</div>
        <div class="cipher-cell">K↔P</div>
        <div class="cipher-cell">L↔O</div>
        <div class="cipher-cell">M↔N</div>
      </div>
      <p><strong>Encoded message on the floor:</strong></p>
      <p style="text-align: center; font-size: 1.2em; font-weight: bold; margin: 20px 0;">XVMMRMT GSV WVNLMH</p>
      <p>Decode this message and speak it aloud to proceed.</p>
    `;
    
    overlay.classList.remove('hidden');
  }
  
  showRuneGrid() {
    const overlay = document.getElementById('mechanics-overlay');
    const display = document.getElementById('mechanics-display');
    
    const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ'];
    
    display.innerHTML = `
      <h2>Rune Grid</h2>
      <p>Nine ancient runes pulse with power. You must activate them in the correct sequence.</p>
      <p style="font-style: italic; margin: 15px 0;">Watch carefully—positions 3, 7, 2, and 5 seem to glow brighter than the others...</p>
      <div class="rune-grid">
        ${runes.map((rune, i) => `<div class="rune-cell" data-number="${i + 1}">${rune}</div>`).join('')}
      </div>
      <p style="margin-top: 20px;"><strong>Command format:</strong> ACTIVATE [sequence]</p>
      <p>Example: ACTIVATE 3 7 2 5</p>
    `;
    
    overlay.classList.remove('hidden');
  }
  
  closeOverlay() {
    const overlay = document.getElementById('mechanics-overlay');
    overlay.classList.add('hidden');
  }
  
  checkPattern(input) {
    // Extract numbers from input
    const numbers = input.match(/\d+/g);
    
    if (!numbers || numbers.length < 4) {
      this.ui.displayText('You must specify a sequence of rune positions. Try: ACTIVATE 3 7 2 5', 'error');
      return;
    }
    
    const sequence = numbers.slice(0, 4).map(n => parseInt(n));
    const correct = [3, 7, 2, 5];
    
    if (JSON.stringify(sequence) === JSON.stringify(correct)) {
      this.state.setFlag('patternSolved', true);
      this.state.awaitingPattern = false;
      this.ui.displayText('The runes blaze with brilliant light as you touch them in sequence. Energy courses through the chamber, and you feel the final barrier dissolve. The grimoire\'s true purpose becomes clear...', 'success');
      this.ui.displayText('');
      this.determineEnding();
    } else {
      this.ui.displayText(`You activate runes ${sequence.join(', ')}. They flicker but do not ignite. The pattern is incorrect. The chamber grows colder, warning you of your mistake.`, 'error');
    }
  }
  
  determineEnding() {
    const flags = this.state.flags;
    
    // Check which ending to show
    if (flags.resistanceAttempted) {
      this.showEnding('resist');
    } else if (flags.secretFound) {
      this.showEnding('transcend');
    } else if (flags.manuscriptsFound >= 3 && flags.patternSolved) {
      this.showEnding('embrace');
    } else {
      // Default completion
      this.showEnding('embrace');
    }
  }
  
  showEnding(type) {
    this.state.setFlag('gameComplete', true);
    this.ui.displayText('');
    this.ui.displayText('═══════════════════════════════', 'title');
    
    if (type === 'embrace') {
      this.ui.displayText('ENDING: EMBRACE THE DARKNESS', 'title');
      this.ui.displayText('');
      this.ui.displayText('The ritual completes. Power floods through you—ancient, terrible, magnificent. You understand now: the monastery was not a prison but a crucible. The grimoire needed a guardian, someone willing to bear the weight of forbidden knowledge.');
      this.ui.displayText('');
      this.ui.displayText('You take your place among the eternal vigil. The shadows embrace you as their own. In the depths of the library, you will wait, watching over secrets that must be kept from the world. Your mortal life ends, but your purpose has just begun.');
      this.ui.displayText('');
      this.ui.displayText('The monastery falls silent once more. Another guardian takes their post. The cycle continues.', 'success');
    } else if (type === 'resist') {
      this.ui.displayText('ENDING: RESIST AND ESCAPE', 'title');
      this.ui.displayText('');
      this.ui.displayText('No. You refuse. With every ounce of will you possess, you turn away from the grimoire\'s seductive promises. The power calls to you, begs you to embrace it, but you resist.');
      this.ui.displayText('');
      this.ui.displayText('You speak words of sealing, ancient protections your soul somehow remembers. The grimoire shudders and begins to close. Shadows writhe in fury, but you stand firm. With a final burst of light, you seal the tome and flee the monastery.');
      this.ui.displayText('');
      this.ui.displayText('You emerge into dawn\'s light, changed but free. The monastery crumbles behind you, its dark purpose thwarted. The grimoire sleeps once more, awaiting another seeker. But not you. Never again.', 'success');
    } else if (type === 'transcend') {
      this.ui.displayText('ENDING: TRANSCEND THE CURSE', 'title');
      this.ui.displayText('');
      this.ui.displayText('The shadows revealed their secret to you—a truth hidden even from the grimoire itself. This was never about power or sacrifice. It was about understanding.');
      this.ui.displayText('');
      this.ui.displayText('The monastery, the grimoire, the rituals—all of it was a test designed by those who came before. Not to create guardians or prisoners, but to find those capable of seeing beyond the illusion of dark and light.');
      this.ui.displayText('');
      this.ui.displayText('You speak the true words, the ones that transcend the ritual. Reality shifts. The grimoire transforms into simple parchment. The monastery becomes just stone and mortar. The curse was belief itself, and you have broken free.');
      this.ui.displayText('');
      this.ui.displayText('You walk away carrying neither power nor burden, only wisdom. The eternal vigil ends. The grimoire becomes a story, nothing more. And you are finally, truly free.', 'success');
    }
    
    this.ui.displayText('');
    this.ui.displayText('═══════════════════════════════', 'title');
    this.ui.displayText('');
    this.ui.displayText('Thank you for playing THE GRIMOIRE OF ETERNAL VIGIL', '');
    this.ui.displayText('A spare-time project by georgeousDev', '');
    this.ui.displayText('');
    this.ui.displayText('Type RESTART to play again and discover other endings.', '');
  }
  
  loadGame() {
    this.ui.displayText('Save/load functionality would use localStorage, which is not available in this environment. Please play through in one session.', 'error');
  }
  
  showAbout() {
    alert('THE GRIMOIRE OF ETERNAL VIGIL\n\nA dark fantasy text adventure inspired by Stories Untold.\n\nCreated by georgeousDev as a spare-time portfolio project.\n\nFeatures experimental narrative mechanics, multiple endings, and atmospheric storytelling in bite-sized form.');
  }
}

// ===================================
// GAME INITIALIZATION
// ===================================

const game = new Game();

// Auto-focus input when clicking anywhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('.title-screen') && !e.target.closest('.mechanics-overlay')) {
    game.ui.focusInput();
  }
});

// Special command handlers for cipher and pattern
window.addEventListener('load', () => {
  // Set up special mechanics detection
  const originalProcessInput = game.processInput.bind(game);
  game.processInput = function(input) {
    const lowerInput = input.toLowerCase();
    
    // Check for cipher solution
    if (game.state.currentScene === 'archives' && !game.state.flags.cipherSolved) {
      if (lowerInput.includes('calling the demons') || lowerInput.includes('calling') && lowerInput.includes('demons')) {
        game.state.setFlag('cipherSolved', true);
        game.ui.displayText(input, 'command', false);
        game.ui.displayText('The decoded phrase echoes through the archives: "CALLING THE DEMONS." The floor trembles, and ancient mechanisms grind to life. The sealed passage to the north opens, revealing the ritual chamber beyond.', 'success');
        game.ui.updateProgress(game.state);
        return;
      }
    }
    
    // Check for pattern activation
    if (game.state.currentScene === 'ritual-chamber' && !game.state.flags.patternSolved) {
      if (lowerInput.includes('activate') || lowerInput.includes('rune')) {
        game.checkPattern(input);
        return;
      }
    }
    
    originalProcessInput(input);
  };
});