# **App Name**: Seatmylibrary

## Core Features:

- Landing Page: The landing page should have an introduction about the website, a login button, user reviews, and contact information.
- User Classification: Users are classified into two types: admin and user. Admin accounts can be approved through a specific Gmail account.
- User Authentication: Secure user login using Firebase Authentication to verify student and admin status.
- Location and Library Selection: Students select their location and then choose from available libraries for booking.
- Library Discovery: Allow users to view available sections and floors within a library.
- Real-Time Seat Status: Display seat availability in real-time (Available/Occupied) using Firestore.
- Individual & Group Booking: Support booking seats for both solo and group study sessions.
- Admin Seat Release and Approval: Admin login should have access to add libraries and locations, approve student bookings (changing seat color upon approval).
- Auto Seat Release: Automatically release unused seats after a set time to prevent booking hoarding.
- Suggested Seats: Generative AI tool that can provide seat suggestions based on users profile such as subject interest and learning style.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a calm and focused atmosphere, drawing inspiration from the pursuit of knowledge.
- Background color: Light lavender (#E8EAF6), a desaturated variant of indigo, for a soft and unobtrusive backdrop.
- Accent color: Vibrant purple (#7E57C2), an analogous color to indigo, chosen to make key interactive elements stand out.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a balance of modernity and warmth, making it suitable for both headings and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use simple, clear icons to represent different library sections, seat types, and booking status.
- Design a clean and intuitive seat layout view that accurately reflects the library's physical space.
- Use subtle animations to indicate seat status changes and booking confirmations.