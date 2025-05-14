from pymongo import MongoClient
from langchain_community.document_loaders import PDFPlumberLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
import re
import os
from dotenv import load_dotenv
load_dotenv()

# === Config ===
PDF_PATH='medical_book1.pdf'
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# === Embeddings + MongoDB ===
client = MongoClient(MONGO_URI)
collection = client[DB_NAME][COLLECTION_NAME]

model_name = "sentence-transformers/all-mpnet-base-v2"
embedder = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}
)

# === Index PDF once ===
def index_pdf_if_needed():
    print(f"📄 Checking PDF at path: {os.path.abspath(PDF_PATH)}")
    assert os.path.exists(PDF_PATH), "❌ PDF file not found at the specified path"

    if collection.count_documents({}) == 0:
        loader = PDFPlumberLoader(PDF_PATH)
        docs = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        documents = splitter.split_documents(docs)

        print(f"📄 Loaded {len(documents)} chunks from PDF, indexing to MongoDB...")

        MongoDBAtlasVectorSearch.from_documents(
            documents,
            embedding=embedder,
            collection=collection
        )
        print("✅ PDF indexed to MongoDB")
    else:
        print("ℹ️ Index already exists.")

# === LLM + Prompt Setup ===
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    temperature=0,
    model_name="deepseek-r1-distill-llama-70b"
)

prompt_template = """
1. Use the following piece of context to answer the question at the end.
2. If you don't know the answer, just say "I don't know", but don't make up an answer.
3. Keep the answer crisp and limited to 3-4 sentences.

Context: {context}
Question: {question}
Helpful Answer:
"""

QA_CHAIN_PROMPT = PromptTemplate.from_template(prompt_template)
llm_chain = LLMChain(llm=llm, prompt=QA_CHAIN_PROMPT)

document_prompt = PromptTemplate(
    input_variables=["page_content", "source"],
    template="Context:\nContent: {page_content}\nSource: {source}"
)

combine_documents_chain = StuffDocumentsChain(
    llm_chain=llm_chain,
    document_variable_name="context",
    document_prompt=document_prompt
)

# === Query Function ===
def get_answer(question: str) -> str:
    retriever = MongoDBAtlasVectorSearch(
        embedding=embedder,
        collection=collection
    ).as_retriever(search_type="similarity", search_kwargs={"k": 3})

    qa = RetrievalQA(
        retriever=retriever,
        combine_documents_chain=combine_documents_chain,
        return_source_documents=True
    )

    result = qa.invoke({"query": question})
    cleaned_answer = re.sub(r"<think>.*?</think>\s*", "", result["result"], flags=re.DOTALL)
    return cleaned_answer
