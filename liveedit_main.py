from fastapi import FastAPI, Request, BackgroundTasks
from pydantic import BaseModel
import subprocess
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import threading

app = FastAPI()

# Mount StaticFiles at '/static'
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve the index.html at the root path
@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

# Global variables to manage recording
recording_process = None
recording_lock = threading.Lock()
recording_file = "live_stream_recording.ts"
current_stream_url = None

class StreamURL(BaseModel):
    stream_url: str

class RenderRequest(BaseModel):
    startTime: float
    endTime: float

@app.post("/api/start_recording")
async def start_recording(stream: StreamURL):
    global recording_process, current_stream_url

    with recording_lock:
        # If a recording is already in progress, terminate it
        if recording_process and recording_process.poll() is None:
            recording_process.terminate()
            recording_process = None
            if os.path.exists(recording_file):
                os.remove(recording_file)

        current_stream_url = stream.stream_url

        # Start recording the live stream using FFmpeg
        command = [
            'ffmpeg',
            '-y',  # Overwrite output file if it exists
            '-i', current_stream_url,
            '-c', 'copy',  # Copy codec to avoid re-encoding
            '-t', "3600",
            '-f', 'mpegts',
            recording_file
        ]

        # Start the recording process
        recording_process = subprocess.Popen(command)

    return {"message": "Recording started for stream URL."}

@app.post("/api/stop_recording")
async def stop_recording():
    global recording_process, recording_file

    with recording_lock:
        if recording_process and recording_process.poll() is None:
            recording_process.terminate()
            recording_process = None

            # Delete the recording file
            if os.path.exists(recording_file):
                os.remove(recording_file)

            return {"message": "Recording stopped and file deleted."}
        else:
            # Delete the recording file if it exists
            if os.path.exists(recording_file):
                os.remove(recording_file)
            return {"message": "No active recording to stop. Recording file deleted if it existed."}

@app.post("/api/render")
async def render_video(request: RenderRequest, background_tasks: BackgroundTasks):
    global recording_file

    # Check if the recording file exists
    if not os.path.exists(recording_file):
        return {"message": "Recording file not found. Please start the stream first."}

    output_video = f"output_{request.startTime}_{request.endTime}.mp4"
    output_path = os.path.join("outputs", output_video)

    # Ensure the outputs directory exists
    os.makedirs("outputs", exist_ok=True)

    # Run FFmpeg command in the background
    background_tasks.add_task(run_ffmpeg, recording_file, output_path, request.startTime, request.endTime)

    # Construct the URL to the output file
    output_url = f"/outputs/{output_video}"

    return {"message": "Video processing started.", "output_url": output_url}

def run_ffmpeg(input_video, output_video, start_time, end_time):
    # FFmpeg command to trim video
    command = [
        'ffmpeg',
        '-y',  # Overwrite output file if it exists
        '-i', input_video,
        '-ss', str(start_time),
        '-to', str(end_time),
        '-c', 'copy',  # Use 'copy' to avoid re-encoding
        output_video
    ]

    subprocess.run(command, check=True)

# Serve the outputs directory
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=48080)
    