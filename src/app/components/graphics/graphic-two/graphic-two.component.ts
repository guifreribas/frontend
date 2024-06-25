import {
  Component,
  effect,
  ElementRef,
  Input,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { Graphic } from '../../../models/graphic';

@Component({
  selector: 'app-graphic-two',
  standalone: true,
  imports: [],
  templateUrl: './graphic-two.component.html',
  styleUrls: ['./graphic-two.component.scss'],
})
export class GraphicTwoComponent {
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

  createChart(graphic: Graphic) {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.myChart.nativeElement, {
      type: graphic.type as keyof ChartTypeRegistry,
      data: {
        labels: graphic.data.labels,
        datasets:
          graphic.data.datasets?.map((dataset: any) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
            borderWidth: dataset.borderWidth,
          })) || [],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutBounce',
        },
      },
    });
  }
}
