import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: {
      typeset: () => void;
    };
  }
}

interface MathJaxRenderProps {
  latex: string;
}

const MathJaxRender: React.FC<MathJaxRenderProps> = ({ latex }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
  }, [latex]);

  return (
    <div ref={containerRef}>
      {latex}
    </div>
  );
};

export default MathJaxRender;
