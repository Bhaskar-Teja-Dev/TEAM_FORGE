const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		members: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
			validate: {
				validator: function (arr) {
					return arr.length === new Set(arr.map(id => id.toString())).size;
				},
				message: 'Duplicate members not allowed',
			},
		},

		pendingInvites: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				invitedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		invitePolicy: {
			type: String,
			enum: ['open', 'admin_approval'],
			default: 'open',
		},

		memberInviteToken: {
			type: String,
			required: true,
		},

		inviteCooldowns: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				rejectedAt: {
					type: Date,
					required: true,
				},
			},
		],

		maxMembers: {
			type: Number,
			enum: [4, 6, 10, 20, 60],
			required: true,
		},

		inviteToken: {
			type: String,
			unique: true,
			index: true,
		},
	},
	{ timestamps: true }
);

/* 🔒 HARD GUARANTEE: NO DUPLICATE PENDING USERS */
TeamSchema.pre('save', function (next) {
	if (!this.pendingInvites || this.pendingInvites.length <= 1) {
		return next();
	}

	const seen = new Set();

	this.pendingInvites = this.pendingInvites.filter(invite => {
		const key = invite.user.toString();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	next();
});

module.exports = mongoose.model('Team', TeamSchema);
