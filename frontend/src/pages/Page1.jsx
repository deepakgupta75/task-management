import React, { useState } from "react";
import Permit from "../components/permit";

const Page1 = ({ setUser }) => {
  return (
    <div>
      <Permit setUser={setUser} />
    </div>
  );
};

export default Page1;
