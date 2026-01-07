export interface Seat {
  id: string;
  label: string;
  status: 'Available' | 'Occupied' | 'Booked' | 'Pending';
  type: 'seat' | 'space' | 'wall' | 'window';
}

export interface Floor {
  id: string;
  level: number;
  name: string;
  seats: Seat[];
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
  name: string;
}

export const locations: Location[] = [
  { id: 'loc-1', name: 'Downtown Campus' },
  { id: 'loc-2', name: 'North Campus' },
  { id: 'loc-3', name: 'Westwood Campus' },
];

const generateSeats = (floorId: string): Seat[] => {
    const seats: Seat[] = [];
    const rows = 10;
    const cols = 15;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const id = `${floorId}-s-${i}-${j}`;
            if (i === 0 || i === rows - 1) {
                seats.push({ id, label: '', type: 'wall', status: 'Available' });
            } else if (j === 0 || j === cols - 1) {
                 seats.push({ id, label: '', type: 'window', status: 'Available' });
            } else if (j % 4 === 0 || i % 3 === 0) {
                seats.push({ id, label: '', type: 'space', status: 'Available' });
            } else {
                const statuses: Seat['status'][] = ['Available', 'Occupied', 'Booked'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const label = `${String.fromCharCode(65 + i-1)}${j}`;
                seats.push({ id, label, type: 'seat', status });
            }
        }
    }
    return seats;
}

export const libraries: Library[] = [
  {
    id: 'lib-1',
    name: 'Main Research Library',
    locationId: 'loc-1',
    address: '123 University Ave, Downtown',
    imageUrl: 'https://picsum.photos/seed/lib1/600/400',
    floors: [
      { id: 'lib-1-f1', level: 1, name: 'First Floor - Quiet Zone', seats: generateSeats('lib-1-f1') },
      { id: 'lib-1-f2', level: 2, name: 'Second Floor - Group Study', seats: generateSeats('lib-1-f2') },
    ],
  },
  {
    id: 'lib-2',
    name: 'Science & Engineering Library',
    locationId: 'loc-2',
    address: '456 Innovation Dr, North Campus',
    imageUrl: 'https://picsum.photos/seed/lib2/600/400',
    floors: [
      { id: 'lib-2-f1', level: 1, name: 'Ground Floor - Periodicals', seats: generateSeats('lib-2-f1') },
      { id: 'lib-2-f2', level: 2, name: 'Second Floor - Labs', seats: generateSeats('lib-2-f2') },
      { id: 'lib-2-f3', level: 3, name: 'Third Floor - Reading Room', seats: generateSeats('lib-2-f3') },
    ],
  },
  {
    id: 'lib-3',
    name: 'Arts & Humanities Library',
    locationId: 'loc-1',
    address: '789 Culture St, Downtown',
    imageUrl: 'https://picsum.photos/seed/lib3/600/400',
    floors: [
      { id: 'lib-3-f1', level: 1, name: 'Main Hall', seats: generateSeats('lib-3-f1') },
    ],
  },
   {
    id: 'lib-4',
    name: 'Westwood Medical Library',
    locationId: 'loc-3',
    address: '101 Health Sci Pkwy, Westwood',
    imageUrl: 'https://picsum.photos/seed/lib4/600/400',
    floors: [
      { id: 'lib-4-f1', level: 1, name: 'Main Floor', seats: generateSeats('lib-4-f1') },
      { id: 'lib-4-f2', level: 2, name: 'Research Wing', seats: generateSeats('lib-4-f2') },
    ],
  },
];
