import sqlite3

# Path to your SQLite database
DATABASE_PATH = "db/quotes.db"

# Function to read the quotes table
def read_quotes_from_db():
    # Connect to the SQLite database
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This allows us to access rows as dictionaries
    cursor = conn.cursor()

    # Execute query to fetch all quotes
    cursor.execute("SELECT * FROM likes")
    
    # Fetch all rows
    rows = cursor.fetchall()

    # Close the connection
    conn.close()

    # Return the result as a list of dictionaries
    return [dict(row) for row in rows]

# Fetch and print the quotes
quotes = read_quotes_from_db()
for quote in quotes:
    print(quote)