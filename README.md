# CMU UDFire Web

A comprehensive web application for monitoring and predicting fire-related environmental data in Chiang Mai University area.

## Features

- **NDMI Drought Index** - Monitor vegetation water content and drought conditions
- **Burn Scar Tracking** - Track and analyze fire-affected areas
- **3PGs Biomass Model** - Physiological Principles Predicting Growth simulation
- **Flood Simulation** - Simulate potential flood zones based on rainfall scenarios
- **Hotspot Predicting** - ML-based prediction of fire hotspots

## Stack

- **Database**: PostGIS 15 (PostgreSQL with spatial extensions)
- **Backend**: FastAPI (Python)
- **Frontend**: Vite + React with DaisyUI + TailwindCSS
- **Mapping**: MapLibre GL JS

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd cmu_udfire_web
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the services:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Database: localhost:5432

## Development

### Backend (FastAPI)

The backend code is in the `fastapi/` directory. Changes are automatically reloaded thanks to uvicorn's `--reload` flag.

To view logs:
```bash
docker-compose logs -f fastapi
```

### Frontend (React)

The frontend code is in the `react/` directory. Vite provides hot module replacement for instant updates.

**UI Framework**: DaisyUI with TailwindCSS
- Supports light/dark theme switching (toggle in navbar)
- Fully responsive design:
  - Mobile: Stacked layout (sidebar on top, map below)
  - Desktop: Side-by-side layout (sidebar left, map right)
  - Adaptive navigation (hamburger menu on mobile, full navbar on desktop)
  - Responsive text sizes and button dimensions
- Interactive map components with MapLibre GL

**Pages**:
- `/` - NDMI Drought Index
- `/burn-scar` - Burn Scar Tracking
- `/biomass` - 3PGs Biomass Model
- `/flood` - Flood Simulation
- `/hotspot` - Hotspot Predicting

To view logs:
```bash
docker-compose logs -f react
```

### Database (PostGIS)

The database is initialized with a `locations` table containing sample data from Chiang Mai University. The initialization script is located at [postgis/init/01-init.sql](postgis/init/01-init.sql).

To connect to the database:
```bash
docker-compose exec db psql -U postgres -d cmu_udfire
```

To verify PostGIS installation:
```sql
SELECT PostGIS_Version();
```

To query sample locations:
```sql
SELECT id, name, ST_AsText(location) as coordinates FROM locations;
```

To find locations within a certain distance (e.g., 1km from a point):
```sql
SELECT name, ST_Distance(
    location::geography,
    ST_SetSRID(ST_MakePoint(98.9519, 18.8025), 4326)::geography
) as distance_meters
FROM locations
WHERE ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(98.9519, 18.8025), 4326)::geography,
    1000
);
```

## Stopping Services

```bash
docker-compose down
```

To stop and remove containers (database data in `postgis/data/` will persist):
```bash
docker-compose down
```

To completely remove all data including the database:
```bash
docker-compose down
rm -rf postgis/data
```

## Project Structure

```
cmu_udfire_web/
├── docker-compose.yml
├── .env.example
├── postgis/
│   ├── init/
│   │   └── 01-init.sql           # Database initialization script
│   └── data/                      # PostgreSQL data (gitignored)
├── fastapi/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   └── .dockerignore
└── react/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── contexts/
    │   │   └── ThemeContext.jsx  # Light/Dark theme management
    │   ├── components/
    │   │   ├── Layout.jsx        # Main layout with navbar
    │   │   └── Map.jsx           # Reusable MapLibre component
    │   └── pages/
    │       ├── NDMIDrought.jsx
    │       ├── BurnScar.jsx
    │       ├── Biomass.jsx
    │       ├── FloodSim.jsx
    │       └── HotspotPredicting.jsx
    └── .dockerignore
```

## Technology Details

### Frontend Technologies
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **DaisyUI** - Component library built on TailwindCSS
- **TailwindCSS** - Utility-first CSS framework
- **MapLibre GL JS** - Open-source mapping library
- **react-map-gl** - React wrapper for MapLibre

### Map Features
- OpenStreetMap and Satellite basemaps
- Navigation controls (zoom, rotate)
- Geolocation support
- Scale control
- Custom basemap switcher