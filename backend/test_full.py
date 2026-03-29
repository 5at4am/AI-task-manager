"""
Full endpoint audit - tests every backend route.
Run with: uv run python test_full.py
"""
import requests

BASE = "http://localhost:8000"
PASS, FAIL = "✅", "❌"

def check(label, res, expected=None):
    expected = expected or [200, 201, 204]
    ok = res.status_code in expected
    print(f"{'✅' if ok else '❌'} [{res.status_code}] {label}")
    if not ok:
        print(f"   {res.text[:200]}")
    return res if ok else None

results = {"pass": 0, "fail": 0}

def record(res):
    if res: results["pass"] += 1
    else: results["fail"] += 1
    return res

# ─────────────────────────────────────────────────────────────────────────────
print("\n── 1. AUTH ──────────────────────────────────────────────────────────")

# signup (201 or 400 if already exists)
r = requests.post(f"{BASE}/auth/signup", json={"name":"Test User","email":"testuser@example.com","password":"Password123!"})
ok = r.status_code in (201, 400)
print(f"{'✅' if ok else '❌'} [{r.status_code}] signup")
record(r if ok else None)

# login
r = record(check("login", requests.post(f"{BASE}/auth/login", json={"email":"testuser@example.com","password":"Password123!"})))
token = r.json().get("access_token") if r else None
H = {"Authorization": f"Bearer {token}"} if token else {}

# wrong password
r = requests.post(f"{BASE}/auth/login", json={"email":"testuser@example.com","password":"wrongpass"})
ok = r.status_code == 401
print(f"{'✅' if ok else '❌'} [{r.status_code}] login with wrong password (expect 401)")
record(r if ok else None)

# forgot password
r = record(check("forgot-password", requests.post(f"{BASE}/auth/forgot-password", json={"email":"testuser@example.com"})))
reset_token = r.json().get("reset_token") if r else None

# reset password
if reset_token:
    record(check("reset-password", requests.post(f"{BASE}/auth/reset-password", json={"token": reset_token, "new_password": "Password123!"})))
else:
    print("⚠️  skipping reset-password (no token)")

# ─────────────────────────────────────────────────────────────────────────────
print("\n── 2. TASKS ─────────────────────────────────────────────────────────")

if not token:
    print("❌ No token, skipping task tests")
else:
    # create
    ids = []
    for t in [
        {"title":"Build login page","description":"JWT auth form","priority":"high","tags":["frontend","auth"]},
        {"title":"Fix DB timeout","description":"Slow queries on large sets","priority":"high","tags":["backend","bug"]},
        {"title":"Write unit tests","priority":"medium","tags":["testing"]},
        {"title":"Update README","priority":"low","tags":["docs"]},
    ]:
        r = record(check(f"create → {t['title']}", requests.post(f"{BASE}/tasks/", json=t, headers=H), [201]))
        if r: ids.append(r.json()["id"])

    # list all
    r = record(check("list all tasks", requests.get(f"{BASE}/tasks/", headers=H)))
    if r: print(f"   count: {len(r.json())}")

    # filter by priority
    r = record(check("filter priority=high", requests.get(f"{BASE}/tasks/?priority=high", headers=H)))
    if r: print(f"   high priority: {len(r.json())}")

    # filter by status
    r = record(check("filter status=todo", requests.get(f"{BASE}/tasks/?status=todo", headers=H)))
    if r: print(f"   todo: {len(r.json())}")

    # get by id
    if ids:
        r = record(check(f"get task by id", requests.get(f"{BASE}/tasks/{ids[0]}", headers=H)))

    # update status
    if ids:
        r = record(check("update status → in_progress", requests.patch(f"{BASE}/tasks/{ids[0]}", json={"status":"in_progress"}, headers=H)))
        if r: print(f"   status: {r.json()['status']}")

    # update priority
    if len(ids) > 1:
        r = record(check("update priority → low", requests.patch(f"{BASE}/tasks/{ids[1]}", json={"priority":"low"}, headers=H)))
        if r: print(f"   priority: {r.json()['priority']}")

    # get non-existent task
    r = requests.get(f"{BASE}/tasks/nonexistent-id", headers=H)
    ok = r.status_code == 404
    print(f"{'✅' if ok else '❌'} [{r.status_code}] get non-existent task (expect 404)")
    record(r if ok else None)

    # delete
    if ids:
        record(check("delete task", requests.delete(f"{BASE}/tasks/{ids[-1]}", headers=H), [204]))
        r = record(check("list after delete", requests.get(f"{BASE}/tasks/", headers=H)))
        if r: print(f"   remaining: {len(r.json())}")

# ─────────────────────────────────────────────────────────────────────────────
print("\n── 3. AI (groq only) ────────────────────────────────────────────────")

if not token:
    print("❌ No token, skipping AI tests")
else:
    # suggest
    r = record(check("ai/suggest (groq)", requests.post(f"{BASE}/ai/suggest", json={
        "title": "Fix database timeout",
        "description": "Queries taking 30s on large datasets",
        "tags": ["backend", "bug"],
        "provider": "groq"
    }, headers=H)))
    if r: print(f"   preview: {r.json()['result'][:120]}...")

    # summarize all
    r = record(check("ai/summarize all (groq)", requests.post(f"{BASE}/ai/summarize", json={"provider":"groq"}, headers=H)))
    if r: print(f"   preview: {r.json()['result'][:120]}...")

    # summarize specific ids
    if ids and len(ids) >= 2:
        r = record(check("ai/summarize by ids (groq)", requests.post(f"{BASE}/ai/summarize",
            json={"provider":"groq","task_ids": ids[:2]}, headers=H)))
        if r: print(f"   preview: {r.json()['result'][:120]}...")

# ─────────────────────────────────────────────────────────────────────────────
print("\n── 4. UNAUTHENTICATED ACCESS ────────────────────────────────────────")

for label, method, url in [
    ("GET /tasks/ without token",  "get",  f"{BASE}/tasks/"),
    ("POST /tasks/ without token", "post", f"{BASE}/tasks/"),
]:
    r = getattr(requests, method)(url, json={"title":"x"})
    ok = r.status_code == 403
    print(f"{'✅' if ok else '❌'} [{r.status_code}] {label} (expect 403)")
    record(r if ok else None)

# ─────────────────────────────────────────────────────────────────────────────
total = results["pass"] + results["fail"]
print(f"\n── Results: {results['pass']}/{total} passed ──────────────────────────────────\n")
