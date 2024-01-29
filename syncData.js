const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');

// Configure Firebase credentials
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configure connection to MongoDB
const mongoURI = 'mongodb://localhost:27017/concertBooking'; // Use your database name
const client = new MongoClient(mongoURI);

// Initialize Firestore
const firestore = admin.firestore();

async function syncData() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Select MongoDB collection
    const db = client.db('concertBooking'); // Use your database name
    const collection = db.collection('mycollection'); // Use your collection name

    // Get documents from MongoDB
    const mongodbData = await collection.find().toArray();

    // Connect to Firestore
    const firestore = admin.firestore();
    console.log('Connected to Firestore');

    // Save data to Firestore
    const firestoreCollection = firestore.collection('mycollection');
    await Promise.all(
      mongodbData.map(async (doc) => {
        // Use the same _id from MongoDB as the identifier in Firestore
        const firestoreDoc = { ...doc };

        // Remove the original _id field
        delete firestoreDoc._id;

        // Check if a document with the same _id exists in Firestore
        const existingDoc = await firestoreCollection.doc(doc._id.toString()).get();

        // Compare the update date to determine if an update is necessary
        if (!existingDoc.exists || existingDoc.data().updatedAt < firestoreDoc.updatedAt) {
          // Add or update in Firestore only if it doesn't exist or if there is an update
          await firestoreCollection.doc(doc._id.toString()).set(firestoreDoc);
          console.log(`Document with _id ${doc._id.toString()} synchronized.`);
        } else {
          console.log(`Document with _id ${doc._id.toString()} is already updated in Firestore. Ignoring.`);
        }
      })
    );

    console.log('Data synchronized successfully!');
  } catch (error) {
    console.error('Error during synchronization:', error);
  } finally {
    // Close the connection to MongoDB
    try {
      console.log('Closing connection to MongoDB');
      await client.close();
      console.log('Connection closed');
    } catch (error) {
      console.error('Error while closing connection:', error);
    }
  }
}

// Function to compare fields of two objects
function compareFields(obj1, obj2) {
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
}

// Call the synchronization function
syncData();
