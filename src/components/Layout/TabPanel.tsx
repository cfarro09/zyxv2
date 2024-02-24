import { Box } from '@mui/material';
import * as React from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        style={{ display: value === index ? undefined : "none" }}
        {...other}
    >
        <Box sx={{ p: 3, pt: 1 }}>
            {children}
        </Box>
    </div>
)

export default TabPanel;