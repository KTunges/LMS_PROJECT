const { Badge, UserBadge } = require('../../models');

exports.getAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const allBadges = await Badge.findAll();
    const userBadges = await UserBadge.findAll({
      where: { user_id: userId }
    });

    const userBadgeIds = userBadges.map(ub => ub.badge_id);

    const formattedBadges = allBadges.map(badge => {
      const isUnlocked = userBadgeIds.includes(badge.id);
      return {
        id: badge.id,
        title: badge.name,
        description: badge.description,
        icon: badge.icon_url || 'award', // default icon name for UI
        category: badge.condition_type === 'XP' ? 'learning' : 'special',
        unlocked: isUnlocked,
        date: isUnlocked ? userBadges.find(ub => ub.badge_id === badge.id).created_at : null
      };
    });

    res.json(formattedBadges);
  } catch (error) {
    next(error);
  }
};
