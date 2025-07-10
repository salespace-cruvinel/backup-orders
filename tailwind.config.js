export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#1E40AF',      // Azul escuro
        'brand-secondary': '#3B82F6',    // Azul claro
        'brand-light': '#DBEAFE',        // Azul bem claro
        'status-approved': '#16A34A',    // Verde
        'status-pending': '#F97316',     // Laranja
        'status-reproved': '#DC2626',    // Vermelho
      },
    },
  },
  plugins: [],
}