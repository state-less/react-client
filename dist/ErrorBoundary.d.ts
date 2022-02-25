import React from 'react';
export declare class ErrorBoundary extends React.Component {
    state: {
        hasError: boolean;
    };
    constructor(props: any);
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    render(): React.ReactNode;
}
