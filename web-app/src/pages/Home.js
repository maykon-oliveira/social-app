import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";

export const Home = () => {
  const [screams, setScreams] = useState([]);

  useEffect(() => {
    fetch("/screams")
      .then((e) => e.json())
      .then(setScreams);
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item sm={8} xs={12}>
        {screams && screams.map((s) => <Scream scream={s} key={s.screamId} />)}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile</p>
      </Grid>
    </Grid>
  );
};
