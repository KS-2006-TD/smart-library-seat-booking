
import { Library, Location, libraries as initialLibraries, locations as initialLocations } from '@/lib/data';

// In-memory store for the mock data.
// In a real application, this would be replaced with a database connection.
interface AppStore {
    libraries: Library[];
    locations: Location[];
}

// Initialize the store with the data from data.ts
const store: AppStore = {
    libraries: [...initialLibraries.map(lib => ({...lib}))],
    locations: [...initialLocations.map(loc => ({...loc}))]
};

// Functions to interact with the store
export function getLibraries(): Library[] {
    return store.libraries;
}

export function getLocations(): Location[] {
    return store.locations;
}

export function addLibrary(library: Library) {
    store.libraries.push(library);
}

export function addLocation(location: Location) {
    store.locations.push(location);
}

export function findLibrary(id: string): Library | undefined {
    return store.libraries.find(l => l.id === id);
}

export function updateLibrary(id: string, updatedData: Partial<Library>) {
    const libIndex = store.libraries.findIndex(l => l.id === id);
    if (libIndex !== -1) {
        store.libraries[libIndex] = { ...store.libraries[libIndex], ...updatedData };
    }
}

export function getFloor(libraryId: string, floorId: string): Floor | undefined {
    const library = findLibrary(libraryId);
    return library?.floors.find(f => f.id === floorId);
}

export function updateFloor(libraryId: string, floorId: string, updatedFloor: Floor) {
    const library = findLibrary(libraryId);
    if (library) {
        const floorIndex = library.floors.findIndex(f => f.id === floorId);
        if (floorIndex !== -1) {
            library.floors[floorIndex] = updatedFloor;
        }
    }
}

export function updateSeatStatus(libraryId: string, seatId: string, status: 'Available' | 'Occupied' | 'Booked' | 'Pending') {
    const library = findLibrary(libraryId);
    if (library) {
        for (const floor of library.floors) {
            if (floor.layout?.tables) {
                for (const table of floor.layout.tables) {
                    const seatIndex = table.seats.findIndex(s => s.id === seatId);
                    if (seatIndex !== -1) {
                        table.seats[seatIndex].status = status;
                        return; // Exit after finding and updating the seat
                    }
                }
            }
        }
    }
}
