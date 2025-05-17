import React from "react";

const WorkoutSessions = () => {
  return (
    <section className="workout_session" id="workout">
      <div className="wrapper">
        <h1>TOP WORKOUT SESSION</h1>
        <p>
          "Success usually comes to those who are too busy to be looking for it." – Henry David Thoreau
        </p>
        <img src="/img5.jpg" alt="workout" />
      </div>
      <div className="wrapper">
        <h1>FEATURED BOOTCAMPS</h1>
        <p>
          "The only bad workout is the one that didn’t happen."
        </p>
        <div className="bootcamps">
          <div>
            <h4>"Push yourself because no one else is going to do it for you."</h4>
            <p>
              You don’t have to be extreme, just consistent.
            </p>
          </div>
          <div>
            <h4>"Fitness is not about being better than someone else… it’s about being better than you used to be."</h4>
            <p>
              Make time for it. Just get it done. Nobody ever got strong or in shape by thinking about it.
            </p>
          </div>
          <div>
            <h4>"Train insane or remain the same."</h4>
            <p>
              Your body can stand almost anything. It’s your mind that you have to convince.
            </p>
          </div>
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

export default WorkoutSessions;
