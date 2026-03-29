"""
Test AI summarizer against live tasks in the DB.
Run with: uv run python test_ai_summarize.py
"""
import requests

BASE = "http://localhost:8000"

# ── Login ─────────────────────────────────────────────────────────────────────
r = requests.post(f"{BASE}/auth/login", json={
    "email": "testuser@example.com",
    "password": "Password123!",
})
assert r.status_code == 200, f"Login failed: {r.text}"
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Logged in\n")

# ── Fetch existing tasks ───────────────────────────────────────────────────────
tasks = requests.get(f"{BASE}/tasks/", headers=headers).json()
print(f"📋 Tasks in DB: {len(tasks)}")
for t in tasks:
    print(f"   - [{t['priority']:6}] {t['title']} ({t['status']})")

# ── Summarize ALL tasks (groq) ────────────────────────────────────────────────
print("\n── Summarize ALL tasks (groq) ────────────────────────────────────────")
r = requests.post(f"{BASE}/ai/summarize", json={"provider": "groq"}, headers=headers)
print(f"{'✅' if r.status_code == 200 else '❌'} [{r.status_code}]")
if r.status_code == 200:
    print(r.json()["result"])
else:
    print(r.text)

# ── Summarize specific task IDs (gemini) ──────────────────────────────────────
if len(tasks) >= 2:
    ids = [tasks[0]["id"], tasks[1]["id"]]
    print("\n── Summarize 2 specific tasks (gemini) ──────────────────────────────")
    r = requests.post(f"{BASE}/ai/summarize", json={"provider": "gemini", "task_ids": ids}, headers=headers)
    print(f"{'✅' if r.status_code == 200 else '❌'} [{r.status_code}]")
    if r.status_code == 200:
        print(r.json()["result"])
    else:
        print(r.text)

print("\n── Done ──────────────────────────────────────────────────────────────\n")
