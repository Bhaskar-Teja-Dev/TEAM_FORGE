const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireCompleteProfile = require('../middleware/requireCompleteProfile');
const TeamProject = require('../models/TeamProject');
const Team = require('../models/Team');

/* =========================
   GET PROJECT BOARD
========================= */
router.get('/:teamId', auth, requireCompleteProfile, async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (!team.members.includes(req.user)) {
            return res.status(403).json({ message: 'Not a team member' });
        }

        let project = await TeamProject.findOne({ teamId });

        if (!project) {
            project = await TeamProject.create({
                teamId,
                tasks: [],
            });
        }

        const grouped = {
            todo: [],
            inprogress: [],
            done: [],
        };

        project.tasks.forEach(task => {
            grouped[task.status].push(task);
        });

        Object.keys(grouped).forEach(k => {
            grouped[k].sort((a, b) => a.order - b.order);
        });

        res.json(grouped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load project board' });
    }
});

/* =========================
   CREATE TASK
========================= */
router.post('/:teamId/tasks', auth, requireCompleteProfile, async (req, res) => {
    try {
        const { teamId } = req.params;
        const { title } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Task title required' });
        }

        const project = await TeamProject.findOneAndUpdate(
            { teamId },
            {
                $push: {
                    tasks: {
                        title,
                        status: 'todo',
                        progress: 0,
                        order: Date.now(),
                        createdBy: req.user, // ✅ FIX
                    },
                },
            },
            { new: true, upsert: true }
        );

        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create task' });
    }
});


/* =========================
   UPDATE TASK STATUS (DRAG & DROP)
========================= */
router.patch(
    '/:teamId/tasks/:taskId/status',
    auth,
    requireCompleteProfile,
    async (req, res) => {
        try {
            const { teamId, taskId } = req.params;
            const { status, order } = req.body;

            if (!['todo', 'inprogress', 'done'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const project = await TeamProject.findOne({ teamId });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const task = project.tasks.id(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            task.status = status;
            task.order = order ?? task.order;

            // 🔒 HARD RULES
            if (status === 'todo') task.progress = 0;
            if (status === 'done') task.progress = 100;

            await project.save();

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to update task status' });
        }
    }
);

/* =========================
   UPDATE TASK PROGRESS
========================= */
router.patch(
    '/:teamId/tasks/:taskId/progress',
    auth,
    requireCompleteProfile,
    async (req, res) => {
        try {
            const { teamId, taskId } = req.params;
            const { progress } = req.body;

            if (progress < 0 || progress > 100) {
                return res.status(400).json({ message: 'Invalid progress value' });
            }

            const project = await TeamProject.findOne({ teamId });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const task = project.tasks.id(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            if (task.status !== 'inprogress') {
                return res
                    .status(400)
                    .json({ message: 'Progress only allowed in progress tasks' });
            }

            task.progress = progress;
            await project.save();

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to update progress' });
        }
    }
);


/* =========================
   UPDATE TASK COLOR
========================= */
router.patch(
    '/:teamId/tasks/:taskId/color',
    auth,
    requireCompleteProfile,
    async (req, res) => {
        try {
            const { teamId, taskId } = req.params;
            const { color } = req.body;

            const project = await TeamProject.findOne({ teamId });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const task = project.tasks.id(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            task.color = color;
            await project.save();

            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to update color' });
        }
    }
);


/* =========================
   DELETE TASK
========================= */
router.delete(
    '/:teamId/tasks/:taskId',
    auth,
    requireCompleteProfile,
    async (req, res) => {
        try {
            const { teamId, taskId } = req.params;

            const project = await TeamProject.findOne({ teamId });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            project.tasks = project.tasks.filter(
                t => t._id.toString() !== taskId
            );

            await project.save();
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to delete task' });
        }
    }
);

module.exports = router;
