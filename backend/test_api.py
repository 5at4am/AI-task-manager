"""
End-to-end API test: signup, login, CRUD tasks, update, delete.
Run with: uv run python test_api.py
"""
import requests

BASE = "http://localhost:8000"

# ── helpers ──────────────────────────────────────────────────────────────────

def ok(label, res):
    status = "✅" if res.status_code < 300 else "❌"
    print(f"{status} [{res.status_code}] {label}")
    if res.status_code >= 300:
        print("   ", res.text)
    return res

def json_ok(label, res):
    ok(label, res)
    return res.json()

# ── 1. Signup ─────────────────────────────────────────────────────────────────

print("\n── Auth ──────────────────────────────────────────────────────────────")

r = requests.post(f"{BASE}/auth/signup", json={
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "Password123!",
})
# 400 is fine if user already exists
if r.status_code not in (201, 400):
    ok("signup", r)
else:
    print(f"✅ [{r.status_code}] signup")

# ── 2. Login ──────────────────────────────────────────────────────────────────

data = json_ok("login", requests.post(f"{BASE}/auth/login", json={
    "email": "testuser@example.com",
    "password": "Password123!",
}))

token = data.get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# ── 3. Create tasks ───────────────────────────────────────────────────────────

print("\n── Create Tasks ──────────────────────────────────────────────────────")

sample_tasks = [
    {"title": "Build login page",      "description": "Responsive login form with JWT auth", "priority": "high",   "tags": ["frontend", "auth"]},
    {"title": "Fix database timeout",  "description": "Queries taking 30s on large datasets", "priority": "high",   "tags": ["backend", "bug"]},
    {"title": "Write unit tests",      "description": "Cover auth and task endpoints",         "priority": "medium", "tags": ["testing"]},
    {"title": "Update README",         "description": "Add setup and usage instructions",      "priority": "low",    "tags": ["docs"]},
]

created_ids = []
for task in sample_tasks:
    t = json_ok(f"create → {task['title']}", requests.post(f"{BASE}/tasks/", json=task, headers=headers))
    created_ids.append(t["id"])

# ── 4. List all tasks ─────────────────────────────────────────────────────────

print("\n── List Tasks ────────────────────────────────────────────────────────")

tasks = json_ok("list all", requests.get(f"{BASE}/tasks/", headers=headers))
print(f"   total: {len(tasks)}")

# ── 5. Get single task ────────────────────────────────────────────────────────

print("\n── Get Single Task ───────────────────────────────────────────────────")

t = json_ok(f"get {created_ids[0][:8]}…", requests.get(f"{BASE}/tasks/{created_ids[0]}", headers=headers))
print(f"   title: {t['title']}")

# ── 6. Update a task ──────────────────────────────────────────────────────────

print("\n── Update Task ───────────────────────────────────────────────────────")

updated = json_ok("update status → in_progress", requests.patch(
    f"{BASE}/tasks/{created_ids[0]}",
    json={"status": "in_progress"},
    headers=headers,
))
print(f"   status: {updated['status']}")

updated = json_ok("update priority → low", requests.patch(
    f"{BASE}/tasks/{created_ids[1]}",
    json={"priority": "low", "description": "Resolved with connection pooling"},
    headers=headers,
))
print(f"   priority: {updated['priority']}")

# ── 7. Filter tasks ───────────────────────────────────────────────────────────

print("\n── Filter Tasks ──────────────────────────────────────────────────────")

high = json_ok("filter priority=high", requests.get(f"{BASE}/tasks/?priority=high", headers=headers))
print(f"   high priority count: {len(high)}")

in_prog = json_ok("filter status=in_progress", requests.get(f"{BASE}/tasks/?status=in_progress", headers=headers))
print(f"   in_progress count: {len(in_prog)}")

# ── 8. Delete a task ──────────────────────────────────────────────────────────

print("\n── Delete Task ───────────────────────────────────────────────────────")

ok(f"delete {created_ids[-1][:8]}…", requests.delete(f"{BASE}/tasks/{created_ids[-1]}", headers=headers))

remaining = json_ok("list after delete", requests.get(f"{BASE}/tasks/", headers=headers))
print(f"   remaining: {len(remaining)}")

print("\n── Done ──────────────────────────────────────────────────────────────\n")
