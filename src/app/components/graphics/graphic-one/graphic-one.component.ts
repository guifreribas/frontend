import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { Graphic } from '../../../models/graphic';
import { GraphicsService } from '../../../services/graphics.service';

@Component({
  selector: 'app-graphic-one',
  standalone: true,
  imports: [],
  templateUrl: './graphic-one.component.html',
  styleUrls: ['./graphic-one.component.scss'],
})
export class GraphicOneComponent {
  @Input() public graphic!: WritableSignal<Graphic | null>;
  @ViewChild('myChart') myChart!: ElementRef;
  chart: any;

  constructor() {
    Chart.register(...registerables);

    effect(() => {
      const graphicValue = this.graphic();
      if (graphicValue) {
        this.createChart(graphicValue);
      }
    });
  }

  createChart(graphic: any) {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.myChart.nativeElement, {
      type: graphic?.type as keyof ChartTypeRegistry,
      data: {
        labels: graphic?.data.labels,
        datasets:
          graphic?.data.datasets?.map((dataset: any) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
            borderWidth: dataset.borderWidth,
          })) || [],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
