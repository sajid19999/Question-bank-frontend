import { Component, AfterViewInit, HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true
})
export class HomepageComponent implements AfterViewInit {
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private lines: { frequency: number; amplitude: number; phase: number; verticalOffset: number }[] = [];
  private lineCount = 10;
  private waveHeight = 30;
  private waveWidth = 1200;
  private speed = 0.005;
  private animationProgress = 3;

  private waveConfig = {
    verticalOffset: 200,
    verticalSpread: 100,
    centeringFactor: 0.5,
    setVerticalPosition: (offset: number) => {
      this.waveConfig.verticalOffset = offset;
    }
  };

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('waveCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    if (!this.ctx) {
      console.error('Canvas rendering context is null');
      return;
    }

    this.resizeCanvas();
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeCanvas();
  }

  private initializeWaves(): void {
    this.lines = [];
    for (let i = 0; i < this.lineCount; i++) {
      const baseVerticalOffset =
        (i - (this.lineCount - 1) * this.waveConfig.centeringFactor) * this.waveConfig.verticalSpread;
      this.lines.push({
        frequency: 0.015 + i * 0.005,
        amplitude: this.waveHeight - i * 10,
        phase: (i * Math.PI) / 200,
        verticalOffset: baseVerticalOffset + this.waveConfig.verticalOffset
      });
    }
  }

  private animate(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.animationProgress += this.speed;

    this.lines.forEach((line, index) => {
      const gradient = this.ctx!.createLinearGradient(0, 0, this.waveWidth, 0);
      gradient.addColorStop(0, `rgba(138, 103, 187, ${0.7 - index * 0.1})`);
      gradient.addColorStop(1, `rgba(138, 103, 187, ${0.1 - index * 0.03})`);

      this.ctx!.beginPath();
      this.ctx!.lineWidth = 1.5;
      this.ctx!.strokeStyle = gradient;

      for (let x = 0; x <= this.waveWidth; x += 2) {
        const mergeMultiplier = 1 - (x / this.waveWidth) * 0.8;
        const yOffset = line.verticalOffset * mergeMultiplier * (x / this.waveWidth);
        const y =
          this.canvas.height / 2 +
          yOffset +
          Math.sin(x * line.frequency + this.animationProgress + line.phase) *
            (line.amplitude * mergeMultiplier);

        x === 0 ? this.ctx!.moveTo(x, y) : this.ctx!.lineTo(x, y);
      }
      this.ctx!.stroke();
    });

    requestAnimationFrame(() => this.animate());
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initializeWaves();
  }
 
  
}
