interface TabPanelProps {
    children?: React.ReactNode; // Contenido del TabPanel
    index: number; // Valor único que identifica el TabPanel
    value: number; // Valor actual activo, para comparar con el index
    // Puedes agregar cualquier otra prop que necesites para tu TabPanel
}

const TabPanel: React.FC<TabPanelProps> = ({children, index, value}) => {
    return (
        <div
            role="tabpanel"
            aria-labelledby={`simple-tab-${index}`}
            style={{ display: value !== index ? 'none' : undefined }} // Esto aplica el estilo 'display: none' cuando no es el tab activo.
        >
            {children}
        </div>
    );
}

export default TabPanel;