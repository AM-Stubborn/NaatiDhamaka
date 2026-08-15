import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { PRESENCE, presenceCountUrl } from '../constants/radio.constants';

interface CounterApiResponse {
  value?: number;
}

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private readonly destroyRef = inject(DestroyRef);
  private started = false;
  private heartbeatId = 0;

  readonly listeners = signal<number | null>(null);

  start(): void {
    if (this.started || typeof window === 'undefined') {
      return;
    }

    this.started = true;
    void this.sync();
    this.heartbeatId = window.setInterval(() => void this.sync(), PRESENCE.heartbeatMs);
    this.destroyRef.onDestroy(() => this.stop());
  }

  stop(): void {
    if (this.heartbeatId) {
      window.clearInterval(this.heartbeatId);
      this.heartbeatId = 0;
    }
    this.started = false;
  }

  private async sync(): Promise<void> {
    try {
      const value = await this.readCount();
      this.listeners.set(Math.max(1, value));
    } catch {
      if (this.listeners() === null) {
        this.listeners.set(1);
      }
    }
  }

  private async readCount(): Promise<number> {
    try {
      return await this.fetchCount();
    } catch {
      return this.jsonpCount();
    }
  }

  private async fetchCount(): Promise<number> {
    if (typeof fetch !== 'function') {
      throw new Error('Fetch is not available');
    }

    const response = await fetch(presenceCountUrl(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      throw new Error(`Presence request failed: ${response.status}`);
    }

    return this.parseCount((await response.json()) as CounterApiResponse);
  }

  private jsonpCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const callback = `ndPresence${Date.now()}`;
      const script = document.createElement('script');
      let settled = false;

      const finish = (action: () => void) => {
        if (settled) {
          return;
        }
        settled = true;
        window.clearTimeout(timer);
        script.remove();
        delete (window as unknown as Record<string, unknown>)[callback];
        action();
      };

      const timer = window.setTimeout(() => {
        finish(() => reject(new Error('Presence JSONP timed out')));
      }, 8000);

      (window as unknown as Record<string, unknown>)[callback] = (payload: CounterApiResponse) => {
        finish(() => {
          try {
            resolve(this.parseCount(payload));
          } catch (error) {
            reject(error);
          }
        });
      };

      script.src = `${presenceCountUrl()}&callback=${encodeURIComponent(callback)}`;
      script.onerror = () => finish(() => reject(new Error('Presence JSONP failed')));
      document.body.appendChild(script);
    });
  }

  private parseCount(payload: CounterApiResponse): number {
    const value = Number(payload.value);
    if (!Number.isFinite(value)) {
      throw new Error('Presence payload missing a count');
    }

    return Math.round(value);
  }
}
