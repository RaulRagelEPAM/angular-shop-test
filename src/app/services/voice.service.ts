import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SttCloudService } from './stt-cloud.service';
import { UtilsService } from './utils.service';

declare var webkitSpeechRecognition: any;
declare var tizen: any;
declare var webOS: any;

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private transcriptSubject = new BehaviorSubject<string>('');
  transcript$ = this.transcriptSubject.asObservable();
  private recordingSubject = new BehaviorSubject<boolean>(false);
  recording$ = this.recordingSubject.asObservable();

  private platform = this.utils.detectPlatform();

  /**
   * Si está en true, se emitirá texto parcial mientras el usuario habla.
   * Si está en false, solo se emitirá al final de la frase.
   */
  public enablePartialTranscription = true;

  constructor(
    private sttCloud: SttCloudService,
    private utils: UtilsService,
    private ngZone: NgZone
  ) {}

  private emitTranscript(text: string) {
    // Garantizamos que todas las actualizaciones de voz se ejecuten dentro
    // del ciclo de detección de cambios de Angular
    // Es necesario porque usando APIs externas (como webkitSpeechRecognition) se disparan los eventos desde fuera
    // de la zona de angular, por lo que angular no se entera
    this.ngZone.run(() => {
      this.transcriptSubject.next(text); // sin ngZone, angular no detecta este cambio
    });
  }

  startListening() {
    switch (this.platform) {
      case 'WEB':
        this.startWebRecognition();
        break;
      case 'TIZEN':
        this.startTizenRecognition();
        break;
      case 'WEBOS':
        this.startWebOSRecognition();
        break;
      default:
        console.warn('Plataforma no soportada, usando Cloud STT');
        this.startCloudRecognition();
    }
  }

  // WEB
  private startWebRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.interimResults = this.enablePartialTranscription; // control por flag
      recognition.maxAlternatives = 1;

      recognition.start();
      
      recognition.onaudiostart = () => {
        this.ngZone.run(() => {
          this.recordingSubject.next(true)
        });
      };
      recognition.onaudioend = () => {
        this.ngZone.run(() => {
          this.recordingSubject.next(false)
        });
      };

      recognition.onresult = (event: any) => {
        if (this.enablePartialTranscription) {
          // concatenar todas las partes reconocidas
          let interimTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            interimTranscript += result[0].transcript;
            // si es resultado final, también lo enviamos como definitivo
            if (result.isFinal) {
              this.emitTranscript(interimTranscript.trim());
              interimTranscript = '';
            } else {
              this.emitTranscript(interimTranscript.trim());
            }
          }
        } else {
          // modo clásico: solo texto final
          const text = event.results[0][0].transcript;
          this.emitTranscript(text);
        }
      };

      recognition.onerror = (err: any) => {
        console.error('Error Web Speech:', err);
        this.startCloudRecognition();
      };
    } else {
      console.warn('Web Speech API no disponible. Usando Cloud STT.');
      this.startCloudRecognition();
    }
  }

  // SAMSUNG TIZEN
  private startTizenRecognition() {
    try {
      const sr = tizen.speechrecognition;
      // Nota: API Tizen no soporta modo parcial nativo (no podemos usar enablePartialTranscription)
      sr.start('es-ES', (result: any) => {
        const text = result[0].utterance;
        this.emitTranscript(text);
      });
    } catch (e) {
      console.error('Error Tizen Speech:', e);
      this.startCloudRecognition();
    }
  }

  // LG webOS
  private startWebOSRecognition() {
    try {
      webOS.service.request('luna://com.webos.service.speech', {
        method: 'startRecognition',
        parameters: { language: 'es-ES' },
        onSuccess: (res: any) => {
          const text = res.transcript || '';
          this.emitTranscript(text);
        },
        onFailure: (err: any) => {
          console.error('Error webOS Speech:', err);
          this.startCloudRecognition();
        }
      });
    } catch (e) {
      console.error('Error webOS Speech API:', e);
      this.startCloudRecognition();
    }
  }

  // CLOUD FALLBACK
  private startCloudRecognition() {
    // Nota: aquí se podría implementar transcripción parcial con websockets
    // y un proveedor que soporte streaming.
    this.sttCloud.recordAndSend()
      .then(text => this.emitTranscript(text))
      .catch(err => console.error('Error Cloud STT:', err));
  }
}

/*

* APIs de reconocimiento de voz:

  Web -> Web Speech API (window.webkitSpeechRecognition)
  Tizen -> tizen.speechrecognition
  webOS -> webOS.service.request > luna://com.webos.service.speech

* Si no está disponible o falla -> Fallback a Cloud STT (Google, Azure, AWS).

  En caso de que algo falle en cualquier plataforma:

  startCloudRecognition
    > recordAndSend
      (si existe MediaRecorder) > recordWithMediaRecorder > new MediaRecorder
      (si no) > recordWithWebAudio > (se crea el audio para mandarlo a nuestro backend en la nube)
        > sendToBackend
         !! requiere:
          Node.js + Express
          Multer para manejar el upload
          Google Cloud Speech-to-Text
          Configuración para audio/webm con Opus (lo que produce el MediaRecorder)
          Configurar un backend en la nube y tenerlo corriendo
            Tener un proyecto en Google Cloud Console.
            Activar la API Speech-to-Text.
            Crear una Service Account con permisos para Cloud Speech.
            Descargar el archivo JSON de credenciales.
            Exportar la variable de entorno en tu terminal:
*/