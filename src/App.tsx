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

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/study" element={<StudyHome/>} />
        <Route path="/domain/:domainId" element={<Domain/>} />
        <Route path="/domain/:domainId/section/:sectionId" element={<Section/>} />
        <Route path="/domain/:domainId/section/:sectionId/page/:pageId" element={<PageView/>} />
        <Route path="/search" element={<SearchPage/>} />

        <Route path="/interview" element={<InterviewHome/>} />
        <Route path="/interview/section/:sectionId" element={<InterviewSection/>} />
        <Route path="/interview/section/:sectionId/page/:pageId" element={<InterviewPage/>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
