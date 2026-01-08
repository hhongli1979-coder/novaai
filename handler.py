from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class InputData(BaseModel):
    text: str
    language: str


class OutputData(BaseModel):
    status: str
    message: str
    input_text: str
    input_language: str


@app.post("/")
async def process_input(data: InputData) -> OutputData:
    """
    Process incoming requests with text and language fields.
    Returns a JSON response with status and other information.
    """
    return OutputData(
        status="success",
        message="Request processed successfully",
        input_text=data.text,
        input_language=data.language
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
