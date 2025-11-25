// Main JavaScript Entry Point
// Vite processes this file and handles CSS imports

// Import Tailwind CSS
import '../css/main.css';

// Initialize Lucide Icons after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

// Log for development
if (import.meta.env.DEV) {
  console.log('[Dev] Vite + Tailwind v4 + Alpine.js loaded');
}
