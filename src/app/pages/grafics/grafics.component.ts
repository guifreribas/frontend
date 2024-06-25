import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { GraphicOneComponent } from '../../components/graphics/graphic-one/graphic-one.component';
import { GraphicTwoComponent } from '../../components/graphics/graphic-two/graphic-two.component';
import { CommonModule } from '@angular/common';
import { GraphicsService } from '../../services/graphics.service';
import {
  Graphic,
  GraphicAddResponse,
  GraphicResponse,
} from '../../models/graphic';
import { graphicBar, graphicLine } from './grafics';

@Component({
  selector: 'app-grafics',
  standalone: true,
  imports: [GraphicOneComponent, GraphicTwoComponent, CommonModule],
  templateUrl: './grafics.component.html',
  styleUrls: ['./grafics.component.scss'],
})
export class GraficsComponent implements OnInit {
  public graphicService = inject(GraphicsService);
  public graphic = signal<Graphic | null>(null);
  public graphicSelected: string = 'line';

  constructor() {}

  async ngOnInit(): Promise<void> {
    const res = await this.onGetGraphic();
    if (res.count === 0) {
      this.onAddGraphic(graphicLine);
      const res = await this.onAddGraphic(graphicBar);
      this.graphic.set(res);
    } else {
      this.onGetGraphic({ type: 'bar' });
    }
  }

  onGetGraphic(query: any = {}) {
    return new Promise<GraphicResponse>((resolve) => {
      this.graphicService.getGraphics(query).subscribe({
        next: (res) => {
          this.graphic.set(res.graphics[0]);
          resolve(res);
        },
        error: (err) => console.log(err),
      });
    });
  }

  onAddGraphic(graphic: Graphic) {
    return new Promise<Graphic>((resolve) => {
      this.graphicService.addGraphics(graphic).subscribe({
        next: (res) => {
          console.log({ res });
          resolve(res.graphic);
        },
        error: (err) => console.log(err),
      });
    });
  }
}
