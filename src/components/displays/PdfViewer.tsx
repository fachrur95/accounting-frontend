import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "@/utils/workers/pdf.worker";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Download from "@mui/icons-material/Download";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker as string;

interface PdfViewer {
  pathURL: string;
}

const PdfViewer = ({ pathURL }: PdfViewer) => {
  const [numPages, setNumPages] = useState<number>(1);
  // const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    void setNumPages(numPages);
  };

  return (
    <Box className="flex flex-col items-center gap-2 overflow-auto">
      <Box className="self-end">
        <Link href={pathURL} download>
          <IconButton>
            <Download />
          </IconButton>
        </Link>
      </Box>
      <Box className="flex-grow overflow-auto">
        <Document
          file={pathURL}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex h-full w-full flex-wrap items-center justify-center gap-2"
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </Box>
    </Box>
  );
};

export default PdfViewer;
