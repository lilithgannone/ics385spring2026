//allows use of environment variables from a .env file so we can connect to Atlas without hardcoding credentials 
require('dotenv').config();

const mongoose = require('mongoose');
const Customer = require('./customerModel');
const Amenities = require('./amenitiesModel');
const Hotel = require('./hotelModel');

//Found information on "||" operator on Stack Overflow and got some assistance from ChatGPT to understand how to connect to both Atlas and a local MongoDB instance.
const connectionString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myCustomerDB';


mongoose.connect(connectionString, { useNewUrlParser: true})
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Insert three records into the Customer model
    const customersToInsert = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567'
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '555-987-6543'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '555-555-1234'
      }
    ];

    const amenitiesToInsert = [
      {
        pool: false,
        lawn: true,
        BBQ: true,
        laundry: true
      },
      {
        pool: false,
        lawn: true,
        BBQ: false,
        laundry: false
      },
      {
        pool: true,
        lawn: true,
        BBQ: true,
        laundry: true
      }
    ];

    const hotelsToInsert = [
      {
        name: 'Maui Motel',
        rating: 4.0,
        location: 'Kahului',
        description: 'The Maui Motel is an affordable and comfortable accomodation catering to budget-conscious travelers.'
      },
      {
        name: 'Pineapple Inn',
        rating: 3.5,
        location: 'Kihei',
        description: 'The Pineapple Inn offers a cozy and welcoming atmosphere with convenient access to local attractions.'
      },
      {
        name: 'Paradise Hotel',
        rating: 4.8,
        location: 'Wailea',
        description: 'The Paradise Hotel is a luxurious retreat offering exceptional service and amenities in a beautiful tropical setting.'
      }
    ];

    // Delete all documents in the Customers collection
    try {
      const result = await Customer.deleteMany({});

      console.log(`Deleted ${result.deletedCount} customers.`);
    } catch (error) {
      console.error('Error deleting customers:', error);
    }

        // Delete all documents in the Amenities collection
    try {
      const result = await Amenities.deleteMany({});

      console.log(`Deleted ${result.deletedCount} amenities.`);
    } catch (error) {
      console.error('Error deleting amenities:', error);
    }
    
        // Delete all documents in the Hotels collection
    try {
      const result = await Hotel.deleteMany({});

      console.log(`Deleted ${result.deletedCount} hotels.`);
    } catch (error) {
      console.error('Error deleting hotels:', error);
    }

    // Insert Array of CustomersToInsert into Customers Collection
    try {
      const insertedCustomers = await Customer.insertMany(customersToInsert);
      console.log('Inserted customers:', insertedCustomers);
    } catch (error) {
      console.error('Error inserting customers:', error);
    }

    // Insert Array of AmenitiesToInsert into Amenities Collection
    try {
      const insertedAmenities = await Amenities.insertMany(amenitiesToInsert);
      console.log('Inserted amenities:', insertedAmenities);
    } catch (error) {
      console.error('Error inserting amenities:', error);
    }

    // Insert Array of HotelsToInsert into Hotels Collection
    try {
      const insertedHotels = await Hotel.insertMany(hotelsToInsert);
      console.log('Inserted hotels:', insertedHotels);
    } catch (error) {
      console.error('Error inserting hotels:', error);
    }

    // Find all the documents with the last name 'Doe'
    try {
      const lastNameToFind = 'Doe';
      const customer = await Customer.find({ lastName: lastNameToFind });

      if (customer) {
        console.log(`Found customer with last name '${lastNameToFind}':`, customer);
      } else {
        console.log(`No customer found with last name '${lastNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding customer:', error);
    }

    // Find all the documents with the name 'Maui Motel'
    try {
      const hotelNameToFind = 'Maui Motel';
      const hotel = await Hotel.find({ name: hotelNameToFind });

      if (hotel) {
        console.log(`Found hotel with name '${hotelNameToFind}':`, hotel);
      } else {
        console.log(`No hotel found with name '${hotelNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding hotel:', error);
    }

    // Find all amenities offerings that include a pool
    try {
      const amenityNameToFind = 'pool';
      const amenities = await Amenities.find({ pool: true });

      if (amenities) {
        console.log(`Found amenities offerings with '${amenityNameToFind}':`, amenities);
      } else {
        console.log(`No amenities offerings found with '${amenityNameToFind}'`);
      }
    } catch (error) {
      console.error('Error finding amenities:', error);
    }
    
    // Close the MongoDB connection after finishing the operations
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//Customer.find({});