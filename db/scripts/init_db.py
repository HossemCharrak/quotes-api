import sqlite3
import pandas as pd
import csv

# File paths
quotes_csv_file_path = "db/data/quotes.csv"
users_csv_file_path = "db/data/users.csv"
sqlite_db_path = "db/quotes.db"

try:
    # Step 1: Create SQLite database and tables
    conn = sqlite3.connect(sqlite_db_path)
    cursor = conn.cursor()

    # Define the table schema
    table_schema_quotes = """
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY,
        quote TEXT,
        author TEXT,
        tags TEXT,
        likes INTEGER
    );
    """
    cursor.execute(table_schema_quotes)
    
    table_schema_users = """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
    """
    cursor.execute(table_schema_users)
    
    table_schema_likes = """
    CREATE TABLE IF NOT EXISTS likes (
        user_id INTEGER,
        quote_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (quote_id) REFERENCES quotes(id),
        PRIMARY KEY (user_id, quote_id)
    );
    """
    cursor.execute(table_schema_likes)
    
    conn.commit()

    # Step 2: Populate the quotes table from quotes.csv
    with open(quotes_csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)  # Skip the header row
        
        headers = [header if header != 'index' else 'id' for header in headers]
        insert_query = f"INSERT INTO quotes ({', '.join(headers)}) VALUES ({', '.join(['?'] * len(headers))})"
        
        for row in csv_reader:
            cursor.execute(insert_query, row)
        conn.commit()

    # Step 3: Populate the users and likes tables from users.csv
    with open(users_csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)  # Skip the header row
        
        for row in csv_reader:
            user_id, username, likes = int(row[0]), row[1], row[2]
            
            # Insert the user into the users table
            cursor.execute("INSERT INTO users (id, name) VALUES (?, ?)", (user_id, username))
            
            # Insert the likes into the likes table
            liked_quotes =eval(likes)   
            for quote_id in liked_quotes:
                cursor.execute("INSERT INTO likes (user_id, quote_id) VALUES (?, ?)", (user_id, quote_id))
        conn.commit()

    # Step 4: Verify the data by fetching and displaying from SQLite
    print("Users:")
    users_df = pd.read_sql_query("SELECT * FROM users", conn)
    print(users_df)
    
    print("\nLikes:")
    likes_df = pd.read_sql_query("SELECT * FROM likes", conn)
    print(likes_df)

except sqlite3.DatabaseError as e:
    print(f"A database error occurred: {e}")
except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Clean up
    if cursor:
        cursor.close()
    if conn:
        conn.close()
