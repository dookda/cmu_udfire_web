-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create locations table with spatial data
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    address VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on location column for better query performance
CREATE INDEX IF NOT EXISTS idx_locations_location ON locations USING GIST (location);

-- Insert sample data (Chiang Mai University locations)
INSERT INTO locations (name, description, location, address) VALUES
    (
        'Chiang Mai University',
        'Main campus of Chiang Mai University',
        ST_SetSRID(ST_MakePoint(98.9519, 18.8025), 4326),
        '239 Huay Kaew Road, Muang District, Chiang Mai 50200, Thailand'
    ),
    (
        'Ang Kaew Reservoir',
        'Scenic lake at CMU campus',
        ST_SetSRID(ST_MakePoint(98.9542, 18.8011), 4326),
        'Chiang Mai University, Chiang Mai, Thailand'
    ),
    (
        'Engineering Building 1',
        'Faculty of Engineering main building',
        ST_SetSRID(ST_MakePoint(98.9520, 18.8030), 4326),
        'Faculty of Engineering, Chiang Mai University'
    );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE locations TO postgres;
GRANT USAGE, SELECT ON SEQUENCE locations_id_seq TO postgres;
