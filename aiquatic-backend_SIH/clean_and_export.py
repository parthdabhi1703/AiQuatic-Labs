import pandas as pd
import numpy as np
import sys
import json

def normalize_column(col_name):
    """Normalizes column names for fuzzy matching."""
    if not isinstance(col_name, str):
        return ""
    norm = col_name.replace("_", "").replace(" ", "").replace("(", "").replace(")", "").lower()
    if norm.endswith('c'):
        norm = norm[:-1]
    return norm

def create_strict_column_map(uploaded_cols, standard_cols):
    """
    Creates a strict, one-to-one mapping from an uploaded column to a standard column.
    It finds the best match for each standard column and ensures no duplicates are created.
    """
    col_map = {}
    used_uploaded_cols = set()

    for std_col in standard_cols:
        norm_std = normalize_column(std_col)
        best_match = None
        
        # Find the best matching uploaded column that hasn't been used yet
        for up_col in uploaded_cols:
            if up_col in used_uploaded_cols:
                continue
            norm_up = normalize_column(up_col)
            if norm_std in norm_up or norm_up in norm_std:
                best_match = up_col
                break # Take the first match we find
        
        if best_match:
            col_map[best_match] = std_col
            used_uploaded_cols.add(best_match)
            
    return col_map

def clean_ocean_data(df):
    """Cleans data according to the Ocean/Standardized format rules."""
    STANDARD_COLUMNS = [
        'eventID', 'locality', 'temperature_C', 'DepthInMeters', 'decimalLatitude', 
        'decimalLongitude', 'sea_water_salinity', 'oxygen_concentration_mgL', 
        'sea_water_velocity', 'eventDate'
    ]
    
    # Use the new, stricter mapping function
    col_map = create_strict_column_map(df.columns, STANDARD_COLUMNS)
    
    # Get the list of original column names that we successfully mapped
    original_cols_to_keep = list(col_map.keys())
    
    if not original_cols_to_keep:
        # If no standard columns were found, return an empty DataFrame
        return pd.DataFrame()
        
    # Create the initial DataFrame with only the columns we need
    clean_df = df[original_cols_to_keep].copy()
    
    # Rename the columns to the standard names
    clean_df.rename(columns=col_map, inplace=True)
    
    # Re-assigning is safer than using inplace=True for this operation
    clean_df = clean_df.drop_duplicates()

    # --- Apply Validation Rules (Made Less Strict) ---
    if 'eventID' in clean_df.columns:
        clean_df['eventID'] = clean_df['eventID'].astype(str)
        
        # Fix invalid eventIDs - handle "0", "nan", empty strings, etc.
        invalid_mask = (
            (clean_df['eventID'].str.len() == 0) |
            (clean_df['eventID'] == '0') |
            (clean_df['eventID'] == 'nan') |
            (clean_df['eventID'].isna()) |
            (clean_df['eventID'].str.strip() == '')
        )
        
        # Generate proper eventIDs for invalid ones using a safer approach
        for idx in clean_df[invalid_mask].index:
            clean_df.loc[idx, 'eventID'] = f'OCEAN_{idx + 1}'

    # Generate locality from coordinates if locality column doesn't exist or is empty
    if 'locality' not in clean_df.columns:
        clean_df['locality'] = pd.Series([None] * len(clean_df), index=clean_df.index)
    
    # Fill missing localities with approximate location based on coordinates
    if 'decimalLatitude' in clean_df.columns and 'decimalLongitude' in clean_df.columns:
        def get_approximate_locality(lat, lon):
            """Approximate Indian coastal localities based on coordinates"""
            try:
                if pd.isna(lat) or pd.isna(lon) or lat is None or lon is None:
                    return "Unknown"
                
                # Convert to float to ensure numeric comparison
                lat = float(lat)
                lon = float(lon)
            except (ValueError, TypeError):
                return "Unknown"
            
            # Indian coastal regions approximate coordinates
            if 18.9 <= lat <= 19.1 and 72.8 <= lon <= 73.0:
                return "Mumbai"
            elif 15.2 <= lat <= 15.6 and 73.7 <= lon <= 74.2:
                return "Goa"
            elif 9.9 <= lat <= 10.0 and 76.2 <= lon <= 76.3:
                return "Kochi"
            elif 12.8 <= lat <= 13.0 and 74.7 <= lon <= 74.9:
                return "Mangalore"
            elif 13.0 <= lat <= 13.1 and 80.2 <= lon <= 80.3:
                return "Chennai"
            elif 17.6 <= lat <= 17.8 and 83.2 <= lon <= 83.4:
                return "Vizag"
            elif 19.8 <= lat <= 20.0 and 85.8 <= lon <= 86.0:
                return "Paradip"
            elif 22.5 <= lat <= 22.7 and 88.3 <= lon <= 88.4:
                return "Kolkata"
            elif 19.8 <= lat <= 20.0 and 86.7 <= lon <= 86.9:
                return "Puri"
            elif 11.3 <= lat <= 11.5 and 92.7 <= lon <= 92.9:
                return "Port Blair (Andaman)"
            elif 8.2 <= lat <= 8.4 and 76.1 <= lon <= 76.3:
                return "Tuticorin"
            elif 21.6 <= lat <= 21.8 and 69.6 <= lon <= 69.8:
                return "Veraval"
            elif 14.8 <= lat <= 15.0 and 74.0 <= lon <= 74.2:
                return "Karwar"
            elif 20.4 <= lat <= 20.6 and 72.8 <= lon <= 73.0:
                return "Daman"
            # Bay of Bengal region
            elif 8.0 <= lat <= 22.0 and 80.0 <= lon <= 95.0:
                return "Bay of Bengal"
            # Arabian Sea region
            elif 8.0 <= lat <= 24.0 and 68.0 <= lon <= 78.0:
                return "Arabian Sea"
            # Indian Ocean region
            elif -10.0 <= lat <= 15.0 and 65.0 <= lon <= 100.0:
                return "Indian Ocean"
            else:
                return f"Coordinates_{lat:.1f}_{lon:.1f}"
        
        # Apply locality detection only where locality is missing
        try:
            locality_mask = clean_df['locality'].isna() | (clean_df['locality'] == '') | (clean_df['locality'] == 'nan')
            
            # Use a safer approach to apply locality detection
            for idx in clean_df[locality_mask].index:
                try:
                    lat = clean_df.loc[idx, 'decimalLatitude'] if 'decimalLatitude' in clean_df.columns else None
                    lon = clean_df.loc[idx, 'decimalLongitude'] if 'decimalLongitude' in clean_df.columns else None
                    clean_df.loc[idx, 'locality'] = get_approximate_locality(lat, lon)
                except Exception:
                    clean_df.loc[idx, 'locality'] = "Unknown"
        except Exception:
            # If locality processing fails, set all to Unknown
            clean_df['locality'] = "Unknown"

    if 'temperature_C' in clean_df.columns:
        clean_df['temperature_C'] = pd.to_numeric(clean_df['temperature_C'], errors="coerce")
        # More lenient temperature range - allow broader range
        clean_df['temperature_C'] = clean_df['temperature_C'].where(clean_df['temperature_C'].between(-5, 50), np.nan)
        
    if 'DepthInMeters' in clean_df.columns:
        clean_df['DepthInMeters'] = pd.to_numeric(clean_df['DepthInMeters'], errors="coerce")
        # More lenient depth range - allow surface to deep ocean
        clean_df['DepthInMeters'] = clean_df['DepthInMeters'].where(clean_df['DepthInMeters'].between(-5, 15000), np.nan)

    # Apply lenient numeric conversion to other columns
    numeric_cols = ['decimalLatitude', 'decimalLongitude', 'sea_water_salinity', 'oxygen_concentration_mgL', 'sea_water_velocity']
    for col in numeric_cols:
        if col in clean_df.columns:
            clean_df[col] = pd.to_numeric(clean_df[col], errors="coerce")
            # Keep all numeric values, don't enforce strict ranges

    if 'eventDate' in clean_df.columns:
        # This flexible parser handles most common date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
        clean_df['eventDate'] = pd.to_datetime(clean_df['eventDate'], errors='coerce')

    # Only drop rows where ALL critical values are missing (more lenient)
    # Keep rows that have at least some valid data
    critical_cols = [col for col in ['temperature_C', 'DepthInMeters', 'decimalLatitude', 'decimalLongitude'] if col in clean_df.columns]
    if critical_cols:
        # Keep rows that have at least one critical column with data
        clean_df = clean_df.dropna(subset=critical_cols, how='all')
    else:
        # If no critical columns exist, just remove completely empty rows
        clean_df.dropna(how='all', inplace=True)
    
    return clean_df

def clean_fish_data(df):
    """Cleans data according to the Fish/Taxonomic format rules."""
    STANDARD_COLUMNS = [
        'eventID', 'taxonID', 'scientificName', 'vernacularName', 'Phylum',
        'Class', 'Order', 'Family', 'Genus', 'Species', 'organismQuantity'
    ]
    
    # Use the same mapping function as ocean data
    col_map = create_strict_column_map(df.columns, STANDARD_COLUMNS)
    
    # Get the list of original column names that we successfully mapped
    original_cols_to_keep = list(col_map.keys())
    
    if not original_cols_to_keep:
        # If no standard columns were found, return an empty DataFrame
        return pd.DataFrame()
        
    # Create the initial DataFrame with only the columns we need
    clean_df = df[original_cols_to_keep].copy()
    
    # Rename the columns to the standard names
    clean_df.rename(columns=col_map, inplace=True)
    
    # Remove duplicates
    clean_df = clean_df.drop_duplicates()

    # --- Apply Fish Data Validation Rules ---
    if 'eventID' in clean_df.columns:
        clean_df['eventID'] = clean_df['eventID'].astype(str)
        # Generate eventIDs for missing values
        clean_df['eventID'] = clean_df['eventID'].where(
            clean_df['eventID'].str.len() > 0, 
            'FISH_' + clean_df.index.astype(str)
        )

    # Convert organism quantity to numeric
    if 'organismQuantity' in clean_df.columns:
        clean_df['organismQuantity'] = pd.to_numeric(clean_df['organismQuantity'], errors="coerce")
        # Allow any positive number or zero
        clean_df['organismQuantity'] = clean_df['organismQuantity'].where(clean_df['organismQuantity'] >= 0, np.nan)

    # Keep rows that have at least some taxonomic information
    taxonomic_cols = [col for col in ['scientificName', 'Family', 'Genus', 'Species', 'Class'] if col in clean_df.columns]
    if taxonomic_cols:
        # Keep rows that have at least one taxonomic field with data
        clean_df = clean_df.dropna(subset=taxonomic_cols, how='all')
    else:
        # If no taxonomic columns exist, just remove completely empty rows
        clean_df.dropna(how='all', inplace=True)
    
    return clean_df

# --- Main Execution Block ---
if __name__ == "__main__":
    # Expects three arguments: script name, input filepath, and data type
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Invalid arguments. Usage: python clean_and_export.py <filepath> <dataType>"}), file=sys.stderr)
        sys.exit(1)

    input_filepath = sys.argv[1]
    data_type = sys.argv[2]

    try:
        # Use on_bad_lines='skip' to be resilient to malformed CSV rows
        uploaded_data = pd.read_csv(input_filepath, on_bad_lines='skip')
        
        cleaned_df = pd.DataFrame()

        # Route to the correct cleaning function based on the data type from the frontend
        if data_type == 'ocean':
            cleaned_df = clean_ocean_data(uploaded_data)
        elif data_type == 'fish':
            cleaned_df = clean_fish_data(uploaded_data)
        # You can add other data types here in the future (edna, otolith)
        else:
            print(json.dumps({"error": f"Unknown data type provided: {data_type}"}), file=sys.stderr)
            sys.exit(1)

        # Convert the final cleaned DataFrame to a JSON string and print to standard output
        # This is the data that Node.js will receive
        result_json = cleaned_df.to_json(orient="records", date_format="iso")
        print(result_json)

    except Exception as e:
        # If any unexpected error occurs, print it to standard error for Node.js to catch
        print(json.dumps({"error": f"A critical error occurred in the Python script: {str(e)}"}), file=sys.stderr)
        sys.exit(1)