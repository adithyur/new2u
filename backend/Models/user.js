const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    trade: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'verifier', 'user'],
        default: 'user'
    },
    status:{
        type: String,
        enum: ['active', 'deactivate', 'removed'],
        default: 'active'
    }

});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

module.exports = mongoose.model('User', userSchema);