const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['Admin', 'FleetManager', 'User'],
        default: 'FleetManager'
    },
    vehicleNumber: {
        type: String,
        default: ''
    },
    vehicleModel: {
        type: String,
        default: ''
    },
    batteryCapacity: {
        type: Number,
        default: 100
    },
    vehicleStatus: {
        type: String,
        enum: ['idle', 'active', 'charging'],
        default: 'idle'
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Check if the stored password is a valid bcrypt hash
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$') && !this.password.startsWith('$2y$')) {
        // Legacy plain text comparison
        if (enteredPassword === this.password) {
            // Automatically upgrade to hashed password
            this.password = enteredPassword;
            await this.save();
            return true;
        }
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
