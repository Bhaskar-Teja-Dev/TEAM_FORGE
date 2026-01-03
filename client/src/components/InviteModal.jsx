import { useMemo } from 'react';
import { getAvatarSrc } from '../services/avatar';
import { teamAPI } from '../services/api';
import './InviteModal.css';

export default function InviteModal({ team, matches = [], onClose }) {
    if (!team) return null;

    const teamMemberIds = new Set(
        (team.members || []).map(m => String(m._id))
    );

    // ✅ Extract matched users from conversations
    const eligibleUsers = useMemo(() => {
        return matches
            .map(c =>
                c.participants?.find(p => String(p._id) !== String(team.admin))
            )
            .filter(Boolean)
            .filter(u => !teamMemberIds.has(String(u._id)));
    }, [matches, team]);

    const invite = async (userId) => {
        try {
            await teamAPI.inviteUser(team._id, userId);
            alert('Invite sent');
        } catch (err) {
            alert('Failed to send invite');
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
                                onClick={() => invite(u._id)}
                            >
                                Invite
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
