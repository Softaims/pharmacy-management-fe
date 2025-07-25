# Pharmacy Management Frontend

A modern web application for pharmacy management, featuring two distinct panels: an **Admin Panel** and a **Pharmacy Panel**. Built with React, Vite, and Google Maps integration.

## Features

### Admin Panel

- Secure login (credentials provided separately)
- Create, edit, delete, and disable pharmacies
- Manage pharmacy details and status

### Pharmacy Panel

- View and manage only your own pharmacy's orders
- Change order status: Pending, In Preparation, Ready to Pickup, ready to Deliver, Finalized
- View prescription details, including:
  - Patient information
  - Prescription PDF
  - Mutual card, AME card, Vitallic card, etc.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19.2 recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Softaims/pharmacy-management-fe.git
   cd pharmacy-management-fe
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Environment Variables:**
   - Create a `.env` file at the root of the project.
   - Add the following variables:
     ```env
     VITE_API_BASE_URL=<your-backend-url>
     VITE_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
     ```
   - Replace `<your-backend-url>` and `<your-google-maps-api-key>` with your actual values.

### Running the Project

```sh
npm run dev
```

- The app will be available at `http://localhost:5173` by default.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **APIs:** Google Maps (Places, Geocoding)
- **PDF Viewing:** Integrated viewers for prescriptions and cards

## Project Structure

- `src/components/Admin/` — Admin panel components
- `src/components/Pharmacy/` — Pharmacy panel components
- `src/pages/` — Page-level components
- `src/api/` — API service and axios instance
- `src/contexts/` — React context providers
- `public/` — Static assets

## Notes

- Admin credentials are provided separately for security.
- Ensure you have valid backend and Google Maps API keys before running the project.
