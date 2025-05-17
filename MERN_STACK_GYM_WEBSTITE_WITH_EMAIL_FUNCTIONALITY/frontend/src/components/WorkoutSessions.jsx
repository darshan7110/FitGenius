import React from "react";

// Component to display motivational workout sessions and featured bootcamps
const WorkoutSessions = () => {
  return (
    // Main section with ID for in-page navigation
    <section className="workout_session" id="workout">
      
      {/* First wrapper block - top workout session */}
      <div className="wrapper">
        {/* Section title */}
        <h1>TOP WORKOUT SESSION</h1>

        {/* Motivational quote */}
        <p>
          "Success usually comes to those who are too busy to be looking for it." – Henry David Thoreau
        </p>

        {/* Workout related image */}
        <img src="/img5.jpg" alt="workout" />
      </div>

      {/* Second wrapper block - featured bootcamps */}
      <div className="wrapper">
        {/* Subsection title */}
        <h1>FEATURED BOOTCAMPS</h1>

        {/* Motivational quote */}
        <p>
          "The only bad workout is the one that didn’t happen."
        </p>

        {/* List of motivational bootcamp blocks */}
        <div className="bootcamps">
          
          {/* Bootcamp 1 */}
          <div>
            <h4>"Push yourself because no one else is going to do it for you."</h4>
            <p>
              You don’t have to be extreme, just consistent.
            </p>
          </div>

          {/* Bootcamp 2 */}
          <div>
            <h4>"Fitness is not about being better than someone else… it’s about being better than you used to be."</h4>
            <p>
              Make time for it. Just get it done. Nobody ever got strong or in shape by thinking about it.
            </p>
          </div>

          {/* Bootcamp 3 */}
          <div>
            <h4>"Train insane or remain the same."</h4>
            <p>
              Your body can stand almost anything. It’s your mind that you have to convince.
            </p>
          </div>

          {/* Bootcamp 4 */}
          <div>
            <h4>"The pain you feel today will be the strength you feel tomorrow."</h4>
            <p>
              Don't count the days. Make the days count.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Exporting component so it can be used in the main app
export default WorkoutSessions;
