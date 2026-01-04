import { useMemo, useState } from 'react';
import { getAvatarSrc } from '../services/avatar';
import { teamAPI } from '../services/api';
import './InviteModal.css';

export default function InviteModal({
    team,
    matches = [],
    currentUserId,
    onClose,
}) {
    if (!team || !currentUserId) return null;

    const adminId =
        typeof team.admin === 'object'
            ? team.admin._id
            : team.admin;

    const isAdmin = String(adminId) === String(currentUserId);

    const teamMemberIds = new Set(
        (team.members || []).map(m => String(m._id))
    );

    const [invitedIds, setInvitedIds] = useState(new Set());

    const eligibleUsers = useMemo(() => {
        return matches
            .map(c =>
                c?.participants?.find(
                    p => String(p._id) !== String(currentUserId)
                )
            )
            .filter(Boolean)
            .filter(u => !teamMemberIds.has(String(u._id)))
            .filter(u => !invitedIds.has(String(u._id)));
    }, [matches, currentUserId, teamMemberIds, invitedIds]);

    const invite = async (userId) => {
        try {
            await teamAPI.inviteUser(team._id, userId);
            setInvitedIds(prev => new Set([...prev, String(userId)]));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send invite');
        }
    };

    return (
        <div className="invite-modal-backdrop">
            <div className="invite-modal">

                <div className="invite-modal-header">
                    <h3>Invite matched users</h3>
                    <button className="invite-close" onClick={onClose}>✕</button>
                </div>

                <div className="invite-modal-body">
                    {eligibleUsers.length === 0 && (
                        <div className="invite-empty">No eligible users</div>
                    )}

                    {eligibleUsers.map(u => (
                        <div key={u._id} className="invite-user">
                            <img
                                src={getAvatarSrc(u.profileImage)}
                                alt={u.fullName}
                                className="invite-avatar"
                            />

                            <div className="invite-info">
                                <div className="invite-name">{u.fullName}</div>
                            </div>

                            <button
                                className="invite-btn"
                                disabled={!isAdmin}
                                onClick={() => invite(u._id)}
                            >
                                {isAdmin ? 'Invite' : 'Admin only'}
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
