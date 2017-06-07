/*
* Created by Haneya Yunus
*
* This script outlines the creation of the database schema required for mood. The rest is done by the application itself.
* Run MySQL on localhost.
* Make sure you change the MySQL password (to your root password) in the app.py file to access it!
*/

CREATE DATABASE mood;
USE mood;
CREATE TABLE users (id BIGINT NULL AUTOINCREMENT, username VARCHAR(20), password VARCHAR(20));
