import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
// import { convertToAscii } from "./utils";

export const getPineconeClient = async () =>
  new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // Obtain PDF -> download and read from PDF
  console.log("Downloading S3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download PDF from S3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  //   Split and segment the pdf into documents
  const documents = await Promise.all(pages.map(prepareDocument));

  //   Vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // Upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.index("chatpdf");

  console.log("Inserting vectors into pinecone");
  // TODO: Convert to aws-starter project through the aws market place to
  // utilise namespaces
  // const nameSpace = pineconeIndex.namespace(convertToAscii(fileKey));
  await pineconeIndex.upsert(vectors);
  console.log("finished upserting into pinecone");

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
