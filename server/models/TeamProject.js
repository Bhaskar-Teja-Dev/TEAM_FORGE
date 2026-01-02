const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ['todo', 'inprogress', 'done'],
            default: 'todo',
        },

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        color: {
            type: String,
            default: 'blue',   // ✅ REQUIRED
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        order: Number,
    });


const TeamProjectSchema = new mongoose.Schema(
    {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
            unique: true,
            index: true,
        },

        columns: {
            todo: {
                type: String,
                default: 'To Do',
            },
            inprogress: {
                type: String,
                default: 'In Progress',
            },
            done: {
                type: String,
                default: 'Done',
            },
        },

        tasks: [TaskSchema],
    },
    { timestamps: true }
);

TaskSchema.pre('save', function (next) {
    if (this.status === 'todo') {
        this.progress = 0;
    }
    if (this.status === 'done') {
        this.progress = 100;
    }
    next();
});


module.exports = mongoose.model('TeamProject', TeamProjectSchema);
