import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import Scream from "../components/Scream";
import Axios from "axios";

export const Home = () => {
  const [screams, setScreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get("/screams")
      .then(({data}) => data)
      .then(setScreams)
      .then(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item sm={8} xs={12}>
        {!loading ? (
          screams.map((s) => <Scream scream={s} key={s.screamId} />)
        ) : (
          <p>Loading...</p>
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile</p>
      </Grid>
    </Grid>
  );
};
