# records_registry
records registry for customers

# tech stack
1. node js/ts
2. reactjs/ts
3. docker
4. postgres

# how to run locally (without dockerfile stuff)
1. touch .env
  ```
  DATABASE_URL="postgresql://[login]:[password]@[host]:[port]/[database_name]"
  # example from docker
  DATABASE_URL="postgresql://admin:admin@localhost:5432/records_registry_db"
```
2. npm install
3. docker-compose up -d postgres
4. npx prisma migrate dev --name init
5. npm run build
6. npm start

# how to run (with dockerfile)
1. touch .env
  ```
  DATABASE_URL="postgresql://[login]:[password]@[host]:[port]/[database_name]"
  # example from docker
  DATABASE_URL="postgresql://admin:admin@localhost:5432/records_registry_db"
```
2. docker-compose up --build -d 
   
