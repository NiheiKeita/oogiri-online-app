import { CallView } from "@/views/CallView";
import React from "react";

const CountPage = React.memo(() => {
  return <CallView />;
});

export default CountPage;
CountPage.displayName = "CallView";
