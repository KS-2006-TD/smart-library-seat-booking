export interface Seat {
  id: string;
  label: string;
  status: 'Available' | 'Occupied' | 'Booked' | 'Pending';
  type: 'seat' | 'group-seat' | 'space' | 'wall' | 'window' | 'book-shelf' | 'coffee-station' | 'entrance';
}

export interface Floor {
  id: string;
  level: number;
  name: string;
  seats: Seat[];
  gridSize: { cols: number; rows: number };
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

const generateSeatsForFloor1 = (floorId: string): Floor => {
    const seats: Seat[] = [];
    const rows = 12;
    const cols = 16;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const id = `${floorId}-s-${i}-${j}`;
            let type: Seat['type'] = 'space';
            let label = '';

            // Walls
            if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
                type = (j === 0 || j === cols - 1) && i > 0 && i < rows -1 ? 'window' : 'wall';
            }
            // Entrance
            else if (i === rows - 2 && j > 6 && j < 10) {
                 type = 'entrance';
            }
            // Shelves
            else if (j === 4 || j === 11) {
                type = 'book-shelf';
            }
            // Group seats
            else if ((i === 2 || i === 5 || i === 8) && (j === 2 || j === 7 || j === 13)) {
                type = 'group-seat';
                label = `G${i}-${j}`;
            }
            // Single seats
            else if ((i % 2 !== 0) && (j > 1 && j < 15 && j !== 4 && j !== 7 && j !== 11)) {
                 type = 'seat';
                 label = `S${i}-${j}`;
            }
            
            const statuses: Seat['status'][] = ['Available', 'Occupied', 'Booked', 'Pending'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            seats.push({ id, label, type, status: type === 'seat' || type === 'group-seat' ? status : 'Available'});
        }
    }
    return { id: floorId, level: 1, name: 'First Floor - Main Hall', seats, gridSize: { cols, rows } };
}

const generateSeatsForFloor2 = (floorId: string): Floor => {
    const seats: Seat[] = [];
    const rows = 10;
    const cols = 20;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const id = `${floorId}-s-${i}-${j}`;
            let type: Seat['type'] = 'space';
            let label = '';
             // Walls
            if (i === 0 || i === rows - 1) {
                type = 'wall';
            }
            else if(j === 0 || j === cols - 1) {
                type = 'window';
            }
            // Coffee station
            else if (i === 1 && j > 1 && j < 5) {
                type = 'coffee-station';
            }
             // Shelves
            else if (j === 9 || j === 10) {
                type = 'book-shelf';
            }
            // Seats
            else if (i % 2 === 0 && j > 1 && j < cols - 2 && j !== 9 && j !== 10) {
                type = 'seat';
                label = `Q${i}-${j}`;
            }

            const statuses: Seat['status'][] = ['Available', 'Available', 'Occupied'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            seats.push({ id, label, type, status: type === 'seat' ? status : 'Available'});
        }
    }
    return { id: floorId, level: 2, name: 'Second Floor - Quiet Zone', seats, gridSize: { cols, rows } };
}


export const libraries: Library[] = [
  {
    id: 'lib-1',
    name: 'Main Research Library',
    locationId: 'loc-1',
    address: '123 University Ave, Downtown',
    imageUrl: 'https://picsum.photos/seed/lib1/600/400',
    floors: [
      generateSeatsForFloor1('lib-1-f1'),
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
       generateSeatsForFloor1('lib-2-f1'),
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
      generateSeatsForFloor1('lib-4-f1'),
      generateSeatsForFloor2('lib-4-f2'),
    ],
  },
];
