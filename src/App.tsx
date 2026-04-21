import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Settings from './pages/Settings.tsx';
import History from './pages/History.tsx';
import Models from './pages/Models.tsx';
import Stats from './pages/Stats.tsx';
import EmailMaster from './pages/EmailMaster.tsx';
import MeetingNotesExpert from './pages/MeetingNotesExpert.tsx';
import ReportGenerator from './pages/ReportGenerator.tsx';
import PPTOutline from './pages/PPTOutline.tsx';
import DataAnalyst from './pages/DataAnalyst.tsx';
import TaskManagement from './pages/TaskManagement.tsx';
import CustomSkills from './pages/CustomSkills.tsx';
import RecruitmentAssistant from './pages/RecruitmentAssistant.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';

function App() {
  return (
    <OfflineProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
              <Route path="/models" element={<Models />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/custom-skills" element={<CustomSkills />} />
              <Route path="/skill/email-master" element={<EmailMaster />} />
              <Route path="/skill/meeting-notes-expert" element={<MeetingNotesExpert />} />
              <Route path="/skill/report-generator" element={<ReportGenerator />} />
              <Route path="/skill/ppt-outline" element={<PPTOutline />} />
              <Route path="/skill/data-analyst" element={<DataAnalyst />} />
              <Route path="/skill/task-management" element={<TaskManagement />} />
              <Route path="/skill/recruitment-assistant" element={<RecruitmentAssistant />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </OfflineProvider>
  );
}

export default App
