import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build', // Cambia 'dist' por el nombre de la carpeta que quieras
    // otras opciones de compilación...
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin({
    svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
    include: '**/*.svg',
  })],
})
