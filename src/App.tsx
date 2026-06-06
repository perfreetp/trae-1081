import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Farmlands from "@/pages/Farmlands";
import Appointments from "@/pages/Appointments";
import Surveying from "@/pages/Surveying";
import Pesticides from "@/pages/Pesticides";
import Scheduling from "@/pages/Scheduling";
import Operations from "@/pages/Operations";
import Billing from "@/pages/Billing";
import Evaluation from "@/pages/Evaluation";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmlands" element={<Farmlands />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/surveying" element={<Surveying />} />
          <Route path="/pesticides" element={<Pesticides />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/evaluation" element={<Evaluation />} />
        </Route>
      </Routes>
    </Router>
  );
}
