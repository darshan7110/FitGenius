const parseAIPlan = (text) => {
  const dietSection = text.split("Diet:")[1]?.split("Workout:")[0]?.trim();
  const workoutSection = text.split("Workout:")[1]?.split("Goal Summary:")[0]?.trim();
  const goalText = text.split("Goal Summary:")[1]?.trim();

  const parseDays = (section) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const result = {};
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const nextDay = days[i + 1];
      const regex = new RegExp(`${day}:([\\s\\S]*?)${nextDay ? nextDay + ":" : "$"}`, "i");
      const match = section.match(regex);
      if (match) {
        result[day] = match[1].trim().split(/[\n•-]/).map(line => line.trim()).filter(Boolean);
      }
    }
    return result;
  };

  return {
    dietSchedule: parseDays(dietSection),
    workoutSchedule: parseDays(workoutSection),
    goalText: goalText || "Stay consistent with the plan and track progress weekly."
  };
};

export default parseAIPlan;
