ALTER TABLE bus_trips ADD COLUMN pickup_lat DECIMAL(9, 6) NULL AFTER pickup_point, ADD COLUMN pickup_lng DECIMAL(9, 6) NULL AFTER pickup_lat;
