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
        'eventID', 'temperature_C', 'DepthInMeters', 'decimalLatitude', 
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

    # --- Apply Validation Rules ---
    if 'eventID' in clean_df.columns:
        clean_df['eventID'] = clean_df['eventID'].astype(str)
        pattern = r"^ATL\d{4}_\d{2}$"
        clean_df['eventID'] = clean_df['eventID'].where(clean_df['eventID'].str.match(pattern, na=False), np.nan)

    if 'temperature_C' in clean_df.columns:
        clean_df['temperature_C'] = pd.to_numeric(clean_df['temperature_C'], errors="coerce")
        clean_df['temperature_C'] = clean_df['temperature_C'].where(clean_df['temperature_C'].between(-2, 40), np.nan)
        
    if 'DepthInMeters' in clean_df.columns:
        clean_df['DepthInMeters'] = pd.to_numeric(clean_df['DepthInMeters'], errors="coerce")
        clean_df['DepthInMeters'] = clean_df['DepthInMeters'].where(clean_df['DepthInMeters'].between(0, 11000), np.nan)

    numeric_cols = ['decimalLatitude', 'decimalLongitude', 'sea_water_salinity', 'oxygen_concentration_mgL', 'sea_water_velocity']
    for col in numeric_cols:
        if col in clean_df.columns:
            clean_df[col] = pd.to_numeric(clean_df[col], errors="coerce")

    if 'eventDate' in clean_df.columns:
        # This flexible parser handles most common date formats (YYYY-MM-DD, MM/DD/YYYY, etc.)
        clean_df['eventDate'] = pd.to_datetime(clean_df['eventDate'], errors='coerce')

    # Drop rows where all values are missing *after* all cleaning and validation
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
        # You can add other data types here in the future
        # elif data_type == 'fish':
        #     cleaned_df = clean_fish_data(uploaded_data)
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