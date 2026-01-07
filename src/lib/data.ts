
export interface Seat {
  id: string;
  label: string;
  status: 'Available' | 'Occupied' | 'Booked' | 'Pending';
  type: 'seat' | 'group-seat' | 'space' | 'wall' | 'window' | 'book-shelf' | 'coffee-station' | 'entrance';
  rotation?: number; // For chairs around a table
}

export interface TableGroup {
  id: string;
  label: string;
  seats: Seat[];
  position: { x: number, y: number }; // Percentage based position
}

export interface OtherElement {
  id: string;
  label: string;
  type: 'storage' | 'reception' | 'stack';
  position: { x: number, y: number };
  size: { w: number, h: number };
}

export interface FloorLayout {
  zones?: {
    id: string;
    label: string;
    position: { x: number, y: number };
  }[];
  tables?: TableGroup[];
  otherElements?: OtherElement[];
}

export interface Floor {
  id: string;
  level: number;
  name: string;
  gridSize?: { cols: number; rows: number };
  seats?: Seat[]; // Legacy grid-based seats
  layout?: FloorLayout; // New flexible layout
}

export interface Library {
  id: string;
  name: string;
  locationId: string;
  address: string;
  imageUrl: string;
  floors: Floor[];
}

export interface Location {
  id: string;
  name:string;
}

export const locations: Location[] = [
  { id: 'loc-1', name: 'Downtown Campus' },
  { id: 'loc-2', name: 'North Campus' },
  { id: 'loc-3', name: 'Westwood Campus' },
];

const generateLayoutForFloor1 = (floorId: string): Floor => {
  const statuses: Seat['status'][] = ['Available', 'Occupied', 'Booked', 'Pending'];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
  
  const createTable = (id: string, label: string, pos: { x: number, y: number }, seatCount: number = 6): TableGroup => ({
    id: `${floorId}-t-${id}`,
    label,
    position: pos,
    seats: Array.from({ length: seatCount }, (_, i) => ({
      id: `${floorId}-t-${id}-s-${i}`,
      label: `${label}-${i + 1}`,
      type: 'seat',
      rotation: (360 / seatCount) * i,
      status: getRandomStatus(),
    })),
  });

  const layout: FloorLayout = {
    zones: [
      { id: 'zone-1', label: 'Left Wing: Group Study', position: { x: 5, y: 5 } },
      { id: 'zone-2', label: 'Rear Section: Reference Hall', position: { x: 55, y: 5 } },
      { id: 'zone-3', label: 'Middle Spine', position: { x: 38, y: 48 } },
    ],
    tables: [
      // Left Wing
      createTable('1', 'L1', { x: 10, y: 15 }),
      createTable('2', 'L3', { x: 10, y: 40 }),
      createTable('3', 'L2', { x: 10, y: 65 }),
      
      // Right Wing
      createTable('5', 'L2', { x: 60, y: 15 }),
      createTable('6', 'L1', { x: 80, y: 15 }),
      createTable('7', 'L6', { x: 60, y: 40 }),
      createTable('8', 'L6', { x: 80, y: 40 }),
      createTable('9', 'L4', { x: 60, y: 65 }),
      createTable('10', 'L1', { x: 80, y: 65 }),
      createTable('11', 'L5', { x: 60, y: 90 }),
      createTable('12', 'L5', { x: 80, y: 90 }),
    ],
    otherElements: [
        { id: 'el-1', label: 'MAIN ENTRANCE', type: 'reception', position: { x: 38, y: 30 }, size: { w: 150, h: 30 } },
        { id: 'el-2', label: 'BAG STORAGE', type: 'storage', position: { x: 38, y: 35 }, size: { w: 100, h: 30 } },
        { id: 'el-3', label: 'RECEPTION', type: 'reception', position: { x: 48, y: 35 }, size: { w: 80, h: 30 } },

        { id: 'el-4', label: 'STACK AREA I', type: 'stack', position: { x: 38, y: 55 }, size: { w: 120, h: 25 } },
        { id: 'el-5', label: 'STACK AREA I', type: 'stack', position: { x: 38, y: 62 }, size: { w: 120, h: 25 } },
        { id: 'el-6', label: 'STACK AREA I', type: 'stack', position: { x: 38, y: 69 }, size: { w: 120, h: 25 } },
    ]
  };

  return {
    id: floorId,
    level: 1,
    name: 'First Floor - Main Hall',
    layout: layout
  };
};

// Legacy function, can be deprecated or updated
const generateSeatsForFloor2 = (floorId: string): Floor => {
  const statuses: Seat['status'][] = ['Available', 'Occupied', 'Booked', 'Pending'];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
  const createTable = (id: string, label: string, pos: { x: number, y: number }, seatCount: number = 4): TableGroup => ({
    id: `${floorId}-t-${id}`,
    label,
    position: pos,
    seats: Array.from({ length: seatCount }, (_, i) => ({
      id: `${floorId}-t-${id}-s-${i}`,
      label: `${label}-${i + 1}`,
      type: 'group-seat',
      rotation: i * 90,
      status: getRandomStatus(),
    })),
  });

    return { 
        id: floorId, 
        level: 2, 
        name: 'Second Floor - Quiet Zone',
        layout: {
            tables: [
                createTable('q1', 'Q1', {x: 20, y: 20}),
                createTable('q2', 'Q2', {x: 50, y: 20}),
                createTable('q3', 'Q3', {x: 80, y: 20}),
                createTable('q4', 'Q4', {x: 20, y: 60}),
                createTable('q5', 'Q5', {x: 50, y: 60}),
                createTable('q6', 'Q6', {x: 80, y: 60}),
            ]
        }
    };
}


export const libraries: Library[] = [
  {
    id: 'lib-1',
    name: 'Main Research Library',
    locationId: 'loc-1',
    address: '123 University Ave, Downtown',
    imageUrl: 'https://picsum.photos/seed/lib1/600/400',
    floors: [
      generateLayoutForFloor1('lib-1-f1'),
      generateSeatsForFloor2('lib-1-f2'),
    ],
  },
  {
    id: 'lib-2',
    name: 'Science & Engineering Library',
    locationId: 'loc-2',
    address: '456 Innovation Dr, North Campus',
    imageUrl: 'https://picsum.photos/seed/lib2/600/400',
    floors: [
       generateLayoutForFloor1('lib-2-f1'),
    ],
  },
  {
    id: 'lib-3',
    name: 'Arts & Humanities Library',
    locationId: 'loc-1',
    address: '789 Culture St, Downtown',
    imageUrl: 'https://picsum.photos/seed/lib3/600/400',
    floors: [
       generateSeatsForFloor2('lib-3-f1'),
    ],
  },
   {
    id: 'lib-4',
    name: 'Westwood Medical Library',
    locationId: 'loc-3',
    address: '101 Health Sci Pkwy, Westwood',
    imageUrl: 'https://picsum.photos/seed/lib4/600/400',
    floors: [
      generateLayoutForFloor1('lib-4-f1'),
      generateSeatsForFloor2('lib-4-f2'),
    ],
  },
];
