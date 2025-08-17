import { Injectable } from '@angular/core';

declare var MediaRecorder: any;

@Injectable({ providedIn: 'root' })
export class SttCloudService {

  async recordAndSend(): Promise<string> {
    if (typeof MediaRecorder !== 'undefined') {
      return this.recordWithMediaRecorder();
    } else {
      return this.recordWithWebAudio(); // fallback si MediaRecorder no existe
    }
  }

  private async recordWithMediaRecorder(): Promise<string> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      recorder.ondataavailable = (e:any) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const text = await this.sendToBackend(audioBlob);
        resolve(text);
      };

      recorder.onerror = reject;
      recorder.start();
      setTimeout(() => recorder.stop(), 5000);
    });
  }

  private async recordWithWebAudio(): Promise<string> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    const audioData: Float32Array[] = [];

    processor.onaudioprocess = e => {
      const channelData = e.inputBuffer.getChannelData(0);
      audioData.push(new Float32Array(channelData));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        processor.disconnect();
        source.disconnect();

        const wavBlob = this.encodeWAV(audioData, audioContext.sampleRate);
        try {
          const text = await this.sendToBackend(wavBlob);
          resolve(text);
        } catch (err) {
          reject(err);
        }
      }, 5000); // grabar 5s
    });
  }

  private encodeWAV(buffers: Float32Array[], sampleRate: number): Blob {
    const flatBuffer = this.flattenArray(buffers);
    const bufferLength = flatBuffer.length * 2 + 44;
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);

    // Escribir cabecera WAV (PCM 16-bit mono)
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + flatBuffer.length * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, flatBuffer.length * 2, true);

    // Escribir samples
    let offset = 44;
    for (let i = 0; i < flatBuffer.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, flatBuffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  private flattenArray(channelBuffer: Float32Array[]): Float32Array {
    const length = channelBuffer.reduce((acc, cur) => acc + cur.length, 0);
    const result = new Float32Array(length);
    let offset = 0;
    for (const buffer of channelBuffer) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private async sendToBackend(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob);

    const res = await fetch('/api/stt', { method: 'POST', body: formData });
    const data = await res.json();
    return data.transcript;
  }
}