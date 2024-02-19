import type { SxProps } from "@mui/material";

export interface ObjectZyx {
    [key: string]: string | number | boolean | null;
}

export interface IMainProps {
    baseUrl: string;
}

export interface IClasses {
    [key: string]: SxProps;
}

export interface IStylesProps {
    [key:string]: React.CSSProperties;
}