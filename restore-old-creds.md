# Restore Old Database Credentials

Based on the error, your current `.env` has cPanel credentials:
```
DB_USER=ujjwal_ujjwal
DB_PASSWORD=Socialit@2026
DB_NAME=ujjwal_chambal_sandesh
```

These are for cPanel server, not local development.

## Common Local MySQL Credentials:

1. **Root user with no password:**
   ```
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=chambal_sandesh
   ```

2. **Root user with password:**
   ```
   DB_USER=root
   DB_PASSWORD=your_local_mysql_password
   DB_NAME=chambal_sandesh
   ```

3. **Local user:**
   ```
   DB_USER=your_local_username
   DB_PASSWORD=your_local_password
   DB_NAME=chambal_sandesh
   ```

Please tell me what your old local MySQL credentials were, and I'll restore them.
