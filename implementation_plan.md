# School Bus Tracker - Implementation Plan

## 1. Project Initialization
- Initialize a new Vite + React application.
- Set up project structure (components, pages, context, assets).
- Install `react-router-dom` for navigation and `leaflet` / `react-leaflet` for map functionality.
- Install `lucide-react` for icons.

## 2. Design & Theming (Vanilla CSS)
- Create `src/index.css` with CSS variables for a premium color palette (Vibrant Primary, Dark Mode support, Glassmorphism).
- Global styles for typography (Inter/Outfit).
- Utility classes for layout (Flexbox/Grid), spacing, and glass effects.

## 3. Core Architecture
- **Auth Context**: Manage current user session (Parent, Driver, Admin).
- **Bus Context**: Manage shared state for Bus Location (simulated), Alerts, and Status.
- **Mock Data**: Create realistic mock data for students, routes, and buses.

## 4. Feature Implementation

### Phase A: Foundation & Routing
- Set up Routes: `/`, `/login`, `/parent`, `/driver`, `/admin`.
- Create a secure-looking but simple Login Screen allowing selection of roles for the demo.

### Phase B: Parent Panel
- **Dashboard**: Summary cards (Status, Payments, Alerts).
- **Map View**: Integrated Leaflet map showing live bus icon moving.
- **Payment Mockup**: UI for paying fees (Monthly/Yearly).
- **Alerts**: Notification feed.
- **Complaints**: Form to submit and view status.

### Phase C: Driver Panel
- Minimalist UI.
- "Start Trip" / "End Trip" buttons.
- "SOS" button.
- Status toggle triggers simulation of bus movement in the shared Context.

### Phase D: Admin Panel
- Dashboard with overview stats.
- List views for Parents, Drivers, Buses.
- Status monitoring of the active fleet.

## 5. UI/UX Polish
- Add micro-animations (hover states, modal entries).
- Ensure mobile responsiveness.
- Verify "Wow" factor in design.

## 6. Testing & Handover
- Verify all tracking flows.
- Ensure payment/complaint forms feel interactive.
