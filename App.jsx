import './global.css';
import React from 'react';
import AppNavigation from './navigation';

export default function App() {
  // ── Bug: apiCall was being called on mount with no messages
  // Removed — apiCall should only be triggered from HomeScreen by user voice input
  return <AppNavigation />;
}
