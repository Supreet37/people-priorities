def calculate_priority_score(complaint_count, ward_stats):
    # Mock ranking logic
    base_score = min(95, 60 + complaint_count * 2)
    return {
        "priority_score": base_score,
        "demand_score": complaint_count * 1.5,
        "gap_score": 5.0,
        "demographic_score": 7.5,
        "accessibility_score": 6.0,
        "justification": f"{complaint_count} citizen complaints received."
    }
