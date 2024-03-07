import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // Obtain PDF -> download and read from PDF
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download PDF from S3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  //   Split and segment the pdf into documents
  const documents = await Promise.all(pages.map(prepareDocument));

  //   Vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // Upload to pinecone
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  const pineconeIndex = await pc.index("chatpdf");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  await namespace.upsert(vectors);

  return documents[0];
}

const embedDocument = async (doc: Document) => {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error("Error embedding documentes", error);
    throw error;
  }
};

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace("/\n/g", "");

  // Split docs
  const splitter = new RecursiveCharacterTextSplitter();
  return await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
}
