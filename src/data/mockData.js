// Simulate a route in a generic city (e.g., Delhi/Mumbai/NY)
// This is a simple straightish line for demo purposes
export const BUS_ROUTE = [
  { lat: 19.0760, lng: 72.8777, label: "School" },
  { lat: 19.0770, lng: 72.8787 },
  { lat: 19.0780, lng: 72.8797 },
  { lat: 19.0790, lng: 72.8807, label: "Bus Stop A" },
  { lat: 19.0800, lng: 72.8817 },
  { lat: 19.0810, lng: 72.8827 },
  { lat: 19.0820, lng: 72.8837, label: "Bus Stop B" },
  { lat: 19.0830, lng: 72.8847 },
  { lat: 19.0840, lng: 72.8857, label: "Student Home" }, // Destination for this demo
  { lat: 19.0830, lng: 72.8847 },
  { lat: 19.0820, lng: 72.8837 },
  { lat: 19.0810, lng: 72.8827 },
  { lat: 19.0800, lng: 72.8817 },
  { lat: 19.0790, lng: 72.8807 },
  { lat: 19.0780, lng: 72.8797 },
  { lat: 19.0770, lng: 72.8787 },
  { lat: 19.0760, lng: 72.8777 },
];

export const USERS = {
  parent: {
    id: 1,
    name: "John Doe",
    role: "parent",
    childName: "Alex Doe",
    busNumber: "MH-02-1234",
    email: "parent@school.com",
  },
  driver: {
    id: 2,
    name: "Ramesh Kumar",
    role: "driver",
    busNumber: "MH-02-1234",
    email: "driver@school.com",
    phone: "+91 98765 43210"
  },
  admin: {
    id: 3,
    name: "Principal Smith",
    role: "admin",
    schoolName: "Greenwood High",
    email: "admin@school.com"
  }
};

export const INITIAL_ALERTS = [
  { id: 1, type: "info", message: "Bus started from School", time: "07:30 AM" },
  { id: 2, type: "warning", message: "Traffic delay on Main Street", time: "07:45 AM" },
];

export const INITIAL_ALERTS_ADMIN = [
  { id: 1, type: "info", message: "All buses running on schedule", time: "07:00 AM" },
];

export const COMPLAINTS = [
  { id: 101, parent: "John Doe", subject: "Late Arrival", status: "Resolved", date: "2023-10-10" },
  { id: 102, parent: "Sarah Lee", subject: "Rash Driving", status: "In Review", date: "2023-10-12" },
];
