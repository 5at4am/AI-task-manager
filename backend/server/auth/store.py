# In-memory user store
users = {}


def create_user(name: str, email: str, hashed_password: str):
    users[email] = {
        "name": name,
        "email": email,
        "hashed_password": hashed_password,
    }
    return users[email]


def get_user(email: str):
    return users.get(email)


def update_password(email: str, new_hashed_password: str):
    if email in users:
        users[email]["hashed_password"] = new_hashed_password
        return True
    return False
