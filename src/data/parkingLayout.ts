import { ParkingSlot, SlotState } from '@/types/parking';

// This layout matches the S Parking 2F floor plan exactly
// Measurements are in relative units for scaling

const SLOT_WIDTH = 28;
const SLOT_HEIGHT = 52;
const SMALL_GAP = 2;

export const generateParkingSlots = (): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  let slotIndex = 0;

  const createSlot = (
    x: number,
    y: number,
    zone: 'available' | 'unavailable' | 'emergency',
    state: SlotState = zone === 'emergency' ? 'emergency' : zone === 'unavailable' ? 'unavailable' : 'available',
    rotation?: number,
    width = SLOT_WIDTH,
    height = SLOT_HEIGHT
  ): ParkingSlot => ({
    id: `S${String(++slotIndex).padStart(3, '0')}`,
    x,
    y,
    width,
    height,
    rotation,
    state,
    zone,
  });

  // === UPPER SECTION - Right side blocks near fire shutter ===
  // Block A - Upper right corner (16 slots, 2 columns)
  const blockAStartX = 320;
  const blockAStartY = 95;
  for (let row = 0; row < 8; row++) {
    slots.push(createSlot(blockAStartX, blockAStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockAStartX + SLOT_WIDTH + SMALL_GAP, blockAStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block B - Middle upper right (16 slots, 2 columns)
  const blockBStartX = 410;
  const blockBStartY = 95;
  for (let row = 0; row < 8; row++) {
    slots.push(createSlot(blockBStartX, blockBStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockBStartX + SLOT_WIDTH + SMALL_GAP, blockBStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block C - Far right column (15 slots)
  const blockCStartX = 500;
  const blockCStartY = 160;
  for (let row = 0; row < 15; row++) {
    slots.push(createSlot(blockCStartX, blockCStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // === MIDDLE SECTION - Main parking area ===
  // Block D - Left angled section (6 slots) - Following left wall
  const blockDStartX = 85;
  const blockDStartY = 340;
  for (let row = 0; row < 6; row++) {
    slots.push(createSlot(blockDStartX, blockDStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block E - Center left column (7 slots)
  const blockEStartX = 145;
  const blockEStartY = 285;
  for (let row = 0; row < 7; row++) {
    slots.push(createSlot(blockEStartX, blockEStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block F - Center column dual (7 + 7 slots back-to-back)
  const blockFStartX = 205;
  const blockFStartY = 285;
  for (let row = 0; row < 7; row++) {
    slots.push(createSlot(blockFStartX, blockFStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockFStartX + SLOT_WIDTH + SMALL_GAP, blockFStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block G - Center right dual (16 + 16 slots)
  const blockGStartX = 295;
  const blockGStartY = 285;
  for (let row = 0; row < 8; row++) {
    slots.push(createSlot(blockGStartX, blockGStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockGStartX + SLOT_WIDTH + SMALL_GAP, blockGStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block H - Right side dual (16 + 16 slots)
  const blockHStartX = 385;
  const blockHStartY = 285;
  for (let row = 0; row < 8; row++) {
    slots.push(createSlot(blockHStartX, blockHStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockHStartX + SLOT_WIDTH + SMALL_GAP, blockHStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // Block I - Far right lower (16 slots)
  const blockIStartX = 475;
  const blockIStartY = 380;
  for (let row = 0; row < 8; row++) {
    slots.push(createSlot(blockIStartX, blockIStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
    slots.push(createSlot(blockIStartX + SLOT_WIDTH + SMALL_GAP, blockIStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'available'));
  }

  // === EMERGENCY SLOTS (6 slots) - Blue color, near fire shutter ===
  // Positioned near the top service zone
  const emergencyStartX = 320;
  const emergencyStartY = 30;
  for (let col = 0; col < 6; col++) {
    slots.push(createSlot(emergencyStartX + col * (SLOT_WIDTH + SMALL_GAP), emergencyStartY, 'emergency', 'emergency'));
  }

  // === UNAVAILABLE SLOTS - Grey area ===
  // Some slots that are structurally blocked
  const unavailStartX = 540;
  const unavailStartY = 95;
  for (let row = 0; row < 4; row++) {
    slots.push(createSlot(unavailStartX, unavailStartY + row * (SLOT_HEIGHT + SMALL_GAP), 'unavailable', 'unavailable'));
  }

  return slots;
};

// Layout dimensions for the floor plan canvas
export const FLOOR_PLAN_DIMENSIONS = {
  width: 600,
  height: 750,
};

// Structural elements (non-interactive visual elements)
export const STRUCTURAL_ELEMENTS = {
  // Left angled wall
  leftWall: {
    points: [
      { x: 0, y: 200 },
      { x: 50, y: 280 },
      { x: 50, y: 750 },
      { x: 0, y: 750 },
    ],
  },
  // Top angled wall
  topWall: {
    points: [
      { x: 50, y: 0 },
      { x: 300, y: 0 },
      { x: 200, y: 80 },
      { x: 50, y: 180 },
    ],
  },
  // Right wall
  rightWall: {
    points: [
      { x: 580, y: 50 },
      { x: 600, y: 50 },
      { x: 600, y: 750 },
      { x: 580, y: 750 },
    ],
  },
  // Fire shutter zone (hatched area)
  fireShutter: {
    x: 300,
    y: 58,
    width: 200,
    height: 30,
  },
  // Entry to stairs
  stairsEntry: {
    x: 250,
    y: 720,
    width: 100,
    height: 30,
    label: 'Enter to the stairs',
  },
  // Central aisle
  centralAisle: {
    x: 170,
    y: 260,
    width: 10,
    height: 500,
  },
};
