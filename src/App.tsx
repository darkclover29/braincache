import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import StudyHome from './pages/StudyHome'
import Domain from './pages/Domain'
import Section from './pages/Section'
import PageView from './pages/PageView'
import SearchPage from './pages/SearchPage'
import InterviewHome from './pages/interview/InterviewHome'
import InterviewSection from './pages/interview/InterviewSection'
import InterviewPage from './pages/interview/InterviewPage'
import InterviewFrontendSub from "./pages/interview/InterviewFrontendSub";

export default function App(){
  return (
    <Layout>
      <Routes>
        {/* Study Areas */}
        <Route path="/" element={<Home/>} />
        <Route path="/study" element={<StudyHome/>} />
        <Route path="/domain/:domainId" element={<Domain/>} />
        <Route path="/domain/:domainId/section/:sectionId" element={<Section/>} />
        <Route path="/domain/:domainId/section/:sectionId/page/:pageId" element={<PageView/>} />

        {/* Search */}
        <Route path="/search" element={<SearchPage/>} />

        {/* Interview Prep (Markdown-driven) */}
        
        <Route path="/interview" element={<InterviewHome/>} />
<Route path="/interview/section/:sectionId" element={<InterviewSection/>} />
<Route path="/interview/section/frontend/sub/:subId" element={<InterviewFrontendSub/>} />
     <Route path="/interview/section/:sectionId/topic/:topicId" element={<InterviewPage/>} />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
