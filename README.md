# Dephy Dataset Database

This project sets up a PostgreSQL database for the Dephy Dataset, using Drizzle ORM for schema management and migrations.

## Project Structure

```
DephyDataset/
├── docker-compose.yml           # PostgreSQL database setup
├── drizzle.config.ts            # Drizzle ORM configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── export/
│   ├── contexte/
│   │   └── zone.csv            # Zone/context data
│   ├── intervention/            # Intervention data (future)
│   └── intrant_et_culture/      # Input and culture data (future)
├── env/
│   └── .env.local              # Local environment variables
├── src/
│   ├── index.ts                # Database client export
│   └── schema/
│       ├── index.ts            # Schema exports
│       ├── contexte/
│       │   ├── index.ts
│       │   └── zone.ts         # Zone table schema
│       ├── intervention/        # Intervention schema (future)
│       └── intrant_et_culture/  # Input/culture schema (future)
├── scripts/
│   ├── import-zones.ts         # CSV import script (deprecated)
│   └── import-data.ts          # Generic data import script
└── migration/                   # Generated migration files (auto-created)
```

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start the Database

The database runs on port **5433** (not 5432) to avoid conflicts with other PostgreSQL instances.

```bash
yarn db:start
```

This will start a PostgreSQL container with:
- Database name: `dephy`
- User: `postgres`
- Password: `postgres`
- Port: `5433` (mapped from container's 5432)

### 3. Generate and Apply Migrations

Generate migration files from your schema:

```bash
yarn drizzle:generate
```

Apply migrations to the database:

```bash
yarn drizzle:migrate
```

### 4. Import Data

Once the database is set up and migrations are applied, import data from the CSV files:

```bash
yarn import:data
```

This will read all CSV files from the `export/` directory and import them into the appropriate tables. The script processes records in batches of 1000.

You can also import specific categories:

```bash
yarn import:data contexte
yarn import:data intervention
yarn import:data intrant_et_culture
```

## Database Schema

### Zone Table

| Column       | Type             | Description                           |
|-------------|------------------|---------------------------------------|
| id          | text (PK)        | Unique zone identifier                |
| code        | text             | Zone code                             |
| campagne    | integer          | Campaign year                         |
| surface     | double precision | Surface area                          |
| parcelle_id | text             | Related parcel identifier             |
| type        | text             | Zone type (e.g., PRINCIPALE)          |
data` - Import all data from export/ directory
- `yarn import:data [category]` - Import specific category (contexte, intervention, intrant_et_culture)
## Available Scripts

- `yarn db:start` - Start the PostgreSQL database container
- `yarn db:stop` - Stop and remove the database container
- `yarn drizzle:generate` - Generate migration files from schema changes
- `yarn drizzle:migrate` - Apply migrations to the database
- `yarn drizzle:studio` - Open Drizzle Studio for database exploration
- `yarn import:zones` - Import zones from zone.csv into the database

## Environment Variables

Environment variables are stored in `env/.env.local`:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=dephy
```

## Using the Database in Your Code

```typescript
import { db, zone } from "@bloomeo/dephy-dataset";

// Query all zones
const allZones = await db.select().from(zone);

// Query zones for a specific campaign
const zones2021 = await db.select()
  .from(zone)
  .where(eq(zone.campagne, 2021));

// Insert a new zone
await db.insert(zone).values({
  id: "new-zone-id",
  code: "ZONE-001",
  campagne: 2026,
  surface: 5.5,
  parcelleId: "parcel-id",
  type: "PRINCIPALE"
});
```

## Development Workflow

1. Modify schema files in `src/schema/`
2. Generate migrations: `yarn drizzle:generate`
3. Review generated SQL in `migration/` directory
4. Apply migrations: `yarn drizzle:migrate`
5. Test with Drizzle Studio: `yarn drizzle:studio`

## Notes

- The database uses PostGIS extension (PostgreSQL with spatial capabilities)
- Port 5433 is used to avoid conflicts with the main Bloomeo database on 5432
- CSV import handles large files by processing records in batches
- All database operations use Drizzle ORM for type safety
