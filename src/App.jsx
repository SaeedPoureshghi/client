import "./App.css";
import { useRoutes } from "react-router-dom";
import { mainroutes } from "./routes/routes";


function App() {
  const MainRoutes = useRoutes(mainroutes);

  return <div>{MainRoutes}</div>
  
 
}

export default App;
