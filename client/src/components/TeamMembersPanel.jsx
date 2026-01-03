import { getAvatarSrc } from '../services/avatar';
import './TeamMembersPanel.css';

export default function TeamMembersPanel({
    team,
    onlineSet = new Set(),
    currentUserId,
    pendingInvites = [],
    onApprove,
    onReject,
}) {
    if (!team || !Array.isArray(team.members)) return null;

    const adminId =
        typeof team.admin === 'object' ? team.admin._id : team.admin;

    const adminIdStr = String(adminId);
    const currentUserIdStr = String(currentUserId);

    // ✅ Admin always on top
    const sortedMembers = [...team.members].sort((a, b) => {
        if (String(a._id) === adminIdStr) return -1;
        if (String(b._id) === adminIdStr) return 1;
        return 0;
    });

    return (
        <div className="team-members-panel">
            <h3>Members</h3>

            {/* 🔒 INVITE POLICY */}
            {team.invitePolicy === 'admin_approval' && (
                <div className="invite-policy-note">
                    🔒 Member invites require admin approval
                </div>
            )}

            {/* MEMBERS LIST */}
            {sortedMembers.map(member => {
                if (!member?._id) return null;

                const memberIdStr = String(member._id);
                const isAdmin = memberIdStr === adminIdStr;
                const isMe = memberIdStr === currentUserIdStr;
                const isOnline = onlineSet.has(memberIdStr);

                return (
                    <div key={memberIdStr} className="member-row">
                        <img
                            src={getAvatarSrc(member.profileImage)}
                            alt={member.fullName || 'User'}
                            className="member-avatar"
                        />

                        <div className="member-info">
                            <div className="member-name-row">
                                <span className="member-name">
                                    {member.fullName || 'Unknown'}
                                </span>

                                <div className="member-badges">
                                    {isMe && <span className="you-badge">You</span>}
                                    {isAdmin && <span className="admin-badge">Admin</span>}
                                    {isOnline && <span className="online-badge">●</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* PENDING INVITES (ADMIN ONLY) */}
            {adminIdStr === currentUserIdStr && (
                <>
                    <h4>Pending Join Requests</h4>

                    {pendingInvites.length === 0 && (
                        <p className="empty">No pending requests</p>
                    )}

                    {pendingInvites.map(invite => {
                        if (!invite?.user?._id) return null;

                        return (
                            <div key={invite.user._id} className="invite-row">
                                <span>{invite.user.fullName}</span>
                                <button onClick={() => onApprove(invite.user._id)}>
                                    Approve
                                </button>
                                <button onClick={() => onReject(invite.user._id)}>
                                    Reject
                                </button>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
