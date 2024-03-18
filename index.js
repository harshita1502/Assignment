const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Database connection string (replace with your details)
const dbURI = 'mongodb://localhost:27017/your_database_name';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving items' });
    }
  });

app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  try {
    const item = await Item.findByIdAndUpdate(itemId, updatedItem, { new: true }); // Returns the updated document
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: `Item ${itemId} updated successfully`, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating item' });
  }
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
  
    try {
      const savedItem = await newItem.save();
      res.status(201).json({ message: 'Item created successfully', item: savedItem });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating item' });
    }
  });
  