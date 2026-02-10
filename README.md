# School Bus Tracker

A premium, role-based real-time school bus tracking application.

## Features

- **Role-Based Access**: Specialized panels for Parents, Drivers, and Admins.
- **Live GPS Tracking**: Real-time location sharing from driver's device to parents/admin.
- **Cross-Tab Sync**: Instant updates across browser tabs for demo purposes.
- **Alerts System**: Instant notifications for delays, arrival, and emergencies.
- **Driver Console**: Simple "Start/Stop" trip buttons and SOS feature.
- **Parent Tools**: Fee payments and complaint submission.
- **Admin Dashboard**: Fleet overview and management.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Premium Custom Design System)
- **Maps**: Leaflet / React-Leaflet
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   Visit `http://localhost:5173` in your browser.

## How to Use (Demo)

1. **Login**: Click on a generic role card (Parent, Driver, Admin). No password required for demo.
2. **Driver**: Click "Start Trip" to begin the location simulation.
3. **Parent/Admin**: Switch to these roles (or open in Incognito) to see the bus moving in real-time.