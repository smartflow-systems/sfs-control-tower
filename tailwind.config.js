/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sfs-black': '#0D0D0D',
        'sfs-brown': '#3B2F2F',
        'sfs-gold': '#FFD700',
        'sfs-gold-hover': '#E6C200',
        'sfs-beige': '#F5F5DC',
      }
    },
  },
  plugins: [],
}
