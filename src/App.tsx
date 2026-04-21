import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'
import Home from './pages/Home'
import Settings from './pages/Settings'
import History from './pages/History'
import Models from './pages/Models'
import Stats from './pages/Stats'
import EmailMaster from './pages/EmailMaster'
import MeetingNotesExpert from './pages/MeetingNotesExpert'
import ReportGenerator from './pages/ReportGenerator'
import PPTOutline from './pages/PPTOutline'
import DataAnalyst from './pages/DataAnalyst'
import TaskManagement from './pages/TaskManagement'
import CustomSkills from './pages/CustomSkills'
import RecruitmentAssistant from './pages/RecruitmentAssistant'
import { ThemeProvider } from './contexts/ThemeContext'
import { OfflineProvider } from './contexts/OfflineContext'

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
