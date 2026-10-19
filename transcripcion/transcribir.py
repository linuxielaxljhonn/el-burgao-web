# Transcribe transcripcion/voz.ogg con Whisper (faster-whisper) en el runner de GitHub.
from faster_whisper import WhisperModel
m = WhisperModel("medium", device="cpu", compute_type="int8")
segs, info = m.transcribe("transcripcion/voz.ogg", language="es", beam_size=5, vad_filter=True)
texto = "\n".join(s.text.strip() for s in segs)
open("transcripcion/texto.txt", "w", encoding="utf-8").write(texto + "\n")
print(texto)
