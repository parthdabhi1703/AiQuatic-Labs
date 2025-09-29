import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get leaflet data for map display
export const getLeafletData = async (req, res) => {
    try {
        // Path to the CSV file
        const csvFilePath = path.join(__dirname, '..', '..', 'sample_data', 'leaflet_data.csv');
        
        // Check if file exists
        if (!fs.existsSync(csvFilePath)) {
            console.log('CSV file not found at:', csvFilePath);
            
            // Return some sample data if CSV is not found
            const sampleData = [
                {
                    eventID: "82016",
                    scientificName: "Harpiliopsis depressa",
                    locality: "Agatti Island, Lakshadweep",
                    Temperature_C: 15.27,
                    DepthInMeters: 10,
                    decimalLatitude: 10.86,
                    decimalLongitude: 72.18,
                    sea_water_salinity: 36.47,
                    oxygen_concentration_mgL: 7.07,
                    eventDate: "24-03-2023"
                },
                {
                    eventID: "82019",
                    scientificName: "Coralliocaris superba",
                    locality: "Agatti Island, Lakshadweep",
                    Temperature_C: 27.08,
                    DepthInMeters: 10,
                    decimalLatitude: 10.86,
                    decimalLongitude: 72.18,
                    sea_water_salinity: 36.01,
                    oxygen_concentration_mgL: 7.93,
                    eventDate: "22-07-2021"
                },
                {
                    eventID: "82022",
                    scientificName: "Ophiothrix (Acanthophiothrix) purpurea",
                    locality: "Agatti, Lakshadweep",
                    Temperature_C: 29.39,
                    DepthInMeters: 20,
                    decimalLatitude: 10.866,
                    decimalLongitude: 72.207,
                    sea_water_salinity: 36.44,
                    oxygen_concentration_mgL: 6.01,
                    eventDate: "20-06-2023"
                }
            ];
            
            return res.json(sampleData);
        }

        // Read and parse the CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.error('CSV parsing errors:', results.errors);
                }
                
                // Convert string numbers to actual numbers for better frontend handling
                const processedData = results.data.map(row => ({
                    ...row,
                    Temperature_C: parseFloat(row.Temperature_C),
                    DepthInMeters: parseFloat(row.DepthInMeters),
                    decimalLatitude: parseFloat(row.decimalLatitude),
                    decimalLongitude: parseFloat(row.decimalLongitude),
                    sea_water_salinity: parseFloat(row.sea_water_salinity),
                    oxygen_concentration_mgL: parseFloat(row.oxygen_concentration_mgL),
                    sea_water_velocity: parseFloat(row.sea_water_velocity)
                }));

                console.log(`Serving ${processedData.length} leaflet data records`);
                res.json(processedData);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ 
                    error: 'Failed to parse CSV data',
                    message: error.message 
                });
            }
        });

    } catch (error) {
        console.error('Error in getLeafletData:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
};

// Get sample/demo data for map display (doesn't require CSV file)
export const getSampleLeafletData = async (req, res) => {
    try {
        const sampleData = [
            {
                eventID: "82016",
                scientificName: "Harpiliopsis depressa",
                locality: "Agatti Island, Lakshadweep",
                Temperature_C: 15.27,
                DepthInMeters: 10,
                decimalLatitude: 10.86,
                decimalLongitude: 72.18,
                sea_water_salinity: 36.47,
                oxygen_concentration_mgL: 7.07,
                eventDate: "24-03-2023"
            },
            {
                eventID: "82019",
                scientificName: "Coralliocaris superba",
                locality: "Agatti Island, Lakshadweep",
                Temperature_C: 27.08,
                DepthInMeters: 10,
                decimalLatitude: 10.86,
                decimalLongitude: 72.18,
                sea_water_salinity: 36.01,
                oxygen_concentration_mgL: 7.93,
                eventDate: "22-07-2021"
            },
            {
                eventID: "82022",
                scientificName: "Ophiothrix (Acanthophiothrix) purpurea",
                locality: "Agatti, Lakshadweep",
                Temperature_C: 29.39,
                DepthInMeters: 20,
                decimalLatitude: 10.866,
                decimalLongitude: 72.207,
                sea_water_salinity: 36.44,
                oxygen_concentration_mgL: 6.01,
                eventDate: "20-06-2023"
            },
            {
                eventID: "82031",
                scientificName: "Comaster schlegelii",
                locality: "Kavaratti, Lakshadweep",
                Temperature_C: 25.0,
                DepthInMeters: 15,
                decimalLatitude: 11.131,
                decimalLongitude: 72.717,
                sea_water_salinity: 33.62,
                oxygen_concentration_mgL: 5.6,
                eventDate: "16-03-2019"
            },
            {
                eventID: "82048",
                scientificName: "Phyllidia alyta",
                locality: "Angria Bank",
                Temperature_C: 15.85,
                DepthInMeters: 32,
                decimalLatitude: 16.21,
                decimalLongitude: 72.09,
                sea_water_salinity: 32.9,
                oxygen_concentration_mgL: 5.41,
                eventDate: "07-01-2019"
            },
            {
                eventID: "82049",
                scientificName: "Taringa caudata",
                locality: "Angria Bank",
                Temperature_C: 27.7,
                DepthInMeters: 35,
                decimalLatitude: 16.24,
                decimalLongitude: 72.06,
                sea_water_salinity: 34.34,
                oxygen_concentration_mgL: 4.08,
                eventDate: "26-02-2018"
            }
        ];

        console.log(`Serving ${sampleData.length} sample leaflet data records`);
        res.json(sampleData);
        
    } catch (error) {
        console.error('Error in getSampleLeafletData:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
};