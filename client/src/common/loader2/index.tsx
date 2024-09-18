import React from 'react';

interface Loader2Props {
    height: string;
}

const Loader2: React.FC<Loader2Props> = ({ height }) => {
    return (
        <div className="flex items-center justify-center bg-white" style={{ height }}>
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
};

export default Loader2;
  