# Setup & Installation

This guide covers only how to install, configure, and run the Wexa AI Job & Skill Recommendation app.

---

## Prerequisites

- **Node.js** `20.19+` or `22.12+` (required by Vite 8 used in the frontend)
- **npm** (ships with Node.js)
- A **CognoDB** account and a running database instance (free C0 is fine)

Check your versions:

```bash
node -v
npm -v
```

---

## 1. Clone the repository

```bash
git clone <your-repo-url> wexa-cognodb-graph-app
cd wexa-cognodb-graph-app
```

If you already have the project locally, skip cloning and `cd` into the project root.

---

## 2. Install dependencies

Backend and frontend are separate packages. Install each once.

### Backend

```bash
cd backend
npm install
```

### Frontend

From the project root (or after leaving `backend`):

```bash
cd frontend
npm install
```

---

## 3. Create CognoDB instance

1. Create an account at [CognoDB](https://cognodb.com) (or your provided CognoDB portal).
2. Create a **free C0** (or equivalent starter) instance.
3. From the instance connection details, copy:
   - **Bolt URI** (often starts with `bolt://` or `bolt+s://`)
   - **Username**
   - **Password**

Keep the password private. Do not commit it to Git or paste it into README/spec files.

---

## 4. Configure environment variables

### Backend — `backend/.env`

1. Copy the example file:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

2. Edit `backend/.env` with **your** values (placeholders shown):

```env
PORT=3000
COGNODB_URI=bolt+s://YOUR_INSTANCE.databases.cognodb.com
COGNODB_USERNAME=your_username
COGNODB_PASSWORD=your_password
```

Notes:

- Use the exact Bolt URI CognoDB gives you (`bolt://` vs `bolt+s://` matters).
- `backend/.env` is gitignored — do not commit it.
- `backend/.env.example` is the safe template with placeholders only.

### Frontend — `frontend/.env`

1. Copy the example file:

```bash
cd frontend
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
```

2. Confirm contents (default local API):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Change this only if your backend runs on a different host/port.

---

## 5. Run database seed

With `backend/.env` configured:

```bash
cd backend
npm run seed
```

This runs `node src/seed.js` and uses **MERGE** so re-running is safe (no duplicate core nodes/relationships).

Expected success output includes counts similar to:

```text
Seed completed successfully.
Counts => Users: 5, Skills: 10, Jobs: 6, Companies: 4
```

---

## 6. Run backend

```bash
cd backend
npm start
```

For auto-reload during development:

```bash
cd backend
npm run dev
```

On success you should see that CognoDB connected and:

```text
Server running on http://localhost:3000
```

If CognoDB credentials/URI are wrong, the process exits and the API will not start.

---

## 7. Run frontend

In a **new** terminal (keep the backend running):

```bash
cd frontend
npm run dev
```

Vite serves the app at:

```text
http://localhost:5173/
```

Optional production build:

```bash
cd frontend
npm run build
npm run preview
```

---

## 8. Verify the application

### Backend health

```bash
curl http://localhost:3000/api/health
```

Expect JSON with `"status": "ok"`.

### CognoDB connection

```bash
curl http://localhost:3000/api/health/db
```

Expect a healthy response (includes a simple query result). A **503** means the database connection failed.

### User data

```bash
curl http://localhost:3000/api/users
```

Expect a list of seeded users.

### Job recommendations

```bash
curl http://localhost:3000/api/users/user-1/recommendations
```

Expect recommended jobs with matching skills / related skills for that user.

### Frontend

1. Open `http://localhost:5173`.
2. Confirm users appear in the selector.
3. Select a user and confirm skills load.
4. Confirm recommended job cards appear.
5. Click a job and confirm details + related skills load.

---

## 9. Troubleshooting

### CognoDB connection failure

- Confirm `COGNODB_URI`, `COGNODB_USERNAME`, and `COGNODB_PASSWORD` in `backend/.env`.
- Confirm the instance is running in the CognoDB console.
- Confirm the URI scheme (`bolt://` vs `bolt+s://`) matches CognoDB’s connection string.
- Restart the backend after changing `.env`.
- Test with `GET /api/health/db`.

### Missing environment variables

- Backend will refuse to start the driver if CognoDB env vars are missing.
- Frontend needs `VITE_API_BASE_URL` (restart `npm run dev` after changing `.env`).
- Copy from `.env.example` if a file is missing.

### Backend not running

- Ensure you ran `npm start` or `npm run dev` inside `backend/`.
- Check that port `3000` is free, or change `PORT` in `backend/.env`.
- Confirm `http://localhost:3000/api/health` responds.

### Frontend unable to reach backend

- Start the backend before using the UI.
- Confirm `VITE_API_BASE_URL` is `http://localhost:3000/api`.
- Watch the browser network tab for failed calls to `/api/users`.
- CORS is enabled on the backend; if you still see network errors, verify the backend process is the current one listening on port 3000.

### Seed issues

- Run seed only after `.env` is correct.
- Re-run `npm run seed` safely (MERGE-based).
- If counts are wrong, check CognoDB for connectivity first via `/api/health/db`.
