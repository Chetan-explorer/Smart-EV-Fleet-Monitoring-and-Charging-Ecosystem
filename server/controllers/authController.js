const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, vehicleNumber, vehicleModel } = req.body;

        // Domain validations
        const assignedRole = role || 'User'; // Default to User
        
        if (assignedRole === 'Admin' || assignedRole === 'FleetManager') {
            if (!email.endsWith('@fleet.com')) {
                return res.status(400).json({ message: 'Admin and Fleet Manager accounts must use a @fleet.com email domain' });
            }
        } else if (assignedRole === 'User') {
            if (!email.endsWith('@gmail.com')) {
                return res.status(400).json({ message: 'Standard User accounts must use a @gmail.com email domain' });
            }
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole,
            vehicleNumber: assignedRole === 'User' ? (vehicleNumber || '') : undefined,
            vehicleModel: assignedRole === 'User' ? (vehicleModel || '') : undefined
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                vehicleModel: user.vehicleModel,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                vehicleModel: user.vehicleModel,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vehicleNumber: user.vehicleNumber,
            vehicleModel: user.vehicleModel,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').lean();
        const Booking = require('../models/Booking');
        const allBookings = await Booking.find({}).lean();

        const enhancedUsers = users.map(user => {
            const userBookings = allBookings.filter(b => b.userId.toString() === user._id.toString());
            const cancelled = userBookings.filter(b => b.status === 'cancelled').length;
            const completed = userBookings.filter(b => b.status === 'completed').length;
            const active = userBookings.filter(b => b.status === 'active').length;
            
            let lastBookedDate = null;
            if (userBookings.length > 0) {
                const latestBooking = [...userBookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                lastBookedDate = latestBooking.createdAt;
            }

            return {
                ...user,
                stats: {
                    totalBookings: userBookings.length,
                    active,
                    completed,
                    cancelled,
                    lastBookedDate
                }
            };
        });

        res.json(enhancedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers
};
