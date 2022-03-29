const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    message:{
        content: { type: String, required: true },
        username: { type: String, required: true },
    }
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;