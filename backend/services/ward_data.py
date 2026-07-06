def get_all_wards():
    return [f"Ward {i}" for i in range(1, 11)]

def get_ward_coordinates(ward_name):
    # Mock coordinates for demo
    coords = {
        "Ward 1": [12.9716, 77.5946],
        "Ward 2": [12.9816, 77.6046],
        "Ward 3": [12.9916, 77.6146],
        "Ward 4": [13.0016, 77.6246],
        "Ward 5": [13.0116, 77.6346],
        "Ward 6": [13.0216, 77.6446],
        "Ward 7": [13.0316, 77.6546],
        "Ward 8": [13.0416, 77.6646],
        "Ward 9": [13.0516, 77.6746],
        "Ward 10": [13.0616, 77.6846],
    }
    return coords.get(ward_name, [12.9716, 77.5946])
