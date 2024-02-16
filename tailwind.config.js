/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    important: '#root',
    theme: {
        extend: {
            colors: {
                'light-grey': '#f1f1f2',
                'dark-grey': '#2e2c34',
                'grey': '#a8aaae',
            },
        },
    },
    plugins: [],
};
