"use client";
import React from "react";
import { useIsMobile } from "breakpoint-hooks";

type Props = {
  pdf_url: string;
};

const PDFViewer = ({ pdf_url }: Props) => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <iframe
          src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
          className="w-full h-full"
        ></iframe>
      )}
    </>
  );
};

export default PDFViewer;
