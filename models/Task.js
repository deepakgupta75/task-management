const mongoose = require('mongoose');




const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'in progress', 'completed'], 
        default: 'pending'  // Default status set to 'pending'
    },    
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },  // New field for priority
    dueDate: { type: Date },  // New field for due date
    tags: [{ type: String }],  // New field for tags (array of strings)
}, { timestamps: true });




module.exports = mongoose.model('Task', taskSchema);
