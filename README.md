# MongoDB ↔ Firestore Data Sync

This script automates the synchronization of data between MongoDB and Firestore. It connects to a MongoDB database, retrieves data from a specified collection, and ensures synchronization with a corresponding Firestore collection. The script is designed to keep both databases up-to-date.

## Prerequisites

Before running the script, ensure you have the following prerequisites:

- Node.js installed on your machine
- MongoDB instance running locally or accessible via a connection string
- Firebase project with Firestore enabled and a service account JSON file

## Installation


# Clone the Repository
git clone https://github.com/MatosSam/MongoSyncFirebase.git

# Change to Project Directory
cd MongoSyncFirebase

# Install Dependencies
npm install

Configuration
Edit the script (syncData.js) and adjust the following configuration:

MongoDB Configuration:
mongoURI: MongoDB connection string.

Firestore Configuration:
Update the serviceAccount variable with the path to your Firebase Admin SDK JSON file.

# Run the Script
node syncData.js


The script will connect to MongoDB, retrieve data from the specified collection, and synchronize it with the corresponding Firestore collection. Console logs will indicate the progress and success of the synchronization.

# Notes
The script assumes that both MongoDB and Firestore have a collection named 'mycollection'. Adjust the collection names in the script according to your database structure.

The script compares documents based on their _id fields. If a document with the same _id exists in Firestore, it checks the updatedAt field to determine if an update is needed.

Ensure proper handling of sensitive information, especially when dealing with service account credentials.



