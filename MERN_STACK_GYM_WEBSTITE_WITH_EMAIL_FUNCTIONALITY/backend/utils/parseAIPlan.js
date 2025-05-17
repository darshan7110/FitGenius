// ✅ Function to parse AI-generated plan text into structured JSON format
const parseAIPlan = (text) => {
  // 🔍 Extract the 'Diet' section by splitting between "Diet:" and "Workout:"
  const dietSection = text.split("Diet:")[1]?.split("Workout:")[0]?.trim();

  // 🔍 Extract the 'Workout' section by splitting between "Workout:" and "Goal Summary:"
  const workoutSection = text.split("Workout:")[1]?.split("Goal Summary:")[0]?.trim();

  // 🔍 Extract the 'Goal Summary' section after "Goal Summary:"
  const goalText = text.split("Goal Summary:")[1]?.trim();

  // 📅 Helper function to parse daily schedules from a given text block
  const parseDays = (section) => {
    // Define standard weekdays
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const result = {};

    // Loop through days to extract each day's content
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const nextDay = days[i + 1];

      // Use regex to find text between this day and the next (or end of section)
      const regex = new RegExp(`${day}:([\\s\\S]*?)${nextDay ? nextDay + ":" : "$"}`, "i");
      const match = section.match(regex);

      if (match) {
        // Clean and split lines, removing empty strings
        result[day] = match[1]
          .trim()
          .split(/[\n•-]/)               // split by new line, bullet (•), or dash (-)
          .map(line => line.trim())      // trim extra spaces
          .filter(Boolean);              // remove empty lines
      }
    }

    return result; // return structured object for all days
  };

  // ✅ Final return: structured object with parsed diet, workout, and goal text
  return {
    dietSchedule: parseDays(dietSection),
    workoutSchedule: parseDays(workoutSection),
    goalText: goalText || "Stay consistent with the plan and track progress weekly." // fallback goal
  };
};

// ✅ Export this function for use in other parts of the app
export default parseAIPlan;
