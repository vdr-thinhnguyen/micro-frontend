import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled, { keyframes, css } from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { IPdfViewer } from '@ui-lib/types';
import { Button } from '@ui-lib/components';
import { Spin } from 'antd';
import { ArrowUpOutlined as ArrowUp } from '@ant-design/icons';
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const rtlAnimation = keyframes`
    0% {
       transform: translateX(100%);
    }
    
    100% {
        transform: translateX(0%);
    }
`;

const ltrAnimation = keyframes`
    0% {
       transform: translateX(-100%);
    }
    
    100% {
        transform: translateX(0%);
    }
`;

const PDFContent = styled.div<{ rlt: boolean }>`
  max-width: 1000px;
  margin: 0 auto;

  .react-pdf__Document {
    width: 100%;
    height: 90vh;
    overflow-y: auto;

    canvas {
      margin: 0 auto;
      width: 100% !important;
      height: auto !important;
    }

    .react-pdf__Page {
      -webkit-animation: ${({ rlt }) => (rlt ? rtlAnimation : ltrAnimation)}
        0.5s forwards;
      animation: ${({ rlt }) => (rlt ? rtlAnimation : ltrAnimation)} 0.5s
        forwards;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;

const PageIndex = styled.p`
  font-size: 0.75rem;
  line-height: 1.25rem;
`;

const PaginationWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10vh;
  background-image: linear-gradient(#ddd, #fff);
`;

const ScrollToTop = styled.div`
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 12vh;
  right: 15vh;
  cursor: pointer;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  span {
    font-size: 12px;
    display: block;
  }
`;

const Loading = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Resume: React.FC<IPdfViewer> = ({ url }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState();
  const [rtl, setRtl] = useState<boolean>(true);
  const [showSrcollToTop, setShowScrollToTop] = useState<boolean>(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onNext = () => {
    !rtl && setRtl(true);
    setPageNumber(pageNumber + 1);
  };

  const onPrev = () => {
    rtl && setRtl(false);
    setPageNumber(pageNumber - 1);
  };

  const onScrollToTop = () => {
    document
      .querySelector('.react-pdf__Document')
      ?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const ele = document.querySelector('.react-pdf__Document');
    if (ele && ele.scrollTop > 150) {
      setShowScrollToTop(true);
      return;
    } else {
      setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    if (url) {
      document
        .querySelector('.react-pdf__Document')
        ?.addEventListener('scroll', handleScroll);
      axios
        .get(url, {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/pdf',
          },
        })
        .then((data) => {
          setFile(data as any);
        });
    }
    return () =>
      document
        .querySelector('.react-pdf__Document')
        ?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {file && (
        <PDFContent rlt={rtl}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Loading>
                <Spin size="large" />
              </Loading>
            }
          >
            <Page key={pageNumber} pageNumber={pageNumber} />
          </Document>
          <PaginationWrapper>
            <ButtonWrapper>
              <PageIndex>
                Page {pageNumber} of {numPages}
              </PageIndex>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button onClick={onPrev} disabled={pageNumber === 1}>
                Previous
              </Button>
              <Button onClick={onNext} disabled={pageNumber === numPages}>
                Next
              </Button>
            </ButtonWrapper>
          </PaginationWrapper>
        </PDFContent>
      )}
      {showSrcollToTop && (
        <ScrollToTop onClick={onScrollToTop}>
          <ArrowUp />
          <span>Top</span>
        </ScrollToTop>
      )}
    </div>
  );
};

export default Resume;
