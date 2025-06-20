def score(user_val, correct_val):
    if correct_val == 0 and abs(user_val) < 1e-6:
        return True
    if correct_val != 0 and abs((user_val - correct_val) / correct_val) < 1e-2:
        return True
    return False