-- Create the Users table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY, -- AUTO_INCREMENT in MySQL is IDENTITY in SQL Server
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT GETDATE(), -- TIMESTAMP and CURRENT_TIMESTAMP in MySQL are DATETIME and GETDATE() in SQL Server
    updated_at DATETIME DEFAULT GETDATE()
);

-- Create the Comments table
CREATE TABLE Comments (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    -- Foreign Key constraint referencing the Users table
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE -- Or ON DELETE RESTRICT / SET NULL depending on requirements
);

-- Index on the foreign key in Comments for faster joins/lookups by user
CREATE INDEX idx_comments_user_id ON Comments (user_id);

-- Index on created_at in Comments for faster sorting by date
CREATE INDEX idx_comments_created_at ON Comments (created_at);

-- Create the Passwords table
CREATE TABLE Passwords (
    password_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
);

-- Optional: Index on user_id for performance
CREATE INDEX idx_passwords_user_id ON Passwords(user_id);

-- Create the Replies table
CREATE TABLE Replies (
    reply_id INT IDENTITY(1,1) PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (comment_id) REFERENCES Comments(comment_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE NO ACTION
);

-- Optional: Indexes for performance
CREATE INDEX idx_replies_comment_id ON Replies(comment_id);
CREATE INDEX idx_replies_user_id ON Replies(user_id);
CREATE INDEX idx_replies_created_at ON Replies(created_at);