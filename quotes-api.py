import logging
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app instance
app = FastAPI()

# Allow requests from all origins (adjust as needed for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Data model for a quote (for response validation)
class Quote(BaseModel):
    id: int
    quote: str
    author: str
    tags: Optional[str] = None
    likes: int = 0
    isLiked: Optional[bool] = False
# Database utility functions
DATABASE_PATH = "db/quotes.db"

# Function to get a connection to the database
def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Allows access to rows as dictionaries
    return conn

# Create a quote (Insert into database)
@app.post("/quotes/", response_model=Quote)
def create_quote(quote: Quote):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if quote already exists (based on 'id')
    cursor.execute("SELECT * FROM quotes WHERE id = ?", (quote.id,))
    existing_quote = cursor.fetchone()
    
    if existing_quote:
        conn.close()  # Ensure the connection is closed
        raise HTTPException(status_code=400, detail="Quote with this id already exists.")
    
    # Insert the new quote into the database
    cursor.execute(
        "INSERT INTO quotes (id, quote, author, tags, likes) VALUES (?, ?, ?, ?, ?)",
        (quote.id, quote.quote, quote.author, quote.tags, quote.likes),  # Corrected 'quote.tag' to 'quote.tags'
    )
    conn.commit()
    conn.close()

    return quote

# Read all quotes from the database
@app.get("/quotes", response_model=List[Quote])
def read_quotes(user_id: int,limit: int = 10, skip: int = 0):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quotes LIMIT ? OFFSET ?", (limit, skip))
    rows = cursor.fetchall()
    cursor.execute("SELECT * FROM likes WHERE user_id = ?", (user_id,))
    likes = cursor.fetchall()
    rows = [dict(row) for row in rows]  # Convert rows to list of dictionaries
    for row in rows:
        row["isLiked"] = False
        for like in likes:
            if like["quote_id"] == row["id"]:
                row["isLiked"] = True
                break
    conn.close()

    return rows

# Read a single quote by id
@app.get("/quotes/{id}", response_model=Quote)
def read_quote(id: int, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quotes WHERE id = ?", (id,))
    row = cursor.fetchone()
    if row:
        cursor.execute("SELECT * FROM likes WHERE user_id = ? and quote_id = ?", (user_id, id,))
        like = cursor.fetchone()
        row = dict(row)
        if like:
            row["isLiked"] = True
        conn.close()
        return row
    else:
        conn.close()
        raise HTTPException(status_code=404, detail="Quote not found.")

# Update likes for a quote
@app.patch("/quotes/{id}/likes", response_model=Quote)
def update_likes(id: int, user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if the user already liked the quote
        cursor.execute(
            "SELECT * FROM likes WHERE user_id = ? AND quote_id = ?", (user_id, id)
        )
        like = cursor.fetchone()

        if like:
            # Unlike the quote
            cursor.execute("UPDATE quotes SET likes = likes - 1 WHERE id = ?", (id,))
            cursor.execute(
                "DELETE FROM likes WHERE user_id = ? AND quote_id = ?", (user_id, id)
            )
        else:
            # Like the quote
            cursor.execute("UPDATE quotes SET likes = likes + 1 WHERE id = ?", (id,))
            cursor.execute(
                "INSERT INTO likes (user_id, quote_id) VALUES (?, ?)", (user_id, id)
            )

        conn.commit()

        # Fetch the updated quote
        updated_quote = read_quote(id, user_id)

        if not updated_quote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Quote not found"
            )

        # Return the updated quote as a dictionary
        return dict(updated_quote)

    except Exception as e:
        logging.error("Error updating likes: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating likes.",
        )
    finally:
        conn.close()

# Delete a quote by id
@app.delete("/quotes/{id}", response_model=Quote)
def delete_quote(id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quotes WHERE id = ?", (id,))
    row = cursor.fetchone()

    if row:
        cursor.execute("DELETE FROM quotes WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return dict(row)
    else:
        conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote not found.")
