import pymongo

# 1. Connect to the local MongoDB server
client = pymongo.MongoClient("mongodb://localhost:27017/")

# 2. SELECT (or create) a database
db = client["ics385_week11"]

# 3. SELECT (or create) a collection
collection = db["Customer"]

# 4. DELETE all documents in the collection to clean up the database
collection.delete_many({})

# 5. INSERT Many to insert 3 separate customer records in the Customer collection
customers = [
{
"firstName": "Lily",
"lastName": "Gannone",
"email": "lily.gannone@example.com",
"phone": "808-555-1234",
},
{
"firstName": "Tom",
"lastName": "Smith",
"email": "tom.smith@example.com",
"phone": "808-555-1235",
},
{
"firstName": "Ada",
"lastName": "Kim",
"email": "ada.kim@example.com",
"phone": "808-555-1236",
}
]

result = collection.insert_many(customers)
print("Inserted Customer IDs:", result.inserted_ids)

# 6. UPDATE two documents
collection.update_one(
{"lastName": "Gannone"},
{"$set": {"email": "lily.gannone@newexample.com"}}
)

collection.update_one(
{"lastName": "Smith"},
{"$set": {"phone": "808-555-1237"}}
)

# 7. QUERY one customer based on last name
myquerylastName = { "lastName": "Gannone" }
mydoc = collection.find(myquerylastName)

for x in mydoc:
  print(x)

# 8. QUERY one customer based on first name 
myqueryfirstName = { "firstName": "Tom" }
mydoc = collection.find(myqueryfirstName)

for x in mydoc:
  print(x)

# 9. DROP Collection: Customer
collection.drop()
