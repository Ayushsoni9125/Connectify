export const getAvatarUrl = (user) => {
  if (user?.profilepic && !user.profilepic.includes("iran.liara.run")) {
    return user.profilepic;
  }
  const isFemale = user?.gender === "female" || user?.gender?.toLowerCase() === "female";
  const seedPrefix = isFemale ? "Lily" : "Jack";
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seedPrefix}-${user?.username || "default"}`;
};
