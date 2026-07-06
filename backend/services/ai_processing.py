def suggest_category(text):
    categories = {
        "Road": ["road", "sadak", "pothole", "gaddha", "street", "traffic"],
        "Drainage": ["drain", "nali", "sewage", "paani", "flood", "water logging"],
        "School": ["school", "vidyalaya", "education", "bachche", "teacher", "student"],
        "Hospital": ["hospital", "doctor", "treatment", "aspat", "clinic", "health"],
        "Sanitation": ["clean", "safai", "garbage", "kuda", "sanitation", "toilet"],
        "Electricity": ["bijli", "light", "power", "electric", "wire", "pole"],
        "Water": ["water", "paani", "tap", "supply", "pipeline", "drinking"],
        "Employment": ["job", "rojgar", "employment", "work", "income"]
    }
    
    detected = []
    for cat, keywords in categories.items():
        if any(kw in text.lower() for kw in keywords):
            detected.append(cat)
    
    return detected[0] if detected else "Uncategorized"

def analyze_sentiment(text):
    # Mock sentiment analysis
    return "Negative" # Complaints are usually negative
