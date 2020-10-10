const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const ObjectIdValid = (id) => {
    try {
        return new ObjectId(id).toString() === id;
    }
    catch{
        return false;
    }
}

module.exports = ObjectIdValid;